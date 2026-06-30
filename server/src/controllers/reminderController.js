const db = require("../db/knex");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");
const { syncReminders, listReminders } = require("../services/reminderService");
const { sendEmail } = require("../services/emailService");

const getSettings = async () => {
  const row = await db("clinic_settings").select().first();
  return row || {};
};

const resolveRecipient = async (reminder) => {
  if (reminder.type === "vaccination") {
    const vacc = await db("vaccinations").where({ id: reminder.refId }).first();
    if (!vacc) return null;
    const pet = await db("pets").where({ id: vacc.petId }).first();
    if (!pet) return null;
    const owner = await db("owners").where({ id: pet.ownerId }).first();
    return { owner, pet, vacc, email: owner?.email, context: { pet_name: pet.name, vaccine_name: vacc.vaccine, due_date: vacc.next, owner_name: owner?.name } };
  }
  if (reminder.type === "inventory_expiry" || reminder.type === "low_stock") {
    const item = await db("inventory").where({ id: reminder.refId }).first();
    const settings = await getSettings();
    return { email: settings.email, context: { item_name: item?.name, clinic_name: settings.name } };
  }
  return null;
};

const buildEmailBody = (reminder, settings, ctx) => {
  if (reminder.type === "vaccination") {
    const tpl = settings.reminderVaccTemplate || "Dear {owner_name}, {pet_name}'s {vaccine_name} is due on {due_date}.";
    const text = tpl.replace(/\{(\w+)\}/g, (_, k) => ctx.context?.[k] ?? "");
    return { subject: `Vaccination reminder: ${ctx.context?.pet_name}`, html: `<p>${text.replace(/\n/g, "<br>")}</p>`, text };
  }
  return {
    subject: reminder.title || "Clinic reminder",
    html: `<p>${reminder.message || reminder.title}</p>`,
    text: reminder.message || reminder.title,
  };
};

const sendOneReminder = async (reminder, settings) => {
  const ctx = await resolveRecipient(reminder);
  if (!ctx?.email) throw new ApiError(400, "No recipient email for this reminder");

  const { subject, html, text } = buildEmailBody(reminder, settings, ctx);
  await sendEmail({ to: ctx.email, subject, html, text });

  if (reminder.id) {
    await db("reminders").where({ id: reminder.id }).update({ status: "sent", updatedAt: new Date() });
  }
  return { id: reminder.id, email: ctx.email, status: "sent" };
};

const sendReminders = async (req, res) => {
  await syncReminders();
  const settings = await getSettings();
  const { reminderIds, type, refId } = req.body || {};

  let targets = [];
  if (Array.isArray(reminderIds) && reminderIds.length) {
    targets = await db("reminders").whereIn("id", reminderIds);
  } else if (type && refId) {
    targets = await db("reminders").where({ type, refId });
  } else {
    targets = await db("reminders").whereNot({ status: "sent" }).limit(100);
  }

  const results = [];
  const errors = [];
  for (const reminder of targets) {
    try {
      results.push(await sendOneReminder(reminder, settings));
    } catch (err) {
      errors.push({ id: reminder.id, error: err.message });
    }
  }

  if (!results.length && errors.length) {
    throw new ApiError(400, errors[0].error);
  }

  return sendSuccess(res, { sent: results.length, results, errors });
};

const list = async (_req, res) => {
  const reminders = await listReminders();
  return sendSuccess(res, reminders);
};

const sync = async (_req, res) => {
  const reminders = await syncReminders();
  return sendSuccess(res, reminders);
};

module.exports = { sendReminders, list, sync };
