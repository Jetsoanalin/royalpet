const rateLimit = require("express-rate-limit");
const env = require("../config/env");

const isVercel = Boolean(process.env.VERCEL);

const clientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return String(forwarded[0]).trim();
  }
  if (req.headers["x-real-ip"]) {
    return String(req.headers["x-real-ip"]);
  }
  return req.ip || "unknown";
};

const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  ...(isVercel
    ? {
        keyGenerator: (req) => clientIp(req),
        validate: { ip: false, xForwardedForHeader: false, trustProxy: false },
      }
    : {}),
});

module.exports = { apiLimiter };
