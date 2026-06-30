const bcrypt = require("bcryptjs");
const db = require("../db/knex");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");

const getMe = async (req, res) => {
  const user = await db("users").where({ id: req.user.id }).first();
  if (!user) throw new ApiError(404, "User not found");
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    mobile: user.mobile,
    avatar: user.avatar,
    ownerId: user.ownerId,
  };
  return sendSuccess(res, safeUser);
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) throw new ApiError(400, "Current and new password required");
  if (String(newPassword).length < 6) throw new ApiError(400, "New password must be at least 6 characters");

  const user = await db("users").where({ id: req.user.id }).first();
  if (!user) throw new ApiError(404, "User not found");

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) throw new ApiError(401, "Current password is incorrect");

  const hash = await bcrypt.hash(newPassword, 10);
  await db("users").where({ id: user.id }).update({ password: hash, updatedAt: new Date() });
  return sendSuccess(res, { ok: true });
};

module.exports = { getMe, changePassword };
