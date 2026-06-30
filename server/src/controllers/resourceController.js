const db = require("../db/knex");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");
const { loadOwnerContext } = require("../services/ownerContextService");
const { sanitizePayload, insertWithId, buildListQuery, paginate, getTableColumns } = require("../services/tableService");
const { logActivity } = require("../services/activityService");

const OWNER_SCOPES = {
  owners: (query, ctx) => query.where("owners.id", ctx.ownerId),
  pets: (query, ctx) => query.where("pets.ownerId", ctx.ownerId),
  appointments: (query, ctx) => query.where("appointments.ownerId", ctx.ownerId),
  visits: (query, ctx) => query.whereIn("visits.petId", ctx.petIds),
  prescriptions: (query, ctx) => query.whereIn("prescriptions.visitId", db("visits").select("id").whereIn("petId", ctx.petIds)),
  vaccinations: (query, ctx) => query.whereIn("vaccinations.petId", ctx.petIds),
  invoices: (query, ctx) => query.whereIn("invoices.petId", ctx.petIds),
};

const REQUIRED_FIELDS = {
  owners: ["name"],
  pets: ["name"],
  visits: ["petId", "date", "status"],
  appointments: ["petId", "ownerId", "date", "time"],
  inventory: ["name", "category"],
  prescriptions: ["visitId", "medicines"],
  invoices: ["visitId", "petId", "ownerId", "date", "items", "total"],
  vaccinations: ["petId", "vaccine", "given"],
};

const requireFields = (payload, fields) => {
  const missing = [];
  for (const field of fields) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") missing.push(field);
  }
  return missing;
};

const applyOwnerPayloadScope = async (table, req, payload) => {
  if (req.user.role !== "owner") return payload;
  const ctx = await loadOwnerContext(req);
  if (!ctx || !ctx.ownerId) throw new ApiError(403, "Owner context not found");

  if (table === "appointments") {
    const scopedPayload = { ...payload, ownerId: ctx.ownerId };
    if (!ctx.petIds.includes(Number(scopedPayload.petId))) throw new ApiError(403, "Forbidden pet");
    return scopedPayload;
  }

  throw new ApiError(403, "Forbidden");
};

const listResources = (table) => async (req, res) => {
  const cols = await getTableColumns(table);
  let query = buildListQuery(table, cols, req.query);
  if (req.user.role === "owner" && OWNER_SCOPES[table]) {
    const ctx = await loadOwnerContext(req);
    if (!ctx || (!ctx.ownerId && !ctx.petIds.length)) return sendSuccess(res, [], { page: 1, limit: 20, total: 0, totalPages: 1 });
    query = OWNER_SCOPES[table](query, ctx);
  }

  const { data, meta } = await paginate(query, req.query.page, req.query.limit);
  return sendSuccess(res, data, meta);
};

const getResource = (table) => async (req, res) => {
  let query = db(table).where({ id: req.params.id });
  if (req.user.role === "owner" && OWNER_SCOPES[table]) {
    const ctx = await loadOwnerContext(req);
    if (!ctx || (!ctx.ownerId && !ctx.petIds.length)) throw new ApiError(404, "Not found");
    query = OWNER_SCOPES[table](query, ctx);
  }
  const row = await query.first();
  if (!row) throw new ApiError(404, "Not found");
  return sendSuccess(res, row);
};

const createResource = (table) => async (req, res) => {
  let payload = await sanitizePayload(table, req.body);
  if (!payload || typeof payload !== "object") throw new ApiError(400, "Invalid payload");
  payload = await applyOwnerPayloadScope(table, req, payload);
  const required = REQUIRED_FIELDS[table] || [];
  if (required.length) {
    const missing = requireFields(payload, required);
    if (missing.length) throw new ApiError(400, "Missing fields", missing);
  }
  const insertedId = await insertWithId(table, payload);
  await logActivity(req.user.id, `create_${table}`, table, insertedId, {}, "info");
  return sendSuccess(res, { id: insertedId }, undefined, 201);
};

const replaceResources = (table, allowBulk) => async (req, res) => {
  if (!allowBulk) throw new ApiError(403, "Bulk sync disabled");
  const rows = req.body;
  if (!Array.isArray(rows)) throw new ApiError(400, "Expected array");
  const cleaned = [];
  for (const row of rows) cleaned.push(await sanitizePayload(table, row));
  await db.transaction(async (trx) => {
    await trx(table).del();
    if (cleaned.length) await trx(table).insert(cleaned);
  });
  return sendSuccess(res, { ok: true });
};

const updateResource = (table) => async (req, res) => {
  let changes = await sanitizePayload(table, req.body);
  if (!changes || typeof changes !== "object") throw new ApiError(400, "Invalid payload");
  if (!Object.keys(changes).length) throw new ApiError(400, "Empty update payload");
  changes = await applyOwnerPayloadScope(table, req, changes);
  const cols = await getTableColumns(table);
  const updatePayload = cols.includes("updatedAt") ? { ...changes, updatedAt: new Date() } : changes;
  let query = db(table).where({ id: req.params.id });
  if (req.user.role === "owner" && OWNER_SCOPES[table]) {
    const ctx = await loadOwnerContext(req);
    if (!ctx || (!ctx.ownerId && !ctx.petIds.length)) throw new ApiError(404, "Not found");
    query = OWNER_SCOPES[table](query, ctx);
  }
  const count = await query.update(updatePayload);
  if (!count) throw new ApiError(404, "Not found");
  let updatedQuery = db(table).where({ id: req.params.id });
  if (req.user.role === "owner" && OWNER_SCOPES[table]) {
    const ctx = await loadOwnerContext(req);
    updatedQuery = OWNER_SCOPES[table](updatedQuery, ctx);
  }
  const updated = await updatedQuery.first();
  await logActivity(req.user.id, `update_${table}`, table, req.params.id, {}, "info");
  return sendSuccess(res, updated);
};

const deleteResource = (table) => async (req, res) => {
  let query = db(table).where({ id: req.params.id });
  if (req.user.role === "owner" && OWNER_SCOPES[table]) {
    const ctx = await loadOwnerContext(req);
    if (!ctx || (!ctx.ownerId && !ctx.petIds.length)) throw new ApiError(404, "Not found");
    query = OWNER_SCOPES[table](query, ctx);
  }
  const count = await query.del();
  if (!count) throw new ApiError(404, "Not found");
  return sendSuccess(res, { ok: true });
};

module.exports = {
  listResources,
  getResource,
  createResource,
  replaceResources,
  updateResource,
  deleteResource,
};
