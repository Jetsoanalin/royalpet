const envName = process.env.NODE_ENV || "development";

const hasAppwriteEnv =
  process.env.APPWRITE_ENDPOINT &&
  process.env.APPWRITE_PROJECT_ID &&
  process.env.APPWRITE_API_KEY;

const useAppwrite =
  process.env.DATABASE_PROVIDER === "appwrite" ||
  (envName !== "test" && hasAppwriteEnv);

let db;

if (process.env.VERCEL && !useAppwrite) {
  throw new Error(
    "Vercel deployment requires Appwrite. Set DATABASE_PROVIDER=appwrite and APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY, JWT_SECRET in Vercel environment variables."
  );
}

if (envName === "test" || !useAppwrite) {
  db = require("./sqlDb");
} else {
  db = require("./appwriteDb");
}

module.exports = db;
