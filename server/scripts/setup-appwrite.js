#!/usr/bin/env node
/**
 * One-time Appwrite provisioning for Royal Pet Clinic.
 * Creates database, collections, attributes, storage bucket, and seed data.
 *
 * Usage (from /server):
 *   npm run setup:appwrite
 *
 * Required env:
 *   APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY
 * Optional:
 *   APPWRITE_DATABASE_ID (default: royalpetshop)
 *   APPWRITE_BUCKET_ID (default: royalpet-images)
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });
require("dotenv").config({ path: require("path").resolve(__dirname, "..", "..", ".env") });

const bcrypt = require("bcryptjs");
const { Client, Databases, Storage, ID, Permission, Role, Query } = require("node-appwrite");

const ENDPOINT = process.env.APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || process.env.VITE_APPWRITE_DATABASE_ID || "royalpetshop";
const BUCKET_ID = process.env.APPWRITE_BUCKET_ID || "royalpet-images";

if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
  console.error("Missing APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, or APPWRITE_API_KEY");
  process.exit(1);
}

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);
const storage = new Storage(client);

const COLLECTIONS = {
  users: [
    ["id", "integer", true],
    ["name", "string", true, 128],
    ["email", "string", true, 255],
    ["password", "string", true, 255],
    ["role", "string", true, 32],
    ["mobile", "string", false, 32],
    ["avatar", "string", false, 16],
    ["active", "boolean", false],
    ["lastLogin", "datetime", false],
    ["ownerId", "integer", false],
    ["createdAt", "datetime", false],
    ["updatedAt", "datetime", false],
  ],
  owners: [
    ["id", "integer", true],
    ["name", "string", true, 128],
    ["mobile", "string", false, 32],
    ["email", "string", false, 255],
    ["address", "string", false, 512],
    ["createdAt", "datetime", false],
    ["updatedAt", "datetime", false],
  ],
  pets: [
    ["id", "integer", true],
    ["name", "string", true, 128],
    ["type", "string", false, 64],
    ["breed", "string", false, 128],
    ["dob", "string", false, 32],
    ["sex", "string", false, 16],
    ["weight", "float", false],
    ["ownerId", "integer", false],
    ["photo", "string", false, 512],
    ["alerts", "string", false, 8192],
    ["color", "string", false, 64],
    ["createdAt", "datetime", false],
    ["updatedAt", "datetime", false],
  ],
  visits: [
    ["id", "integer", true],
    ["petId", "integer", false],
    ["caseNum", "string", false, 64],
    ["date", "string", false, 32],
    ["status", "string", false, 32],
    ["reason", "string", false, 255],
    ["temp", "string", false, 16],
    ["hr", "string", false, 16],
    ["rr", "string", false, 16],
    ["weight", "float", false],
    ["diagnosis", "string", false, 255],
    ["notes", "string", false, 8192],
    ["doctorId", "integer", false],
    ["emergency", "boolean", false],
    ["inventoryDeducted", "boolean", false],
    ["createdAt", "datetime", false],
    ["updatedAt", "datetime", false],
  ],
  prescriptions: [
    ["id", "integer", true],
    ["visitId", "integer", false],
    ["medicines", "string", false, 16384],
    ["createdAt", "datetime", false],
    ["updatedAt", "datetime", false],
  ],
  appointments: [
    ["id", "integer", true],
    ["petId", "integer", false],
    ["ownerId", "integer", false],
    ["date", "string", false, 32],
    ["time", "string", false, 16],
    ["type", "string", false, 64],
    ["status", "string", false, 32],
    ["notes", "string", false, 8192],
    ["createdAt", "datetime", false],
    ["updatedAt", "datetime", false],
  ],
  vaccinations: [
    ["id", "integer", true],
    ["petId", "integer", false],
    ["vaccine", "string", false, 128],
    ["given", "string", false, 32],
    ["next", "string", false, 32],
    ["batch", "string", false, 64],
    ["status", "string", false, 32],
    ["createdAt", "datetime", false],
    ["updatedAt", "datetime", false],
  ],
  inventory: [
    ["id", "integer", true],
    ["name", "string", false, 128],
    ["category", "string", false, 64],
    ["stock", "integer", false],
    ["unit", "string", false, 32],
    ["minStock", "integer", false],
    ["batch", "string", false, 64],
    ["expiry", "string", false, 32],
    ["price", "float", false],
    ["vendor", "string", false, 128],
    ["createdAt", "datetime", false],
    ["updatedAt", "datetime", false],
  ],
  invoices: [
    ["id", "integer", true],
    ["visitId", "integer", false],
    ["petId", "integer", false],
    ["ownerId", "integer", false],
    ["date", "string", false, 32],
    ["items", "string", false, 16384],
    ["total", "float", false],
    ["status", "string", false, 32],
    ["method", "string", false, 32],
    ["createdAt", "datetime", false],
    ["updatedAt", "datetime", false],
  ],
  activity_log: [
    ["id", "integer", true],
    ["time", "datetime", false],
    ["user", "string", false, 128],
    ["action", "string", false, 64],
    ["details", "string", false, 8192],
    ["type", "string", false, 32],
  ],
  clinic_settings: [
    ["id", "integer", true],
    ["name", "string", false, 128],
    ["doctor", "string", false, 128],
    ["phone", "string", false, 32],
    ["email", "string", false, 255],
    ["address", "string", false, 512],
    ["regNum", "string", false, 64],
    ["consultFee", "float", false],
    ["currency", "string", false, 8],
    ["createdAt", "datetime", false],
    ["updatedAt", "datetime", false],
  ],
  backup_logs: [
    ["id", "integer", true],
    ["label", "string", true, 128],
    ["trigger", "string", false, 32],
    ["createdBy", "string", false, 128],
    ["rowCount", "integer", false],
    ["snapshot", "string", false, 10000000],
    ["createdAt", "datetime", false],
  ],
  reminders: [
    ["id", "integer", true],
    ["type", "string", true, 64],
    ["refId", "integer", false],
    ["title", "string", true, 255],
    ["message", "string", false, 8192],
    ["dueDate", "string", false, 32],
    ["status", "string", false, 32],
    ["createdAt", "datetime", false],
    ["updatedAt", "datetime", false],
  ],
  role_permissions: [
    ["id", "integer", true],
    ["feature", "string", true, 64],
    ["role", "string", true, 32],
    ["allowed", "boolean", false],
    ["createdAt", "datetime", false],
    ["updatedAt", "datetime", false],
  ],
  supplier_payments: [
    ["id", "integer", true],
    ["vendor", "string", true, 128],
    ["item", "string", true, 512],
    ["qty", "integer", false],
    ["unitPrice", "float", false],
    ["total", "float", false],
    ["date", "string", false, 32],
    ["status", "string", false, 32],
    ["notes", "string", false, 1024],
    ["createdAt", "datetime", false],
    ["updatedAt", "datetime", false],
  ],
  planner_tasks: [
    ["id", "integer", true],
    ["userId", "integer", false],
    ["date", "string", false, 32],
    ["time", "string", false, 16],
    ["title", "string", true, 255],
    ["notes", "string", false, 2048],
    ["done", "boolean", false],
    ["createdAt", "datetime", false],
    ["updatedAt", "datetime", false],
  ],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ensureDatabase() {
  try {
    await databases.get(DATABASE_ID);
    console.log(`Database "${DATABASE_ID}" already exists`);
  } catch {
    await databases.create(DATABASE_ID, "Royal Pet Clinic");
    console.log(`Created database "${DATABASE_ID}"`);
  }
}

async function ensureCollection(collectionId) {
  try {
    await databases.getCollection(DATABASE_ID, collectionId);
    console.log(`  Collection "${collectionId}" exists`);
    return;
  } catch {
    await databases.createCollection(
      DATABASE_ID,
      collectionId,
      collectionId,
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
      ],
      false,
      true
    );
    console.log(`  Created collection "${collectionId}"`);
    await sleep(500);
  }
}

async function ensureAttribute(collectionId, spec) {
  const [key, type, required, size] = spec;
  try {
    if (type === "integer") await databases.getIntegerAttribute(DATABASE_ID, collectionId, key);
    else if (type === "float") await databases.getFloatAttribute(DATABASE_ID, collectionId, key);
    else if (type === "boolean") await databases.getBooleanAttribute(DATABASE_ID, collectionId, key);
    else if (type === "datetime") await databases.getDatetimeAttribute(DATABASE_ID, collectionId, key);
    else await databases.getStringAttribute(DATABASE_ID, collectionId, key);
    return;
  } catch {
    /* create below */
  }

  try {
    if (type === "integer") {
      await databases.createIntegerAttribute(DATABASE_ID, collectionId, key, required);
    } else if (type === "float") {
      await databases.createFloatAttribute(DATABASE_ID, collectionId, key, required);
    } else if (type === "boolean") {
      await databases.createBooleanAttribute(DATABASE_ID, collectionId, key, required, false);
    } else if (type === "datetime") {
      await databases.createDatetimeAttribute(DATABASE_ID, collectionId, key, required);
    } else {
      await databases.createStringAttribute(DATABASE_ID, collectionId, key, size || 255, required);
    }
    console.log(`    + attribute ${collectionId}.${key}`);
    await sleep(300);
  } catch (err) {
    if (err.code !== 409) throw err;
  }
}

async function ensureBucket() {
  try {
    await storage.getBucket(BUCKET_ID);
    console.log(`Bucket "${BUCKET_ID}" already exists`);
  } catch {
    await storage.createBucket(
      BUCKET_ID,
      "Royal Pet Images",
      [Permission.read(Role.any()), Permission.create(Role.any())],
      true,
      true
    );
    console.log(`Created bucket "${BUCKET_ID}"`);
  }
}

const DEFAULT_USERS = [
  { id: 1, name: "Super Admin", email: "admin@royalpet.com", plainPassword: "Admin@123", role: "admin", mobile: "+91-9000000001", avatar: "SA" },
  { id: 2, name: "Dr. Priya Sharma", email: "doctor@royalpet.com", plainPassword: "Doctor@123", role: "doctor", mobile: "+91-9000000002", avatar: "DPS" },
  { id: 3, name: "Rahul Staff", email: "staff@royalpet.com", plainPassword: "Staff@123", role: "receptionist", mobile: "+91-9000000003", avatar: "RS" },
  { id: 4, name: "Rajesh Kumar", email: "owner@royalpet.com", plainPassword: "Owner@123", role: "owner", mobile: "+91-9000000004", avatar: "RK" },
];

async function ensureDefaultUsers() {
  const now = new Date().toISOString();

  for (const spec of DEFAULT_USERS) {
    const existing = await databases.listDocuments(DATABASE_ID, "users", [Query.equal("email", spec.email)]);
    if (existing.total > 0) continue;

    const password = await bcrypt.hash(spec.plainPassword, 10);
    await databases.createDocument(DATABASE_ID, "users", ID.unique(), {
      id: spec.id,
      name: spec.name,
      email: spec.email,
      password,
      role: spec.role,
      mobile: spec.mobile,
      active: true,
      avatar: spec.avatar,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  + user ${spec.email}`);
  }
}

async function seedIfEmpty() {
  const existing = await databases.listDocuments(DATABASE_ID, "users", []);
  const settings = await databases.listDocuments(DATABASE_ID, "clinic_settings", []);

  if (settings.total === 0) {
    const now = new Date().toISOString();
    await databases.createDocument(DATABASE_ID, "clinic_settings", ID.unique(), {
      id: 1,
      name: "Royal Pet Clinic",
      doctor: "Dr. Admin",
      phone: "+91-9000000000",
      email: "admin@royalpet.com",
      address: "123 Vet Street, Mumbai, India",
      regNum: "VET-2024-001",
      consultFee: 500,
      currency: "INR",
      createdAt: now,
      updatedAt: now,
    });
    console.log("Seeded clinic_settings");
  }

  if (existing.total > 0) {
    console.log("Ensuring default users exist...");
  } else {
    console.log("Seeding default users...");
  }

  await ensureDefaultUsers();

  console.log("Default logins:");
  for (const spec of DEFAULT_USERS) {
    console.log(`  ${spec.email} / ${spec.plainPassword} (${spec.role})`);
  }
}

async function main() {
  console.log("Setting up Appwrite for Royal Pet Clinic...\n");
  await ensureDatabase();

  for (const [collectionId, attrs] of Object.entries(COLLECTIONS)) {
    await ensureCollection(collectionId);
    for (const spec of attrs) {
      await ensureAttribute(collectionId, spec);
    }
  }

  await ensureBucket();
  await seedIfEmpty();

  console.log("\nDone. Set these in Vercel:");
  console.log(`  DATABASE_PROVIDER=appwrite`);
  console.log(`  APPWRITE_DATABASE_ID=${DATABASE_ID}`);
  console.log(`  APPWRITE_BUCKET_ID=${BUCKET_ID}`);
  console.log(`  STORAGE_PROVIDER=appwrite`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
