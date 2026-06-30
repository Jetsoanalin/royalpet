const db = require("../db/knex");

const normalizeName = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const findInventoryMatch = (medicineName, trx = db) => {
  const needle = normalizeName(medicineName).split(" ")[0];
  if (!needle) return null;
  return trx("inventory")
    .whereRaw("LOWER(name) LIKE ?", [`%${needle}%`])
    .orderBy("stock", "desc")
    .first();
};

const deductMedicinesForVisit = async (visitId, medicines = []) => {
  if (!visitId || !Array.isArray(medicines) || medicines.length === 0) {
    return { deducted: [], notFound: [], alreadyDeducted: false };
  }

  return db.transaction(async (trx) => {
    const visit = await trx("visits").where({ id: visitId }).first();
    if (!visit) throw new Error("Visit not found");
    if (visit.inventoryDeducted) {
      return { deducted: [], notFound: [], alreadyDeducted: true };
    }

    const deducted = [];
    const notFound = [];

    for (const med of medicines) {
      const match = await findInventoryMatch(med.name, trx);
      if (!match || match.stock <= 0) {
        notFound.push(med.name);
        continue;
      }
      const qty = parseInt(med.duration, 10) || parseInt(med.qty, 10) || 1;
      const deductQty = Math.min(qty, match.stock);
      await trx("inventory").where({ id: match.id }).update({
        stock: Math.max(0, match.stock - deductQty),
        updatedAt: new Date(),
      });
      deducted.push({ name: match.name, qty: deductQty });
    }

    await trx("visits").where({ id: visitId }).update({
      inventoryDeducted: true,
      updatedAt: new Date(),
    });

    return { deducted, notFound, alreadyDeducted: false };
  });
};

module.exports = { deductMedicinesForVisit, findInventoryMatch };
