#!/usr/bin/env python3
"""Apply RoyalPet client feature patches to RoyalPetClinicApp.jsx"""
from pathlib import Path

p = Path("src/pages/RoyalPetClinicApp.jsx")
t = p.read_text(encoding="utf-8")

def rep(old, new, label):
    global t
    if old not in t:
        raise SystemExit(f"MISSING [{label}]")
    t = t.replace(old, new, 1)
    print(f"OK: {label}")

# 1. imports
rep(
    'import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";',
    '''import { useState, useEffect, useCallback, createContext, useContext, useRef, useMemo } from "react";
import {
  BREEDS_BY_TYPE, VITAL_OPTIONS, DEFAULT_ROLE_PERMISSIONS, PERMISSION_LABELS,
  dobFromAge, displayPetAge, runGlobalSearch, normalizePaymentMethod, buildInvoicePrintHtml,
} from "../utils/clinicHelpers";''',
    "imports")

# 2. mobile CSS
rep(
    '    @media(max-width:768px){.stats-grid{grid-template-columns:1fr 1fr};.sidebar{display:none}}',
    '''    @media(max-width:768px){
      .stats-grid{grid-template-columns:1fr 1fr}
      .content{padding:16px}
      .topbar{padding:0 12px;gap:8px}
      .srch{flex:1;min-width:0;margin-left:0!important}
      .modal,.modal-lg{width:96%!important;max-width:96%!important;margin:12px}
      .cols2,.cols3{grid-template-columns:1fr!important}
      .sidebar{position:fixed;left:0;top:0;bottom:0;transform:translateX(-100%);transition:transform .3s;box-shadow:var(--s4)}
      .sidebar.mobile-open{transform:translateX(0)}
      .sidebar-backdrop{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:199}
      .sidebar-backdrop.show{display:block}
      .hamburger{display:flex!important}
    }
    .hamburger{display:none;align-items:center;justify-content:center}''',
    "mobile-css")

# 3. Login - remove demos
rep(
    '''  const DEMOS = [
    { label: "Doctor", email: "doctor@royalpet.in", pass: "doctor123", icon: "👨‍⚕️", desc: "Full clinical access", bg: "#0d1f2d" },
    { label: "Receptionist", email: "reception@royalpet.in", pass: "recep123", icon: "👩‍💼", desc: "Appointments & billing", bg: "#1d6a6a" },
    { label: "Admin", email: "admin@royalpet.in", pass: "admin123", icon: "🛠️", desc: "System administration", bg: "#7a1a1a" },
    { label: "Pet Owner", email: "owner@royalpet.in", pass: "owner123", icon: "🐾", desc: "View records & cards", bg: "#7a5c1e" },
  ];

  ''',
    '',
    "remove-demos")

rep(
    '''  const quickLogin = async (acc) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    try {
      await doLogin(acc.email, acc.pass);
    } catch {
      setErr("Invalid email or password.");
    }
  };

  ''',
    '',
    "remove-quicklogin")

# Remove demo buttons block - find unique marker
demo_block_start = '          {/* Demo Buttons */}'
demo_block_end = '          {/* Manual form */}'
if demo_block_start in t:
    i = t.index(demo_block_start)
    j = t.index(demo_block_end, i)
    t = t[:i] + '          ' + t[j:]
    print("OK: remove-demo-ui")

# 4. Register pending
rep(
    '''      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          mobile: form.mobile,
        }),
      });
      setLoading(false);
      onSuccess();''',
    '''      const result = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          mobile: form.mobile,
        }),
      });
      setLoading(false);
      if (result?.pendingApproval || (form.role === "doctor" || form.role === "receptionist")) {
        onSuccess("pending");
      } else {
        onSuccess();
      }''',
    "register-pending")

# 5. NAV_RECEP
rep(
    '  .filter((item) => !["analytics","billing","inventory","suppliers","reminders","settings"].includes(item.id))',
    '  .filter((item) => !["billing","inventory","suppliers","reminders","settings"].includes(item.id))',
    "nav-recep")

# 6. Remove auto-restore
rep(
    '''  // "? Restore session on mount "?
  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;
    hydrateSession({ token }).catch(() => {
      clearStoredToken();
      setUser(null);
    });
  }, [hydrateSession]);

  ''',
    '',
    "remove-autorestore")

# 7. ROLE_PAGES receptionist
rep(
    '    receptionist: ["dashboard","queue","planner","appointments","patients","consultation","vaccination","timeline","certificates"],',
    '    receptionist: ["dashboard","queue","planner","appointments","patients","consultation","vaccination","timeline","certificates","analytics"],',
    "role-pages")

# 8. Register success handler
rep(
    '<RegisterPage onBack={() => setAuthView("login")} onSuccess={() => { toast("Account created! Please sign in.","success"); setAuthView("login"); }} />',
    '''<RegisterPage onBack={() => setAuthView("login")} onSuccess={(status) => {
          if (status === "pending") {
            toast("Registration submitted! An admin must approve your account before you can log in.", "warning");
          } else {
            toast("Account created! Please sign in.", "success");
          }
          setAuthView("login");
        }} />''',
    "register-success-ui")

# 9. mobileOpen state
rep(
    '  const [collapsed, setCollapsed] = useState(false);\n  const [globalSearch, setGlobalSearch] = useState("");',
    '  const [collapsed, setCollapsed] = useState(false);\n  const [mobileOpen, setMobileOpen] = useState(false);\n  const [globalSearch, setGlobalSearch] = useState("");',
    "mobile-state")

# 10. Shell props
rep(
    '<Sidebar page={page} setPage={setPageWithDB} user={user} collapsed={collapsed} setCollapsed={setCollapsed} />',
    '<Sidebar page={page} setPage={setPageWithDB} user={user} collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />',
    "sidebar-props")

rep(
    '<Topbar page={page} setPage={setPageWithDB} user={user} onLogout={logout} onSwitchUser={switchUser} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} activeSessions={activeSessions} />',
    '<Topbar page={page} setPage={setPageWithDB} user={user} onLogout={logout} onSwitchUser={switchUser} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} activeSessions={activeSessions} setConsultVisit={setConsultVisit} onMenuToggle={() => setMobileOpen(v => !v)} />',
    "topbar-props")

rep('case "billing": return <BillingPage />;', 'case "billing": return <BillingPage setPage={setPageWithDB} />;', "billing-page")

p.write_text(t, encoding="utf-8")
print("Patches applied - run manual sections separately if needed")
