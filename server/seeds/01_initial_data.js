const bcrypt = require("bcrypt");

exports.seed = async function (knex) {
  const existing = await knex("users").count("id as count").first();
  if (parseInt(existing.count) > 0) {
    console.log("[seed] Data already exists — skipping to protect live data.");
    return;
  }

  const isPostgres = knex.client.config.client === "pg";

  await knex("clinic_settings").insert([
    {
      id: 1,
      name: "Royal Pet Clinic",
      doctor: "Dr. Admin",
      phone: "+91-9000000000",
      email: "admin@royalpet.com",
      address: "123 Vet Street, Mumbai, India",
      regNum: "VET-2024-001",
      consultFee: 500,
      currency: "INR",
    },
  ]);

  const adminHash = await bcrypt.hash("Admin@123", 10);
  const doctorHash = await bcrypt.hash("Doctor@123", 10);
  const receptionHash = await bcrypt.hash("Recep@123", 10);
  const ownerHash = await bcrypt.hash("Owner@123", 10);

  await knex("owners").insert([
    {
      id: 1,
      name: "Amit Patel",
      mobile: "9876543210",
      email: "owner@royalpet.com",
      address: "Mumbai",
    },
  ]);

  await knex("users").insert([
    {
      id: 1,
      name: "Super Admin",
      email: "admin@royalpet.com",
      password: adminHash,
      role: "admin",
      mobile: "+91-9000000001",
      avatar: "SA",
      active: true,
      ownerId: null,
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      email: "doctor@royalpet.com",
      password: doctorHash,
      role: "doctor",
      mobile: "+91-9000000002",
      avatar: "PS",
      active: true,
      ownerId: null,
    },
    {
      id: 3,
      name: "Rahul Reception",
      email: "reception@royalpet.com",
      password: receptionHash,
      role: "receptionist",
      mobile: "+91-9000000003",
      avatar: "RR",
      active: true,
      ownerId: null,
    },
    {
      id: 4,
      name: "Amit Patel",
      email: "owner@royalpet.com",
      password: ownerHash,
      role: "owner",
      mobile: "9876543210",
      avatar: "AP",
      active: true,
      ownerId: 1,
    },
  ]);

  await knex("pets").insert([
    {
      id: 1,
      name: "Bruno",
      type: "Dog",
      breed: "Labrador",
      dob: "2020-03-15",
      sex: "Male",
      weight: 28,
      ownerId: 1,
      color: "Golden",
    },
  ]);

  if (isPostgres) {
    const tables = [
      "users",
      "owners",
      "pets",
      "visits",
      "prescriptions",
      "appointments",
      "vaccinations",
      "inventory",
      "invoices",
      "activity_log",
      "clinic_settings",
    ];

    for (const table of tables) {
      await knex.raw(`
        SELECT setval(
          pg_get_serial_sequence('${table}', 'id'),
          COALESCE((SELECT MAX(id) FROM "${table}"), 0) + 1,
          false
        )
      `);
    }

    console.log("[seed] PostgreSQL sequences reset successfully.");
  }

  console.log("[seed] Initial data seeded successfully.");
  console.log("[seed] Admin:        admin@royalpet.com      / Admin@123");
  console.log("[seed] Doctor:       doctor@royalpet.com     / Doctor@123");
  console.log("[seed] Receptionist: reception@royalpet.com  / Recep@123");
  console.log("[seed] Owner:        owner@royalpet.com      / Owner@123");
};
