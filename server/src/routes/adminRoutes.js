const express = require("express");
const asyncHandler = require("../utils/asyncHandler");

const { authenticate, requireRole } = require("../middleware/auth");
const { getBootstrap, getDbDump, getActivityLogs, getActivityStatsEndpoint } = require("../controllers/adminController");
const { syncReminders, listReminders } = require("../services/reminderService");

const router = express.Router();

router.get("/bootstrap", authenticate, asyncHandler(getBootstrap));
router.get("/db", authenticate, requireRole(["admin"]), asyncHandler(getDbDump));
router.get("/activity-logs", authenticate, requireRole(["admin"]), asyncHandler(getActivityLogs));
router.get("/activity-stats", authenticate, requireRole(["admin"]), asyncHandler(getActivityStatsEndpoint));
router.get("/reminders", authenticate, requireRole(["admin", "doctor", "receptionist"]), asyncHandler(async (req, res) => {
  const reminders = await listReminders();
  return require("../utils/apiResponse").sendSuccess(res, reminders);
}));
router.post("/reminders/sync", authenticate, requireRole(["admin", "doctor", "receptionist"]), asyncHandler(async (req, res) => {
  const reminders = await syncReminders();
  return require("../utils/apiResponse").sendSuccess(res, reminders);
}));

module.exports = router;
