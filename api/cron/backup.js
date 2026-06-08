const path = require("path");

module.paths.unshift(path.join(__dirname, "..", "..", "server", "node_modules"));

const app = require("../../server/src/app");
const { saveBackup } = require("../../server/src/services/backupService");
const logger = require("../../server/src/config/logger");

module.exports = async (req, res) => {
  const auth = req.headers.authorization || "";
  const cronSecret = process.env.CRON_SECRET || "";

  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const label = `nightly-${new Date().toISOString().split("T")[0]}`;
    const result = await saveBackup({ label, trigger: "scheduled", createdBy: "system" });
    logger.info(`[cron] Nightly backup complete: ${JSON.stringify(result)}`);
    return res.status(200).json({ ok: true, result });
  } catch (err) {
    logger.error(`[cron] Nightly backup failed: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
};
