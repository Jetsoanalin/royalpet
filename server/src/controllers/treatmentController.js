const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");
const { fetchTreatments } = require("../services/treatmentService");
const { loadOwnerContext } = require("../services/ownerContextService");
const { insertWithId } = require("../services/tableService");
const { deductMedicinesForVisit } = require("../services/inventoryDeductionService");
const { logActivity } = require("../services/activityService");

const listTreatments = async (req, res) => {
  let petId = req.query.petId;
  if (req.user.role === "owner") {
    const ctx = await loadOwnerContext(req);
    if (!ctx || !ctx.petIds.length) return sendSuccess(res, []);
    if (petId && !ctx.petIds.includes(Number(petId))) return sendSuccess(res, []);
    if (!petId) {
      const treatments = await fetchTreatments({ petIds: ctx.petIds });
      return sendSuccess(res, treatments);
    }
  }
  const treatments = await fetchTreatments({ petId });
  return sendSuccess(res, treatments);
};

const getTreatment = async (req, res) => {
  const treatments = await fetchTreatments({ visitId: req.params.id });
  if (!treatments.length) throw new ApiError(404, "Not found");
  if (req.user.role === "owner") {
    const ctx = await loadOwnerContext(req);
    if (!ctx || !ctx.petIds.includes(treatments[0].petId)) throw new ApiError(403, "Forbidden");
  }
  return sendSuccess(res, treatments[0]);
};

const createTreatment = async (req, res) => {
  const payload = req.body;
  if (!payload || typeof payload !== "object") throw new ApiError(400, "Invalid payload");
  const required = ["petId", "date", "status"];
  const missing = required.filter((f) => payload[f] === undefined || payload[f] === null || payload[f] === "");
  if (missing.length) throw new ApiError(400, "Missing fields", missing);

  // Add owner context validation for owner-role users
  if (req.user.role === "owner") {
    const ctx = await loadOwnerContext(req);
    if (!ctx || !ctx.petIds.includes(Number(payload.petId))) {
      throw new ApiError(403, "Forbidden: pet does not belong to your account");
    }
  }

  const { medicines, ...visitData } = payload;
  const visitId = await insertWithId("visits", visitData);

  if (Array.isArray(medicines) && medicines.length) {
    await insertWithId("prescriptions", { visitId, medicines });
  }

  const treatments = await fetchTreatments({ visitId });
  await logActivity(req.user.id, "create_treatment", "visit", visitId, { petId: payload.petId }, "info");
  return sendSuccess(res, treatments[0], undefined, 201);
};

const deductInventory = async (req, res) => {
  const visitId = Number(req.params.id);
  const { medicines } = req.body || {};
  if (!visitId) throw new ApiError(400, "Invalid visit id");
  if (!Array.isArray(medicines) || !medicines.length) throw new ApiError(400, "Medicines array required");

  const result = await deductMedicinesForVisit(visitId, medicines);
  await logActivity(req.user.id, "inventory_deduct", "visit", visitId, result, "info");
  return sendSuccess(res, result);
};

module.exports = { listTreatments, getTreatment, createTreatment, deductInventory };
