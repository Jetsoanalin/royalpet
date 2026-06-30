/** Lightweight health check — no Express, fast cold start on Vercel */
module.exports = (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      ok: true,
      env: process.env.NODE_ENV || "unknown",
      configured: {
        jwt: Boolean(process.env.JWT_SECRET),
        appwrite: Boolean(
          process.env.APPWRITE_ENDPOINT &&
          process.env.APPWRITE_PROJECT_ID &&
          process.env.APPWRITE_API_KEY
        ),
        database: process.env.DATABASE_PROVIDER || "auto",
      },
    },
  });
};
