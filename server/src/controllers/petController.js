const db = require("../db/knex");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");
const { loadOwnerContext } = require("../services/ownerContextService");
const { insertWithId } = require("../services/tableService");

const listPets = async (req, res) => {
  let query = db("pets").leftJoin("owners", "pets.ownerId", "owners.id")
    .select("pets.*", "owners.name as ownerName", "owners.mobile as ownerMobile", "owners.email as ownerEmail");
  
  if (req.user.role === "owner") {
    const ctx = await loadOwnerContext(req);
    if (!ctx || !ctx.ownerId) return sendSuccess(res, []);
    query.where("pets.ownerId", ctx.ownerId);
  }
  
  const results = await query;
  return sendSuccess(res, results);
};

const getPet = async (req, res) => {
  const pet = await db("pets").where({ id: req.params.id }).first();
  if (!pet) throw new ApiError(404, "Pet not found");
  
  if (req.user.role === "owner") {
    const ctx = await loadOwnerContext(req);
    if (!ctx || !ctx.petIds.includes(pet.id)) throw new ApiError(403, "Forbidden");
  }
  
  const owner = pet.ownerId ? await db("owners").where({ id: pet.ownerId }).first() : null;
  return sendSuccess(res, { ...pet, owner });
};

const createPet = async (req, res) => {
  const { name, type, breed, dob, age, sex, weight, ownerId, photo, color } = req.body;
  if (!name || !ownerId) throw new ApiError(400, "Name and ownerId required");
  
  const owner = await db("owners").where({ id: ownerId }).first();
  if (!owner) throw new ApiError(404, "Owner not found");
  
  const id = await insertWithId("pets", {
    name,
    type: type || "Dog",
    breed: breed || "",
    dob: dob || null,
    age: age || "",
    sex: sex || "",
    weight: weight || 0,
    ownerId,
    photo: photo || "",
    color: color || "",
    alerts: JSON.stringify([]),
  });
  
  const pet = await db("pets").where({ id }).first();
  return sendSuccess(res, pet, "Pet created", 201);
};

const updatePet = async (req, res) => {
  const { name, type, breed, dob, age, sex, weight, ownerId, photo, color } = req.body;
  const existing = await db("pets").where({ id: req.params.id }).first();
  if (!existing) throw new ApiError(404, "Pet not found");
  
  if (req.user.role === "owner") {
    const ctx = await loadOwnerContext(req);
    if (!ctx || !ctx.petIds.includes(existing.id)) throw new ApiError(403, "Forbidden");
  }
  
  await db("pets").where({ id: req.params.id }).update({
    name: name !== undefined ? name : existing.name,
    type: type !== undefined ? type : existing.type,
    breed: breed !== undefined ? breed : existing.breed,
    dob: dob !== undefined ? dob : existing.dob,
    age: age !== undefined ? age : existing.age,
    sex: sex !== undefined ? sex : existing.sex,
    weight: weight !== undefined ? weight : existing.weight,
    ownerId: ownerId !== undefined ? ownerId : existing.ownerId,
    photo: photo !== undefined ? photo : existing.photo,
    color: color !== undefined ? color : existing.color,
    updatedAt: new Date(),
  });
  
  const pet = await db("pets").where({ id: req.params.id }).first();
  return sendSuccess(res, pet, "Pet updated");
};

const deletePet = async (req, res) => {
  const existing = await db("pets").where({ id: req.params.id }).first();
  if (!existing) throw new ApiError(404, "Pet not found");
  
  if (req.user.role === "owner") {
    const ctx = await loadOwnerContext(req);
    if (!ctx || !ctx.petIds.includes(existing.id)) throw new ApiError(403, "Forbidden");
  }
  
  await db("pets").where({ id: req.params.id }).delete();
  return sendSuccess(res, { id: req.params.id }, "Pet deleted");
};

const searchPets = async (req, res) => {
  const q = String(req.query.q || "").trim();
  const petId = String(req.query.petId || "").trim();
  const name = String(req.query.name || "").trim();
  const owner = String(req.query.owner || "").trim();
  const phone = String(req.query.phone || "").trim();

  const query = db("pets")
    .leftJoin("owners", "pets.ownerId", "owners.id")
    .select("pets.*", "owners.name as ownerName", "owners.mobile as ownerMobile", "owners.email as ownerEmail");

  if (req.user.role === "owner") {
    const ctx = await loadOwnerContext(req);
    if (!ctx || !ctx.ownerId) return sendSuccess(res, []);
    query.where("pets.ownerId", ctx.ownerId);
  }

  if (petId) query.where("pets.id", petId);
  if (name) query.whereRaw("pets.name LIKE ?", [`%${name}%`]);
  if (owner) query.whereRaw("owners.name LIKE ?", [`%${owner}%`]);
  if (phone) query.whereRaw("owners.mobile LIKE ?", [`%${phone}%`]);
  if (q) {
    query.where((builder) => {
      builder
        .where("pets.id", q)
        .orWhere("pets.name", "like", `%${q}%`)
        .orWhere("owners.name", "like", `%${q}%`)
        .orWhere("owners.mobile", "like", `%${q}%`);
    });
  }

  const results = await query;
  return sendSuccess(res, results);
};

module.exports = { listPets, getPet, createPet, updatePet, deletePet, searchPets };
