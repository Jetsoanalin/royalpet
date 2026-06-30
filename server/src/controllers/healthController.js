const env = require("../config/env");
const { sendSuccess } = require("../utils/apiResponse");

const health = (_req, res) => sendSuccess(res, {
  ok: true,
  env: env.NODE_ENV,
  db: process.env.DATABASE_PROVIDER || (env.APPWRITE_API_KEY ? "appwrite" : "sql"),
  configured: {
    jwt: Boolean(env.JWT_SECRET),
    appwrite: Boolean(env.APPWRITE_ENDPOINT && env.APPWRITE_PROJECT_ID && env.APPWRITE_API_KEY),
  },
});

module.exports = { health };
