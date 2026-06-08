const envName = process.env.NODE_ENV || "development";

const useAppwrite =
  process.env.DATABASE_PROVIDER === "appwrite" ||
  (envName !== "test" && process.env.APPWRITE_ENDPOINT && process.env.APPWRITE_PROJECT_ID && process.env.APPWRITE_API_KEY);

let db;

if (envName === "test" || !useAppwrite) {
  db = require("./sqlDb");
} else {
  db = require("./appwriteDb");
}

module.exports = db;
