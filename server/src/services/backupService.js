const db = require("../db/knex");
const logger = require("../config/logger");

// All tables to include in every backup snapshot (order matters for restore)
const BACKUP_TABLES = [
  "clinic_settings",
  "users",
  "owners",
  "pets",
  "visits",
  "prescriptions",
  "appointments",
  "vaccinations",
  "inventory",
  "invoices",
  "activity_log",
];

// ── Export ─────────────────────────────────────────────────────────────────

const exportSnapshot = async () => {
  const snapshot = {};
  let totalRows = 0;

  for (const table of BACKUP_TABLES) {
    try {
      const rows = await db(table).select("*");
      snapshot[table] = rows;
      totalRows += rows.length;
    } catch (err) {
      logger.warn(`[backup] Could not export table ${table}: ${err.message}`);
      snapshot[table] = [];
    }
  }

  return { snapshot, totalRows };
};

// ── Save to backup_logs table ─────────────────────────────────────────────

const saveBackup = async ({ label, trigger = "manual", createdBy = "system" }) => {
  const { snapshot, totalRows } = await exportSnapshot();

  // Keep only the last 30 scheduled backups to avoid bloating the table
  if (trigger === "scheduled") {
    const old = await db("backup_logs")
      .where("trigger", "scheduled")
      .orderBy("createdAt", "asc")
      .select("id");
    if (old.length >= 30) {
      const toDelete = old.slice(0, old.length - 29).map((r) => r.id);
      await db("backup_logs").whereIn("id", toDelete).delete();
    }
  }

  const [row] = await db("backup_logs")
    .insert({
      label,
      trigger,
      createdBy,
      rowCount: totalRows,
      snapshot: JSON.stringify(snapshot),
    })
    .returning("id");

  const id = row?.id ?? row;
  logger.info(`[backup] Saved backup #${id} "${label}" (${totalRows} rows, trigger: ${trigger})`);
  return { id, label, totalRows };
};

// ── Restore from a snapshot ───────────────────────────────────────────────

const restoreSnapshot = async (backupId) => {
  const record = await db("backup_logs").where({ id: backupId }).first();
  if (!record) throw new Error(`Backup #${backupId} not found`);

  let snapshot;
  try {
    snapshot = typeof record.snapshot === "string"
      ? JSON.parse(record.snapshot)
      : record.snapshot;
  } catch {
    throw new Error("Backup snapshot is corrupted");
  }

  await db.transaction(async (trx) => {
    const reversed = [...BACKUP_TABLES].reverse();
    for (const table of reversed) {
      try {
        await trx(table).del();
      } catch (err) {
        logger.warn(`[restore] Could not clear ${table}: ${err.message}`);
      }
    }

    for (const table of BACKUP_TABLES) {
      const rows = snapshot[table];
      if (!Array.isArray(rows) || !rows.length) continue;
      try {
        for (let i = 0; i < rows.length; i += 100) {
          await trx(table).insert(rows.slice(i, i + 100));
        }
      } catch (err) {
        logger.error(`[restore] Failed to restore ${table}: ${err.message}`);
        throw err;
      }
    }
  });

  logger.info(`[restore] Restored backup #${backupId} "${record.label}"`);
  return { restored: record.label, rowCount: record.rowCount };
};

// ── List backups ──────────────────────────────────────────────────────────

const listBackups = async () => {
  return db("backup_logs")
    .select("id", "label", "trigger", "createdBy", "rowCount", "createdAt")
    .orderBy("createdAt", "desc")
    .limit(50);
};

// ── Nightly scheduler (call once at server startup) ───────────────────────

let cronStarted = false;

const startScheduler = () => {
  if (process.env.NODE_ENV === "test") return;
  if (cronStarted) return;
  cronStarted = true;

  // Try to load node-cron — if not installed, log a warning and skip
  let cron;
  try {
    cron = require("node-cron");
  } catch {
    logger.warn("[backup] node-cron not installed — nightly backups disabled. Run: npm install node-cron");
    return;
  }

  // Runs every night at 02:00 AM server time
  cron.schedule("0 2 * * *", async () => {
    const label = `nightly-${new Date().toISOString().split("T")[0]}`;
    try {
      const result = await saveBackup({ label, trigger: "scheduled", createdBy: "system" });
      logger.info(`[backup] Nightly backup complete: ${JSON.stringify(result)}`);
    } catch (err) {
      logger.error(`[backup] Nightly backup FAILED: ${err.message}`);
    }
  });

  logger.info("[backup] Nightly backup scheduler started (runs at 02:00 AM daily)");
};

module.exports = { exportSnapshot, saveBackup, restoreSnapshot, listBackups, startScheduler };
