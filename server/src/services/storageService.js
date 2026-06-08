const fs = require("fs");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const env = require("../config/env");
const ApiError = require("../utils/ApiError");

const sanitizeFileName = (name) => String(name || "file").replace(/[^a-zA-Z0-9._-]/g, "_");

const buildObjectKey = (originalName) => {
  const ext = path.extname(originalName || "");
  const base = path.basename(originalName || "file", ext);
  return `royalpet/${Date.now()}-${sanitizeFileName(base)}${ext}`;
};

const buildPublicUrl = (key) => {
  if (env.STORAGE_PROVIDER === "s3") {
    const base = env.S3_PUBLIC_BASE_URL || env.STORAGE_PUBLIC_BASE_URL;
    if (!base) throw new ApiError(500, "Missing S3_PUBLIC_BASE_URL for remote storage");
    return `${base.replace(/\/$/, "")}/${key}`;
  }

  const base = env.STORAGE_PUBLIC_BASE_URL || "";
  const relative = `/uploads/${key}`;
  return base ? `${base.replace(/\/$/, "")}${relative}` : relative;
};

let s3Client = null;

const getS3Client = () => {
  if (s3Client) return s3Client;
  if (!env.S3_BUCKET || !env.S3_ENDPOINT || !env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY) {
    throw new ApiError(500, "S3 storage is not fully configured");
  }

  s3Client = new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    forcePathStyle: false,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
  });

  return s3Client;
};

const storeFile = async (file) => {
  if (!file || !file.buffer) throw new ApiError(400, "No file uploaded");

  const key = buildObjectKey(file.originalname);

  if (env.STORAGE_PROVIDER === "appwrite") {
    const { getStorage, ID } = require("../db/appwriteClient");
    const { InputFile } = require("node-appwrite/file");
    const storage = getStorage();
    const fileId = ID.unique();
    const upload = InputFile.fromBuffer(file.buffer, file.originalname);
    await storage.createFile(env.APPWRITE_BUCKET_ID, fileId, upload);
    const base = env.STORAGE_PUBLIC_BASE_URL || env.S3_PUBLIC_BASE_URL;
    const pathUrl = base
      ? `${base.replace(/\/$/, "")}/${key}`
      : `/uploads/${key}`;

    return {
      name: file.originalname,
      key: fileId,
      size: file.size,
      provider: "appwrite",
      path: pathUrl,
    };
  }

  if (env.STORAGE_PROVIDER === "s3") {
    const client = getS3Client();
    await client.send(new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || "application/octet-stream",
      CacheControl: "public, max-age=31536000, immutable",
    }));

    return {
      name: file.originalname,
      key,
      size: file.size,
      provider: "s3",
      path: buildPublicUrl(key),
    };
  }

  fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
  const target = path.join(env.UPLOAD_DIR, key);
  
  // Security: Verify the final path is within UPLOAD_DIR to prevent directory traversal
  const normalized = path.normalize(target);
  const uploadDirNormalized = path.normalize(env.UPLOAD_DIR);
  if (!normalized.startsWith(uploadDirNormalized + path.sep) && normalized !== uploadDirNormalized) {
    throw new ApiError(400, "Invalid file path");
  }
  
  fs.mkdirSync(path.dirname(normalized), { recursive: true });
  fs.writeFileSync(normalized, file.buffer);

  return {
    name: file.originalname,
    key,
    size: file.size,
    provider: "local",
    path: buildPublicUrl(key),
  };
};

module.exports = {
  storeFile,
};
