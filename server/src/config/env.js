const path = require("path");
const dotenv = require("dotenv");

const NODE_ENV = process.env.NODE_ENV || "development";
const isProd = NODE_ENV === "production";

// Load env from server root, then repo root (Vercel / monorepo)
dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });
dotenv.config({ path: path.resolve(__dirname, "..", "..", "..", ".env") });

const theEnv = {
  NODE_ENV,
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  CORS_ORIGINS: process.env.CORS_ORIGINS || "",
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX || 300),
  LOG_LEVEL: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.resolve(__dirname, "..", "uploads"),
  ALLOW_BULK_SYNC: process.env.ALLOW_BULK_SYNC === "true",
  DATABASE_PROVIDER: process.env.DATABASE_PROVIDER || "",
  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || "local",
  STORAGE_PUBLIC_BASE_URL: process.env.STORAGE_PUBLIC_BASE_URL || "",
  S3_BUCKET: process.env.S3_BUCKET || "",
  S3_REGION: process.env.S3_REGION || "auto",
  S3_ENDPOINT: process.env.S3_ENDPOINT || "",
  S3_PUBLIC_BASE_URL: process.env.S3_PUBLIC_BASE_URL || "",
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || "",
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || "",
  APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT || process.env.VITE_APPWRITE_ENDPOINT || "",
  APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID || process.env.VITE_APPWRITE_PROJECT_ID || "",
  APPWRITE_PROJECT_NAME: process.env.APPWRITE_PROJECT_NAME || process.env.VITE_APPWRITE_PROJECT_NAME || "",
  APPWRITE_API_KEY: process.env.APPWRITE_API_KEY || "",
  APPWRITE_DATABASE_ID: process.env.APPWRITE_DATABASE_ID || process.env.VITE_APPWRITE_DATABASE_ID || "royalpetshop",
  APPWRITE_BUCKET_ID: process.env.APPWRITE_BUCKET_ID || "royalpet-images",
};

if (isProd && !theEnv.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in production");
}

module.exports = { ...theEnv, isProd };
