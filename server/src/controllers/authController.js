const bcrypt = require("bcryptjs");
const db = require("../db/knex");
const { createToken } = require("../services/authService");
const { hasOwnerIdColumn } = require("../services/ownerContextService");
const { insertWithId } = require("../services/tableService");
const { logActivity } = require("../services/activityService");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");

const register = async (req, res) => {
  const { name, email, password, role, mobile } = req.validated.body;

  const existing = await db("users").where({ email }).first();
  if (existing) throw new ApiError(409, "User already exists");

  const allowedRoles = ["owner", "doctor", "receptionist"];
  const safeRole = allowedRoles.includes(role) ? role : "owner";

  const hash = await bcrypt.hash(password, 10);
  const requiresApproval = safeRole === "doctor" || safeRole === "receptionist";
  const userPayload = {
    name,
    email,
    password: hash,
    role: safeRole,
    mobile,
    avatar: String(name).trim().split(/\s+/).map((p) => p[0]).join("").toUpperCase().slice(0, 3),
    active: !requiresApproval,
    lastLogin: null,
  };

  let user;
  const ownerIdColumnExists = await hasOwnerIdColumn();
  await db.transaction(async (trx) => {
    const userId = await insertWithId("users", userPayload, trx);

    if (safeRole === "owner" && ownerIdColumnExists) {
      const ownerId = await insertWithId("owners", { name, email, mobile, address: "" }, trx);
      await trx("users").where({ id: userId }).update({ ownerId });
    }

    const cols = ["id", "name", "email", "role", "mobile", "avatar"];
    if (ownerIdColumnExists) cols.push("ownerId");
    user = await trx("users").select(cols).where({ id: userId }).first();
  });

  if (requiresApproval) {
    await logActivity(user.id, "register", "user", user.id, { role: safeRole, pending: true }, "info");
    return sendSuccess(res, {
      user: { ...user, active: false },
      pendingApproval: true,
      message: "Registration submitted. An admin must approve your account before you can log in.",
    }, undefined, 201);
  }

  const token = createToken(user);
  await logActivity(user.id, "register", "user", user.id, { role: safeRole }, "info");
  return sendSuccess(res, { user, token }, undefined, 201);
};

const login = async (req, res) => {
  const { email, password } = req.validated.body;

  const user = await db("users").where({ email }).first();
  if (!user) throw new ApiError(401, "Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new ApiError(401, "Invalid credentials");

  if (user.active === false || user.active === 0) {
    throw new ApiError(403, "Pending admin approval. Please contact the clinic administrator.");
  }

  await db("users").where({ id: user.id }).update({ lastLogin: new Date() });

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    mobile: user.mobile,
    avatar: user.avatar,
    ownerId: user.ownerId,
  };
  const token = createToken(safeUser);
  await logActivity(user.id, "login", "user", user.id, { role: user.role }, "info");
  return sendSuccess(res, { user: safeUser, token });
};

module.exports = { register, login };
