const bcrypt = require("bcryptjs");
const db = require("../db/knex");
const { hasOwnerIdColumn } = require("../services/ownerContextService");
const { insertWithId } = require("../services/tableService");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");

const listUsers = async (_req, res) => {
  const users = await db("users").select("id", "name", "email", "role", "mobile", "active", "avatar", "lastLogin");
  return sendSuccess(res, users);
};

const createUser = async (req, res) => {
  const { name, email, password, role, mobile, active } = req.validated.body;

  const existing = await db("users").where({ email }).first();
  if (existing) throw new ApiError(409, "User already exists");

  const allowedRoles = ["owner", "doctor", "receptionist", "admin"];
  const safeRole = allowedRoles.includes(role) ? role : "doctor";
  const hash = await bcrypt.hash(password, 10);
  const userPayload = {
    name,
    email,
    password: hash,
    role: safeRole,
    mobile,
    avatar: String(name).trim().split(/\s+/).map((p) => p[0]).join("").toUpperCase().slice(0, 3),
    active: active !== false,
    lastLogin: null,
  };

  let userId;
  const ownerIdColumnExists = await hasOwnerIdColumn();
  await db.transaction(async (trx) => {
    userId = await insertWithId("users", userPayload, trx);
    if (safeRole === "owner" && ownerIdColumnExists) {
      const ownerId = await insertWithId("owners", { name, mobile, email, address: "" }, trx);
      await trx("users").where({ id: userId }).update({ ownerId });
    }
  });

  const cols = ["id", "name", "email", "role", "mobile", "active", "avatar", "lastLogin"];
  if (ownerIdColumnExists) cols.push("ownerId");
  const user = await db("users").select(cols).where({ id: userId }).first();
  return sendSuccess(res, user, undefined, 201);
};

const updateUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, email, password, role, mobile, active } = req.validated.body;

  const existing = await db("users").where({ email }).andWhereNot({ id }).first();
  if (existing) throw new ApiError(409, "Email already exists");

  const allowedRoles = ["owner", "doctor", "receptionist", "admin"];
  const safeRole = allowedRoles.includes(role) ? role : "doctor";
  const updatePayload = {
    name,
    email,
    role: safeRole,
    mobile,
    active: active !== false,
    avatar: String(name).trim().split(/\s+/).map((p) => p[0]).join("").toUpperCase().slice(0, 3),
  };
  if (password) updatePayload.password = await bcrypt.hash(password, 10);

  const ownerIdColumnExists = await hasOwnerIdColumn();
  await db.transaction(async (trx) => {
    await trx("users").where({ id }).update(updatePayload);
    if (safeRole === "owner" && ownerIdColumnExists) {
      const user = await trx("users").where({ id }).first();
      if (!user.ownerId) {
        const ownerId = await insertWithId("owners", { name, mobile, email, address: "" }, trx);
        await trx("users").where({ id }).update({ ownerId });
      }
    }
  });

  const cols = ["id", "name", "email", "role", "mobile", "active", "avatar", "lastLogin"];
  if (ownerIdColumnExists) cols.push("ownerId");
  const user = await db("users").select(cols).where({ id }).first();
  return sendSuccess(res, user);
};

const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (id === req.user.id) throw new ApiError(400, "Cannot delete current user");
  await db("users").where({ id }).del();
  return sendSuccess(res, { ok: true });
};

module.exports = { listUsers, createUser, updateUser, deleteUser };
