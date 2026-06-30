const helmet = require("helmet");
const cors = require("cors");
const env = require("../config/env");

const buildCors = () => {
  const origins = env.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean);
  if (origins.length) {
    return cors({ origin: origins, credentials: true });
  }
  if (!env.isProd || process.env.VERCEL) {
    return cors({ origin: true, credentials: true });
  }
  return cors({ origin: false });
};

const securityMiddleware = [
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
  buildCors(),
];

module.exports = { securityMiddleware };
