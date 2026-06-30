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

export const canAccessPage = (role, page) => {
  if (!role || !page) return false;
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
      <td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.qty || 1}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${currency}${(i.rate || 0).toLocaleString()}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;font-weight:600">${currency}${(i.amt || 0).toLocaleString()}</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice #${invoice.id}</title>
  <style>
    *{box-sizing:border-box} body{font-family:Arial,sans-serif;margin:0;padding:24px;color:#1a1a2e}
    .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #c9973a;padding-bottom:16px;margin-bottom:20px}
    .clinic h1{margin:0;font-size:24px;color:#0d1f2d}.clinic p{margin:4px 0;font-size:12px;color:#666}
    .meta{text-align:right;font-size:12px}.meta strong{display:block;font-size:16px;margin-bottom:4px}
    table{width:100%;border-collapse:collapse;margin-top:12px} th{background:#f5f0e8;padding:8px;text-align:left;font-size:11px;text-transform:uppercase}
    .total{text-align:right;margin-top:16px;font-size:18px;font-weight:700}
    .footer{margin-top:32px;text-align:center;font-size:11px;color:#888;border-top:1px solid #eee;padding-top:12px}
    @media print{body{padding:0}.no-print{display:none!important}}
  </style></head><body>
  <div class="header">
    <div class="clinic">
      <h1>🐾 ${clinic?.name || "Royal Pet Clinic"}</h1>
      <p>${clinic?.doctor || ""}</p>
      <p>${clinic?.address || ""}</p>
      <p>📞 ${clinic?.phone || ""} · ${clinic?.email || ""}</p>
      <p>Reg: ${clinic?.regNum || "—"}</p>
    </div>
    <div class="meta">
      <strong>INVOICE #${invoice.id}</strong>
      <div>Date: ${invoice.date}</div>
      <div>Status: ${invoice.status || "paid"}</div>
      <div>Payment: ${invoice.method || "Cash"}</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
    <div style="background:#f9f7f4;padding:12px;border-radius:8px">
      <div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase">Bill To</div>
      <div style="font-weight:700;margin-top:4px">${owner?.name || "—"}</div>
      <div style="font-size:12px;color:#666">${owner?.mobile || ""}</div>
    </div>
    <div style="background:#f9f7f4;padding:12px;border-radius:8px">
      <div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase">Patient</div>
      <div style="font-weight:700;margin-top:4px">${pet?.name || "—"}</div>
      <div style="font-size:12px;color:#666">${pet?.breed || ""} · ${pet?.type || ""}</div>
    </div>
  </div>
  <table>
    <thead><tr><th>Description</th><th style="text-align:center">Qty</th><th style="text-align:right">Rate</th><th style="text-align:right">Amount</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="total">Total: ${currency}${(invoice.total || 0).toLocaleString()}</div>
  <div class="footer">Thank you for trusting ${clinic?.name || "Royal Pet Clinic"} with your pet's care.</div>
  <div class="no-print" style="margin-top:24px;display:flex;gap:10px;justify-content:center">
    <button onclick="window.print()" style="padding:10px 20px;background:#0d1f2d;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700">Print</button>
    <button onclick="window.close()" style="padding:10px 20px;background:#c9973a;color:#0d1f2d;border:none;border-radius:6px;cursor:pointer;font-weight:700">Close</button>
  </div>
  </body></html>`;
};
