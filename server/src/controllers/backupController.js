const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");
const { saveBackup, restoreSnapshot, listBackups, getBackupSnapshot } = require("../services/backupService");

// GET /api/admin/backups — list all saved backups
const getBackups = async (req, res) => {
  const backups = await listBackups();
  return sendSuccess(res, backups);
};

// POST /api/admin/backups — trigger a manual backup
const createBackup = async (req, res) => {
  const label = req.body?.label || `manual-${new Date().toISOString().split("T")[0]}`;
  const result = await saveBackup({
    label,
    trigger: "manual",
    createdBy: req.user?.email || req.user?.name || "admin",
  });
  return sendSuccess(res, result, "Backup created", 201);
};

// POST /api/admin/backups/:id/restore — restore from a saved backup
const restoreBackup = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) throw new ApiError(400, "Invalid backup ID");
  const result = await restoreSnapshot(id);
  return sendSuccess(res, result, "Database restored successfully");
};

// GET /api/admin/backups/download — download full snapshot or a saved backup as JSON file
const downloadBackup = async (req, res) => {
  const backupId = req.query.id ? Number(req.query.id) : null;
  const { snapshot, totalRows, label } = await getBackupSnapshot(backupId);
  const datePart = new Date().toISOString().split("T")[0];
  const filename = label
    ? `royalpet-backup-${label}-${datePart}.json`.replace(/[^\w.-]+/g, "-")
    : `royalpet-backup-${datePart}.json`;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(JSON.stringify({ exportedAt: new Date().toISOString(), totalRows, snapshot }, null, 2));
};

// POST /api/admin/backups/restore-upload — restore from uploaded JSON file
const restoreFromUpload = async (req, res) => {
  const { snapshot } = req.body || {};
  if (!snapshot || typeof snapshot !== "object") {
    throw new ApiError(400, "Invalid backup payload — expected { snapshot: {...} }");
  }

  // Save it as a new backup log first
  const { saveBackup: save, restoreSnapshot: doRestore } = require("../services/backupService");
  const db = require("../db/knex");

  // Save the uploaded snapshot to backup_logs
  const [row] = await db("backup_logs")
    .insert({
      label: `uploaded-${new Date().toISOString().split("T")[0]}`,
      trigger: "upload",
      createdBy: req.user?.email || "admin",
      rowCount: Object.values(snapshot).reduce((s, rows) => s + (Array.isArray(rows) ? rows.length : 0), 0),
      snapshot: JSON.stringify(snapshot),
    })
    .returning("id");

  const id = row?.id ?? row;
  const result = await doRestore(id);
  return sendSuccess(res, result, "Database restored from uploaded file");
};

module.exports = { getBackups, createBackup, restoreBackup, downloadBackup, restoreFromUpload };
