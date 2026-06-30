import { describe, it, expect } from "vitest";
import {
  runGlobalSearch,
  normalizePaymentMethod,
  dobFromAge,
  displayPetAge,
  canAccessPage,
  ROLE_PAGES,
  DEFAULT_ROLE_PERMISSIONS,
} from "../utils/clinicHelpers";

const sampleDb = {
  owners: [{ id: 1, name: "Amit Patel", mobile: "9876543210", email: "owner@royalpet.com" }],
  pets: [{ id: 1, name: "Bruno", breed: "Labrador", type: "Dog", ownerId: 1, age: "3" }],
  visits: [{ id: 1, caseNum: "RPC-2026-001", petId: 1, date: "2026-01-15" }],
};

describe("clinicHelpers — search", () => {
  it("returns empty for short queries", () => {
    expect(runGlobalSearch(sampleDb, "B")).toEqual([]);
  });

  it("finds pets by name", () => {
    const results = runGlobalSearch(sampleDb, "bruno");
    expect(results.some((r) => r.type === "pet" && r.label === "Bruno")).toBe(true);
  });

  it("finds owners by phone", () => {
    const results = runGlobalSearch(sampleDb, "9876543210");
    expect(results.some((r) => r.type === "owner")).toBe(true);
  });

  it("finds visits by case number", () => {
    const results = runGlobalSearch(sampleDb, "rpc-2026");
    expect(results.some((r) => r.type === "visit")).toBe(true);
  });
});

describe("clinicHelpers — payments", () => {
  it("normalizes online payment methods", () => {
    expect(normalizePaymentMethod("UPI")).toBe("online");
    expect(normalizePaymentMethod("Credit Card")).toBe("online");
  });

  it("normalizes offline payment methods", () => {
    expect(normalizePaymentMethod("Cash")).toBe("offline");
  });
});

describe("clinicHelpers — pet age", () => {
  it("computes dob from age", () => {
    const dob = dobFromAge(3);
    expect(dob).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("displays age from pet.age field", () => {
    expect(displayPetAge({ age: "3" })).toBe("3 yrs");
  });

  it("displays dash when no age data", () => {
    expect(displayPetAge({})).toBe("—");
  });
});

describe("clinicHelpers — role page access", () => {
  it("admin can access system-admin", () => {
    expect(canAccessPage("admin", "system-admin")).toBe(true);
  });

  it("doctor cannot access system-admin", () => {
    expect(canAccessPage("doctor", "system-admin")).toBe(false);
  });

  it("receptionist can access analytics", () => {
    expect(canAccessPage("receptionist", "analytics")).toBe(true);
  });

  it("receptionist cannot access billing", () => {
    expect(canAccessPage("receptionist", "billing")).toBe(false);
  });

  it("owner can access owner portal pages only", () => {
    expect(canAccessPage("owner", "owner-home")).toBe(true);
    expect(canAccessPage("owner", "dashboard")).toBe(false);
  });

  it("respects custom role permissions when provided", () => {
    const perms = [{ feature: "billing", doctor: false, receptionist: true, admin: true, owner: false }];
    expect(canAccessPage("doctor", "billing", perms)).toBe(false);
    expect(canAccessPage("receptionist", "billing", perms)).toBe(true);
  });

  it("unknown role has no access", () => {
    expect(canAccessPage("staff", "dashboard")).toBe(false);
  });

  it("defines pages for all four roles", () => {
    expect(Object.keys(ROLE_PAGES).sort()).toEqual(["admin", "doctor", "owner", "receptionist"]);
  });
});

describe("clinicHelpers — role permissions matrix", () => {
  it("has entries for every staff feature", () => {
    const features = DEFAULT_ROLE_PERMISSIONS.map((r) => r.feature);
    expect(features).toContain("dashboard");
    expect(features).toContain("system-admin");
    expect(features).toContain("owner-portal");
  });

  it("only admin has system-admin permission", () => {
    const row = DEFAULT_ROLE_PERMISSIONS.find((r) => r.feature === "system-admin");
    expect(row.admin).toBe(true);
    expect(row.doctor).toBe(false);
    expect(row.receptionist).toBe(false);
    expect(row.owner).toBe(false);
  });
});
