const bcrypt = require("bcrypt");
const db = require("../../src/db/knex");

const CREDENTIALS = {
  admin: { email: "admin@royalpet.com", password: "Admin@123", role: "admin" },
  doctor: { email: "doctor@royalpet.com", password: "Doctor@123", role: "doctor" },
  receptionist: { email: "reception@royalpet.com", password: "Recep@123", role: "receptionist" },
  owner: { email: "owner@royalpet.com", password: "Owner@123", role: "owner" },
};

const setupTestDb = async () => {
  await db.migrate.latest();
  await db.seed.run();
};

const destroyTestDb = async () => {
  await db.destroy();
};

const loginAs = async (request, app, role) => {
  const creds = CREDENTIALS[role];
  if (!creds) throw new Error(`Unknown role: ${role}`);
  const res = await request(app).post("/api/auth/login").send({
    email: creds.email,
    password: creds.password,
  });
  return res;
};

module.exports = { CREDENTIALS, setupTestDb, destroyTestDb, loginAs, db };
