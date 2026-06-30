const express = require("express");
const asyncHandler = require("../utils/asyncHandler");

const { authenticate, requireRole } = require("../middleware/auth");
const { getBootstrap, getDbDump, getActivityLogs, getActivityStatsEndpoint } = require("../controllers/adminController");
const { sendReminders, list, sync } = require("../controllers/reminderController");
const db = require("../db/knex");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");

const router = express.Router();

router.get("/bootstrap", authenticate, asyncHandler(getBootstrap));
router.get("/db", authenticate, requireRole(["admin"]), asyncHandler(getDbDump));
router.get("/activity-logs", authenticate, requireRole(["admin"]), asyncHandler(getActivityLogs));
router.delete("/activity-logs", authenticate, requireRole(["admin"]), asyncHandler(async (_req, res) => {
  await db("activity_log").del();
  return sendSuccess(res, { ok: true });
}));
router.get("/activity-stats", authenticate, requireRole(["admin"]), asyncHandler(getActivityStatsEndpoint));
router.get("/reminders", authenticate, requireRole(["admin", "doctor", "receptionist"]), asyncHandler(list));
router.post("/reminders/sync", authenticate, requireRole(["admin", "doctor", "receptionist"]), asyncHandler(sync));
router.post("/reminders/send", authenticate, requireRole(["admin", "doctor", "receptionist"]), asyncHandler(sendReminders));

module.exports = router;
