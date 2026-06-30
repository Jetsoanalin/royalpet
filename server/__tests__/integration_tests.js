const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db/knex");

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";

let adminToken, doctorToken, receptionToken;

const setupDatabase = async () => {
  await db.migrate.latest();
  await db.seed.run();
};

const loginUser = async (email, password) => {
  const res = await request(app).post("/api/auth/login").send({ email, password });
  if (res.status !== 200) {
    throw new Error(`Login failed for ${email}: ${res.body.error?.message || res.body.error}`);
  }
  return res.body.data.token;
};

describe("INTEGRATION TESTS - Full API Flow", () => {
  beforeAll(async () => {
    await setupDatabase();
    adminToken = await loginUser("admin@royalpet.com", "Admin@123");
    doctorToken = await loginUser("doctor@royalpet.com", "Doctor@123");
    receptionToken = await loginUser("reception@royalpet.com", "Recep@123");
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe("Enhanced Pet Management API", () => {
    it("lists all pets", async () => {
      const res = await request(app)
        .get("/api/pets")
        .set("Authorization", `Bearer ${doctorToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("lists pets via resource endpoint", async () => {
      const res = await request(app)
        .get("/api/pets")
        .set("Authorization", `Bearer ${doctorToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("searches pets by name", async () => {
      const res = await request(app)
        .get("/api/pets/search?name=")
        .set("Authorization", `Bearer ${doctorToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("Inventory Management API", () => {
    it("lists inventory items", async () => {
      const res = await request(app)
        .get("/api/inventory")
        .set("Authorization", `Bearer ${doctorToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("creates inventory item", async () => {
      const res = await request(app)
        .post("/api/inventory")
        .set("Authorization", `Bearer ${doctorToken}`)
        .send({
          name: "Amoxicillin",
          category: "Antibiotics",
          stock: 100,
          unit: "tablets",
          minStock: 10,
          price: 5.50,
        });
      
      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Amoxicillin");
    });

    it("filters low stock items", async () => {
      const res = await request(app)
        .get("/api/inventory?lowStock=true")
        .set("Authorization", `Bearer ${doctorToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("Activity Logging", () => {
    it("admin can view activity logs", async () => {
      const res = await request(app)
        .get("/api/activity-logs")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(typeof res.body).toBe("object");
    });

    it("non-admin cannot view activity logs", async () => {
      const res = await request(app)
        .get("/api/activity-logs")
        .set("Authorization", `Bearer ${doctorToken}`);
      
      expect(res.status).toBe(403);
    });

    it("admin can view activity statistics", async () => {
      const res = await request(app)
        .get("/api/activity-stats?days=7")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("Authorization & Security", () => {
    it("rejects requests without token", async () => {
      const res = await request(app).get("/api/pets");
      expect(res.status).toBe(401);
    });

    it("rejects requests with invalid token", async () => {
      const res = await request(app)
        .get("/api/pets")
        .set("Authorization", "Bearer invalid-token");
      expect(res.status).toBe(401);
    });

    it("receptionist role cannot delete pets", async () => {
      const listRes = await request(app)
        .get("/api/pets")
        .set("Authorization", `Bearer ${doctorToken}`);
      
      if (listRes.body.data.length > 0) {
        const petId = listRes.body.data[0].id;
        const res = await request(app)
          .delete(`/api/pets/${petId}`)
          .set("Authorization", `Bearer ${receptionToken}`);
        
        expect(res.status).toBe(403);
      }
    });
  });

  describe("Error Handling", () => {
    it("returns 404 for non-existent pet", async () => {
      const res = await request(app)
        .get("/api/pets/99999")
        .set("Authorization", `Bearer ${doctorToken}`);
      
      expect(res.status).toBe(404);
    });

    it("returns 400 for invalid inventory creation", async () => {
      const res = await request(app)
        .post("/api/inventory")
        .set("Authorization", `Bearer ${doctorToken}`)
        .send({ category: "Test" }); // Missing name
      
      expect(res.status).toBe(400);
    });
  });

  describe("Data Visibility", () => {
    it("bootstrap returns full data for admin", async () => {
      const res = await request(app)
        .get("/api/bootstrap")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.inventory).toBeDefined();
      expect(res.body.data.users).toBeDefined();
    });
  });
});
