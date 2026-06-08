const path = require("path");
const fs = require("fs");
const express = require("express");

const env = require("./config/env");
const requestLogger = require("./middleware/requestLogger");
const { securityMiddleware } = require("./middleware/security");
const { apiLimiter } = require("./middleware/rateLimit");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const meRoutes = require("./routes/meRoutes");
const treatmentRoutes = require("./routes/treatmentRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const petRoutes = require("./routes/petRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const healthRoutes = require("./routes/healthRoutes");
const adminRoutes = require("./routes/adminRoutes");
const backupRoutes = require("./routes/backupRoutes");
const csvImportRoutes = require("./routes/csvImportRoutes");

const { startScheduler } = require("./services/backupService");

const app = express();

// Vercel sits behind a reverse proxy; use hop count 1 (not `true` — breaks rate-limit validation)
app.set("trust proxy", process.env.VERCEL || env.isProd ? 1 : false);

app.use(securityMiddleware);
app.use(requestLogger);
app.use(apiLimiter);
app.use(express.text({ type: ["text/*", "application/csv"], limit: "5mb" }));
app.use(express.json({ limit: "10mb" })); // Increased for backup restore payloads
app.use(express.urlencoded({ extended: false }));

app.use("/uploads", express.static(env.UPLOAD_DIR));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);
app.use("/api/users", userRoutes);
app.use("/api/treatments", treatmentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/admin", backupRoutes);       // /api/admin/backups
app.use("/api/import", csvImportRoutes);   // /api/import/pets-owners etc.
app.use("/api", adminRoutes);
app.use("/api", resourceRoutes);

// Serve built client if available (skip on Vercel — static assets served by the platform)
const clientDist = path.resolve(__dirname, "..", "..", "client", "dist");
const clientIndex = path.join(clientDist, "index.html");
const hasClient = !process.env.VERCEL && fs.existsSync(clientIndex);

if (hasClient) {
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(clientIndex);
  });
} else {
  app.get("/", (_req, res) => {
    res.status(200).send("Client not built. Run 'npm run build' in /client.");
  });
}

app.use(errorHandler);

// Start nightly backup scheduler (skip on Vercel — use /api/cron/backup instead)
if (!process.env.VERCEL) {
  startScheduler();
}

module.exports = app;
