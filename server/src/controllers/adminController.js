const db = require("../db/knex");
const ApiError = require("../utils/ApiError");
const { loadOwnerContext } = require("../services/ownerContextService");
const { sendSuccess } = require("../utils/apiResponse");
const { getActivityLog, getActivityStats } = require("../services/activityService");

const flatToMatrix = (rows) => {
  const map = new Map();
  (rows || []).forEach((row) => {
    if (!map.has(row.feature)) map.set(row.feature, { feature: row.feature, admin: true });
    const entry = map.get(row.feature);
    entry[row.role] = row.allowed === true || row.allowed === 1;
  });
  return Array.from(map.values());
};

const safeQuery = async (fn, fallback = []) => {
  try {
    return await fn();
  } catch {
    return fallback;
  }
};

const buildScopedDump = async (user) => {
  const baseUserColumns = ["id", "name", "email", "role", "mobile", "active", "avatar", "lastLogin", "ownerId"];

  if (user.role === "owner") {
    const ctx = await loadOwnerContext({ user });
    const petIds = ctx?.petIds || [];
    const ownerId = ctx?.ownerId;
    const visitIdsQuery = db("visits").select("id").whereIn("petId", petIds.length ? petIds : [0]);

    const [users, owners, pets, visits, prescriptions, appointments, vaccinations, invoices, settings] = await Promise.all([
      db("users").select(baseUserColumns).where({ id: user.id }),
      ownerId ? db("owners").select().where({ id: ownerId }) : [],
      petIds.length ? db("pets").select().whereIn("id", petIds) : [],
      petIds.length ? db("visits").select().whereIn("petId", petIds) : [],
      petIds.length ? db("prescriptions").select().whereIn("visitId", visitIdsQuery) : [],
      ownerId ? db("appointments").select().where({ ownerId }) : [],
      petIds.length ? db("vaccinations").select().whereIn("petId", petIds) : [],
      petIds.length ? db("invoices").select().whereIn("petId", petIds) : [],
      db("clinic_settings").select().first(),
    ]);

    return {
      users,
      owners,
      pets,
      visits,
      prescriptions,
      appointments,
      vaccinations,
      inventory: [],
      invoices,
      activityLog: [],
      rolePermissions: [],
      supplierPayments: [],
      plannerTasks: [],
      clinicSettings: settings,
    };
  }

  const staffExtras = user.role === "admin"
    ? [
        safeQuery(() => db("activity_log").select()),
        safeQuery(() => db("role_permissions").select()),
        safeQuery(() => db("supplier_payments").select()),
      ]
    : user.role === "doctor"
      ? [Promise.resolve([]), Promise.resolve([]), safeQuery(() => db("supplier_payments").select())]
      : [Promise.resolve([]), Promise.resolve([]), Promise.resolve([])];

  const plannerQuery = safeQuery(() => db("planner_tasks").where({ userId: user.id }));

  const [
    users,
    owners,
    pets,
    visits,
    prescriptions,
    appointments,
    vaccinations,
    inventory,
    invoices,
    activityLog,
    rolePermissionsFlat,
    supplierPayments,
    plannerTasks,
    settings,
  ] = await Promise.all([
    db("users").select(baseUserColumns),
    db("owners").select(),
    db("pets").select(),
    db("visits").select(),
    db("prescriptions").select(),
    db("appointments").select(),
    db("vaccinations").select(),
    db("inventory").select(),
    db("invoices").select(),
    ...staffExtras,
    plannerQuery,
    db("clinic_settings").select().first(),
  ]);

  return {
    users,
    owners,
    pets,
    visits,
    prescriptions,
    appointments,
    vaccinations,
    inventory,
    invoices,
    activityLog,
    rolePermissions: flatToMatrix(rolePermissionsFlat),
    rolePermissionsFlat,
    supplierPayments,
    plannerTasks,
    clinicSettings: settings,
  };
};

const getBootstrap = async (req, res) => {
  const data = await buildScopedDump(req.user);
  return sendSuccess(res, data);
};

const getDbDump = async (req, res) => {
  const data = await buildScopedDump(req.user);
  return sendSuccess(res, data);
};

const getActivityLogs = async (req, res) => {
  if (req.user.role !== "admin") throw new ApiError(403, "Only admins can view activity logs");

  const { action, type, days, limit } = req.query;
  const startDate = days ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : null;

  const filters = {};
  if (action) filters.action = action;
  if (type) filters.type = type;
  if (startDate) filters.startDate = startDate;
  if (limit) filters.limit = parseInt(limit, 10);

  const logs = await getActivityLog(filters);
  const statsData = await getActivityStats(parseInt(days, 10) || 7);

  return sendSuccess(res, { logs, stats: statsData });
};

const getActivityStatsEndpoint = async (req, res) => {
  if (req.user.role !== "admin") throw new ApiError(403, "Only admins can view activity stats");

  const { days } = req.query;
  const stats = await getActivityStats(parseInt(days, 10) || 7);

  return sendSuccess(res, stats);
};

module.exports = { getBootstrap, getDbDump, getActivityLogs, getActivityStatsEndpoint, flatToMatrix };
