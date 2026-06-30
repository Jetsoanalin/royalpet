process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";

const request = require("supertest");
const app = require("../src/app");
const { setupTestDb, destroyTestDb, loginAs } = require("./helpers/testDb");

beforeAll(async () => {
  await setupTestDb();
});

afterAll(async () => {
  await destroyTestDb();
});

describe("Health", () => {
  it("returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.ok).toBe(true);
  });
});

describe("Pets", () => {
  it("lists pets with auth", async () => {
    const res = await loginAs(request, app, "doctor");
    const list = await request(app)
      .get("/api/pets")
      .set("Authorization", `Bearer ${res.body.data.token}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body.data)).toBe(true);
    expect(list.body.data.length).toBeGreaterThan(0);
  });

  it("searches pets by owner phone", async () => {
    const res = await loginAs(request, app, "receptionist");
    const search = await request(app)
      .get("/api/pets/search?phone=9876543210")
      .set("Authorization", `Bearer ${res.body.data.token}`);
    expect(search.status).toBe(200);
    expect(search.body.data.length).toBeGreaterThan(0);
  });
});

describe("Appointments", () => {
  it("allows owners to create their own appointment", async () => {
    const res = await loginAs(request, app, "owner");
    const create = await request(app)
      .post("/api/appointments")
      .set("Authorization", `Bearer ${res.body.data.token}`)
      .send({
        petId: 1,
        date: "2026-04-30",
        time: "11:00",
        type: "Follow-up",
        status: "pending",
        notes: "Needs review",
      });
    expect(create.status).toBe(201);

    const list = await request(app)
      .get("/api/appointments")
      .set("Authorization", `Bearer ${res.body.data.token}`);
    expect(list.status).toBe(200);
    expect(list.body.data.some((item) => item.id === create.body.data.id)).toBe(true);
  });
});

describe("Treatments", () => {
  it("lists treatments", async () => {
    const res = await loginAs(request, app, "doctor");
    const list = await request(app)
      .get("/api/treatments")
      .set("Authorization", `Bearer ${res.body.data.token}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body.data)).toBe(true);
  });
});

describe("Inventory CSV upload", () => {
  it("uploads a CSV and inserts items", async () => {
    const res = await loginAs(request, app, "admin");
    const csv = "name,category,stock,unit,minStock,batch,expiry,price,vendor\nTest Med,Antibiotic,10,tablets,5,TST2026A,2026-12-31,20,TestVendor";
    const upload = await request(app)
      .post("/api/inventory/csv-upload")
      .set("Authorization", `Bearer ${res.body.data.token}`)
      .set("Content-Type", "text/csv")
      .send(csv);
    expect([201, 409]).toContain(upload.status);
  });
});

describe("Uploads", () => {
  it("stores an uploaded image and returns a public path", async () => {
    const res = await loginAs(request, app, "doctor");
    const upload = await request(app)
      .post("/api/uploads")
      .set("Authorization", `Bearer ${res.body.data.token}`)
      .attach("file", Buffer.from("fake-image"), "pet.jpg");
    expect(upload.status).toBe(201);
    expect(upload.body.data.file.path).toContain("/uploads/");
    expect(upload.body.data.file.provider).toBeTruthy();
  });
});
