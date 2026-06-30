process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";

const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../src/app");
const { setupTestDb, destroyTestDb, loginAs, CREDENTIALS, db } = require("./helpers/testDb");

beforeAll(async () => {
  await setupTestDb();
});

afterAll(async () => {
  await destroyTestDb();
});

describe("Auth — login (all roles)", () => {
  for (const [role, creds] of Object.entries(CREDENTIALS)) {
    it(`logs in seeded ${role} and returns correct role`, async () => {
      const res = await loginAs(request, app, role);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeTruthy();
      expect(res.body.data.user.role).toBe(creds.role);
      expect(res.body.data.user.email).toBe(creds.email);
    });
  }

  it("rejects invalid password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: CREDENTIALS.doctor.email,
      password: "wrong-password",
    });
    expect(res.status).toBe(401);
  });

  it("rejects unknown email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nobody@royalpet.com",
      password: "anything",
    });
    expect(res.status).toBe(401);
  });
});

describe("Auth — registration", () => {
  it("registers owner as active with token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "New Owner",
      email: "newowner@test.com",
      password: "ownerpass",
      role: "owner",
      mobile: "9000000099",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.user.role).toBe("owner");
    expect(res.body.data.pendingApproval).toBeFalsy();

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "newowner@test.com",
      password: "ownerpass",
    });
    expect(loginRes.status).toBe(200);
  });

  it("registers doctor as inactive without token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Pending Doctor",
      email: "pendingdoc@test.com",
      password: "docpass1",
      role: "doctor",
      mobile: "9000000001",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.pendingApproval).toBe(true);
    expect(res.body.data.token).toBeFalsy();
    expect(res.body.data.user.active).toBe(false);

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "pendingdoc@test.com",
      password: "docpass1",
    });
    expect(loginRes.status).toBe(403);
    expect(loginRes.body.error.message).toMatch(/approval/i);
  });

  it("registers receptionist as inactive without token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Pending Reception",
      email: "pendingrec@test.com",
      password: "recpass1",
      role: "receptionist",
      mobile: "9000000002",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.pendingApproval).toBe(true);
    expect(res.body.data.token).toBeFalsy();

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "pendingrec@test.com",
      password: "recpass1",
    });
    expect(loginRes.status).toBe(403);
  });

  it("defaults unknown role to owner", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Fallback Owner",
      email: "fallback@test.com",
      password: "pass1234",
      role: "admin",
      mobile: "9000000003",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe("owner");
    expect(res.body.data.token).toBeTruthy();
  });

  it("rejects duplicate email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Duplicate",
      email: CREDENTIALS.doctor.email,
      password: "pass1234",
      role: "doctor",
    });
    expect(res.status).toBe(409);
  });
});

describe("Auth — admin approval flow", () => {
  it("allows login after admin activates pending user", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Approve Me",
      email: "approveme@test.com",
      password: "approve1",
      role: "doctor",
      mobile: "9000000004",
    });

    const blocked = await request(app).post("/api/auth/login").send({
      email: "approveme@test.com",
      password: "approve1",
    });
    expect(blocked.status).toBe(403);

    const user = await db("users").where({ email: "approveme@test.com" }).first();
    await db("users").where({ id: user.id }).update({ active: true });

    const allowed = await request(app).post("/api/auth/login").send({
      email: "approveme@test.com",
      password: "approve1",
    });
    expect(allowed.status).toBe(200);
    expect(allowed.body.data.user.role).toBe("doctor");
  });
});

describe("Auth — role-based API access", () => {
  it("owner cannot access admin user list", async () => {
    const res = await loginAs(request, app, "owner");
    const list = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${res.body.data.token}`);
    expect(list.status).toBe(403);
  });

  it("admin can list users", async () => {
    const res = await loginAs(request, app, "admin");
    const list = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${res.body.data.token}`);
    expect(list.status).toBe(200);
    expect(list.body.data.length).toBeGreaterThanOrEqual(4);
  });

  it("receptionist cannot delete pets", async () => {
    const res = await loginAs(request, app, "receptionist");
    const del = await request(app)
      .delete("/api/pets/1")
      .set("Authorization", `Bearer ${res.body.data.token}`);
    expect(del.status).toBe(403);
  });

  it("admin can access activity logs", async () => {
    const res = await loginAs(request, app, "admin");
    const logs = await request(app)
      .get("/api/activity-logs")
      .set("Authorization", `Bearer ${res.body.data.token}`);
    expect(logs.status).toBe(200);
  });

  it("doctor cannot access activity logs", async () => {
    const res = await loginAs(request, app, "doctor");
    const logs = await request(app)
      .get("/api/activity-logs")
      .set("Authorization", `Bearer ${res.body.data.token}`);
    expect(logs.status).toBe(403);
  });

  it("owner bootstrap is scoped to own pets only", async () => {
    const res = await loginAs(request, app, "owner");
    const bootstrap = await request(app)
      .get("/api/bootstrap")
      .set("Authorization", `Bearer ${res.body.data.token}`);
    expect(bootstrap.status).toBe(200);
    expect(bootstrap.body.data.inventory).toEqual([]);
    expect(bootstrap.body.data.pets.every((p) => p.ownerId === 1)).toBe(true);
    expect(bootstrap.body.data.users).toHaveLength(1);
  });

  it("admin bootstrap includes inventory and all users", async () => {
    const res = await loginAs(request, app, "admin");
    const bootstrap = await request(app)
      .get("/api/bootstrap")
      .set("Authorization", `Bearer ${res.body.data.token}`);
    expect(bootstrap.status).toBe(200);
    expect(Array.isArray(bootstrap.body.data.inventory)).toBe(true);
    expect(bootstrap.body.data.users.length).toBeGreaterThanOrEqual(4);
  });

  it("receptionist can list inventory", async () => {
    const res = await loginAs(request, app, "receptionist");
    const inv = await request(app)
      .get("/api/inventory")
      .set("Authorization", `Bearer ${res.body.data.token}`);
    expect(inv.status).toBe(200);
  });

  it("owner cannot list inventory", async () => {
    const res = await loginAs(request, app, "owner");
    const inv = await request(app)
      .get("/api/inventory")
      .set("Authorization", `Bearer ${res.body.data.token}`);
    expect(inv.status).toBe(403);
  });
});

describe("Auth — admin user management", () => {
  it("admin can create active staff user", async () => {
    const adminRes = await loginAs(request, app, "admin");
    const create = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminRes.body.data.token}`)
      .send({
        name: "Created Doctor",
        email: "createddoc@test.com",
        password: "docpass2",
        role: "doctor",
        mobile: "9000000005",
        active: true,
      });
    expect(create.status).toBe(201);
    expect(create.body.data.role).toBe("doctor");

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "createddoc@test.com",
      password: "docpass2",
    });
    expect(loginRes.status).toBe(200);
  });

  it("admin can deactivate user to block login", async () => {
    const hash = await bcrypt.hash("temppass", 10);
    const [id] = await db("users").insert({
      name: "Temp User",
      email: "tempuser@test.com",
      password: hash,
      role: "receptionist",
      mobile: "9000000006",
      active: true,
      avatar: "TU",
    });

    const adminRes = await loginAs(request, app, "admin");
    await request(app)
      .put(`/api/users/${id}`)
      .set("Authorization", `Bearer ${adminRes.body.data.token}`)
      .send({
        name: "Temp User",
        email: "tempuser@test.com",
        role: "receptionist",
        mobile: "9000000006",
        active: false,
      });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "tempuser@test.com",
      password: "temppass",
    });
    expect(loginRes.status).toBe(403);
  });
});
