export const BREEDS_BY_TYPE = {
  Dog: ["Labrador", "German Shepherd", "Golden Retriever", "Beagle", "Pug", "Indian Pariah", "Rottweiler", "Shih Tzu", "Doberman", "Husky", "Other"],
  Cat: ["Persian", "Siamese", "Maine Coon", "Indian Cat", "British Shorthair", "Bengal", "Other"],
  Bird: ["Parrot", "Lovebird", "Cockatiel", "Budgerigar", "Other"],
  Rabbit: ["Dutch", "Angora", "Lop", "Other"],
  Cattle: ["Holstein", "Jersey", "Sahiwal", "Other"],
  Horse: ["Arabian", "Thoroughbred", "Marwari", "Other"],
  Reptile: ["Iguana", "Gecko", "Snake", "Other"],
  Fish: ["Goldfish", "Koi", "Betta", "Other"],
  Hamster: ["Syrian", "Dwarf", "Other"],
  "Guinea Pig": ["American", "Abyssinian", "Other"],
  Other: ["Mixed", "Unknown", "Other"],
};

export const VITAL_OPTIONS = {
  temp: ["—", "98.0", "99.0", "100.0", "100.5", "101.0", "101.5", "102.0", "102.5", "103.0", "104.0", "Custom"],
  hr: ["—", "60", "70", "80", "90", "100", "110", "120", "130", "140", "Custom"],
  rr: ["—", "10", "12", "15", "18", "20", "24", "28", "30", "35", "Custom"],
};

export const ROLE_PAGES = {
  admin: ["dashboard", "queue", "planner", "appointments", "patients", "consultation", "vaccination", "timeline", "certificates", "billing", "inventory", "suppliers", "analytics", "reminders", "system-admin", "settings", "admin-users", "admin-sessions", "admin-activity"],
  doctor: ["dashboard", "queue", "planner", "appointments", "patients", "consultation", "vaccination", "timeline", "certificates", "billing", "inventory", "suppliers", "analytics", "reminders", "settings"],
  receptionist: ["dashboard", "queue", "planner", "appointments", "patients", "consultation", "vaccination", "timeline", "certificates", "analytics"],
  owner: ["owner-home", "owner-petinfo", "owner-book-apt", "owner-records", "owner-vaccines", "owner-appointments", "owner-prescriptions"],
};

const PAGE_FEATURE_MAP = {
  dashboard: "dashboard",
  queue: "queue",
  planner: "dashboard",
  appointments: "appointments",
  patients: "dashboard",
  consultation: "consultation",
  vaccination: "vaccination",
  timeline: "consultation",
  certificates: "consultation",
  billing: "billing",
  inventory: "inventory",
  suppliers: "inventory",
  analytics: "analytics",
  reminders: "dashboard",
  "system-admin": "system-admin",
  settings: "settings",
  "admin-users": "system-admin",
  "admin-sessions": "system-admin",
  "admin-activity": "system-admin",
  "owner-home": "owner-portal",
  "owner-petinfo": "owner-portal",
  "owner-book-apt": "owner-portal",
  "owner-records": "owner-portal",
  "owner-vaccines": "owner-portal",
  "owner-appointments": "owner-portal",
  "owner-prescriptions": "owner-portal",
};

export const canAccessPage = (role, page, rolePermissions) => {
  if (!role || !page) return false;
  const feature = PAGE_FEATURE_MAP[page];
  if (rolePermissions?.length && feature) {
    const row = rolePermissions.find((r) => r.feature === feature);
    if (row && row[role] !== undefined) return !!row[role];
  }
  const allowed = ROLE_PAGES[role] || [];
  return allowed.includes(page);
};

export const DEFAULT_ROLE_PERMISSIONS = [
  { feature: "dashboard", doctor: true, receptionist: true, admin: true, owner: false },
  { feature: "queue", doctor: true, receptionist: true, admin: true, owner: false },
  { feature: "appointments", doctor: true, receptionist: true, admin: true, owner: true },
  { feature: "consultation", doctor: true, receptionist: true, admin: true, owner: false },
  { feature: "vaccination", doctor: true, receptionist: true, admin: true, owner: true },
  { feature: "billing", doctor: true, receptionist: true, admin: true, owner: false },
  { feature: "inventory", doctor: true, receptionist: true, admin: true, owner: false },
  { feature: "analytics", doctor: true, receptionist: true, admin: true, owner: false },
  { feature: "settings", doctor: true, receptionist: false, admin: true, owner: false },
  { feature: "system-admin", doctor: false, receptionist: false, admin: true, owner: false },
  { feature: "owner-portal", doctor: false, receptionist: false, admin: false, owner: true },
];

export const PERMISSION_LABELS = {
  dashboard: "Dashboard",
  queue: "Patient Queue",
  appointments: "Appointments",
  consultation: "Consultation / Diagnosis",
  vaccination: "Vaccination Records",
  billing: "Billing & Invoices",
  inventory: "Inventory",
  analytics: "Analytics & Reports",
  settings: "Settings",
  "system-admin": "System Administration",
  "owner-portal": "View Own Pets (Portal)",
};

export const matrixToFlatPermissions = (matrix) => {
  const rows = [];
  (matrix || []).forEach((row) => {
    ["doctor", "receptionist", "admin", "owner"].forEach((role) => {
      if (row[role] !== undefined) {
        rows.push({ feature: row.feature, role, allowed: !!row[role] });
      }
    });
  });
  return rows;
};

export const dobFromAge = (ageYears) => {
  const n = parseFloat(ageYears);
  if (!n || Number.isNaN(n)) return "";
  const d = new Date();
  d.setFullYear(d.getFullYear() - Math.floor(n));
  d.setMonth(d.getMonth() - Math.round((n % 1) * 12));
  return d.toISOString().split("T")[0];
};

export const displayPetAge = (pet) => {
  if (pet?.age) return `${pet.age} yr${parseFloat(pet.age) === 1 ? "" : "s"}`;
  if (pet?.dob) {
    const years = Math.floor((Date.now() - new Date(pet.dob)) / (365.25 * 24 * 60 * 60 * 1000));
    if (years < 1) return "< 1 yr";
    return `${years} yr${years === 1 ? "" : "s"}`;
  }
  return "—";
};

export const runGlobalSearch = (db, query) => {
  const q = (query || "").trim().toLowerCase();
  if (!q || q.length < 2) return [];
  const results = [];

  db.pets.forEach((p) => {
    const owner = db.owners.find((o) => o.id === p.ownerId);
    if (
      p.name?.toLowerCase().includes(q) ||
      p.breed?.toLowerCase().includes(q) ||
      owner?.name?.toLowerCase().includes(q) ||
      owner?.mobile?.includes(q)
    ) {
      results.push({
        type: "pet",
        id: p.id,
        label: p.name,
        sub: `${owner?.name || "Unknown"} · ${p.breed || p.type}`,
        page: "patients",
        petId: p.id,
      });
    }
  });

  db.owners.forEach((o) => {
    if (o.name?.toLowerCase().includes(q) || o.mobile?.includes(q) || o.email?.toLowerCase().includes(q)) {
      const pets = db.pets.filter((p) => p.ownerId === o.id);
      results.push({
        type: "owner",
        id: o.id,
        label: o.name,
        sub: `${o.mobile || ""} · ${pets.length} pet${pets.length === 1 ? "" : "s"}`,
        page: "patients",
        ownerId: o.id,
      });
    }
  });

  db.visits.forEach((v) => {
    if (v.caseNum?.toLowerCase().includes(q)) {
      const p = db.pets.find((pet) => pet.id === v.petId);
      results.push({
        type: "visit",
        id: v.id,
        label: v.caseNum,
        sub: `${p?.name || "Patient"} · ${v.date}`,
        page: "consultation",
        visitId: v.id,
      });
    }
  });

  const seen = new Set();
  return results.filter((r) => {
    const key = `${r.type}-${r.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 8);
};

export const normalizePaymentMethod = (method) => {
  const m = (method || "").toLowerCase();
  if (m.includes("online") || m.includes("upi") || m.includes("card") || m.includes("net")) return "online";
  return "offline";
};

export const buildInvoicePrintHtml = ({ clinic, invoice, pet, owner, currency = "₹" }) => {
  const items = invoice.items || [];
  const rows = items.map((i) => `
    <tr>
      <td>${i.name}</td>
      <td style="text-align:center">${i.qty}</td>
      <td style="text-align:right">${currency}${Number(i.rate || 0).toLocaleString()}</td>
      <td style="text-align:right">${currency}${Number(i.amt || 0).toLocaleString()}</td>
    </tr>`).join("");

  return `<!DOCTYPE html><html><head><title>Invoice ${invoice.id}</title>
    <style>body{font-family:Georgia,serif;padding:40px;color:#111}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ccc;padding:8px}th{background:#1a3347;color:#fff}@media print{body{padding:0}.no-print{display:none!important}}</style>
    </head><body>
    <h1>${clinic?.name || "Royal Pet Clinic"}</h1>
    <p>${clinic?.address || ""}<br>${clinic?.phone || ""}</p>
    <h2>Invoice #${invoice.id}</h2>
    <p><strong>Pet:</strong> ${pet?.name || ""} · <strong>Owner:</strong> ${owner?.name || ""}</p>
    <table><thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table>
    <p style="text-align:right;font-size:18px;font-weight:bold">Total: ${currency}${Number(invoice.total || 0).toLocaleString()}</p>
    </body></html>`;
};
