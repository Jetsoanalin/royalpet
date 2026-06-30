const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { authenticate, requireRole } = require("../middleware/auth");
const env = require("../config/env");
const {
  listResources,
  getResource,
  createResource,
  replaceResources,
  updateResource,
  deleteResource,
} = require("../controllers/resourceController");

const router = express.Router();

const registerResource = (name, allowRoles = ["admin", "doctor", "receptionist"], allowCreate = true, readRoles) => {
  const viewRoles = readRoles || ["admin", "doctor", "receptionist", "owner"];
  const bulkRoles = name === "appointments" ? allowRoles.filter((role) => role !== "owner") : allowRoles;
  const allowBulk = env.ALLOW_BULK_SYNC;

  router.get(`/${name}`, authenticate, requireRole(viewRoles), asyncHandler(listResources(name)));
  router.get(`/${name}/:id`, authenticate, requireRole(viewRoles), asyncHandler(getResource(name)));

  if (allowCreate) {
    router.post(`/${name}`, authenticate, requireRole(allowRoles), asyncHandler(createResource(name)));
  }

  router.put(`/${name}`, authenticate, requireRole(bulkRoles), asyncHandler((req, res, next) => replaceResources(name, allowBulk)(req, res, next)));
  router.put(`/${name}/:id`, authenticate, requireRole(allowRoles), asyncHandler(updateResource(name)));
  router.delete(`/${name}/:id`, authenticate, requireRole(allowRoles), asyncHandler(deleteResource(name)));
};

registerResource("owners", ["admin", "receptionist"]);
registerResource("pets", ["admin", "doctor", "receptionist"]);
registerResource("visits", ["admin", "doctor", "receptionist"]);
registerResource("appointments", ["admin", "doctor", "receptionist", "owner"]);
registerResource("inventory", ["admin", "doctor", "receptionist"], true, ["admin", "doctor", "receptionist"]);
registerResource("prescriptions", ["admin", "doctor"]);
registerResource("invoices", ["admin", "doctor", "receptionist"]);
registerResource("vaccinations", ["admin", "doctor", "receptionist"]);
registerResource("role_permissions", ["admin"], true, ["admin"]);
registerResource("supplier_payments", ["admin", "doctor", "receptionist"]);
registerResource("planner_tasks", ["admin", "doctor", "receptionist", "owner"]);
registerResource("activity_log", ["admin"], false, ["admin"]);
registerResource("clinic_settings", ["admin"], false, ["admin"]);

module.exports = router;
