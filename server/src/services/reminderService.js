const cron = require("node-cron");
const db = require("../db/knex");

const buildReminders = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in30 = new Date(today);
  in30.setDate(in30.getDate() + 30);

  const reminders = [];

  const vaccinations = await db("vaccinations").select("*");
  for (const v of vaccinations) {
    if (!v.next) continue;
    const due = new Date(v.next);
    if (due <= in30) {
      reminders.push({
        type: "vaccination",
        refId: v.id,
        title: `Vaccination due: ${v.vaccine}`,
        message: `Pet ID ${v.petId} — ${v.vaccine} due on ${v.next}`,
        dueDate: v.next,
        status: due < today ? "overdue" : "pending",
      });
    }
  }

  const inventory = await db("inventory").select("*");
  for (const item of inventory) {
    if (!item.expiry) continue;
    const exp = new Date(item.expiry);
    if (exp <= in30) {
      reminders.push({
        type: "inventory_expiry",
        refId: item.id,
        title: `Inventory expiry: ${item.name}`,
        message: `${item.name} (${item.batch || "no batch"}) expires on ${item.expiry}`,
        dueDate: item.expiry,
        status: exp < today ? "overdue" : "pending",
      });
    }
    if (item.stock <= item.minStock) {
      reminders.push({
        type: "low_stock",
        refId: item.id,
        title: `Low stock: ${item.name}`,
        message: `${item.name} has ${item.stock} ${item.unit || "units"} remaining`,
        dueDate: today.toISOString().split("T")[0],
        status: "pending",
      });
    }
  }

  return reminders;
};

const syncReminders = async () => {
  const reminders = await buildReminders();
  for (const r of reminders) {
    const existing = await db("reminders")
      .where({ type: r.type, refId: r.refId, status: r.status })
      .first();
    if (!existing) {
      await db("reminders").insert({ ...r, createdAt: new Date(), updatedAt: new Date() });
    }
  }
  return reminders;
};

const listReminders = async () => {
  const rows = await db("reminders").orderBy("dueDate", "asc").limit(100);
  return rows;
};

let started = false;
const startReminderScheduler = () => {
  if (process.env.NODE_ENV === "test") return;
  if (started) return;
  started = true;
  cron.schedule("0 8 * * *", async () => {
    try {
      await syncReminders();
    } catch (err) {
      console.error("Reminder sync failed:", err);
    }
  });
};

module.exports = { buildReminders, syncReminders, listReminders, startReminderScheduler };
