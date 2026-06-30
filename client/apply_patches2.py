#!/usr/bin/env python3
from pathlib import Path

p = Path("src/pages/RoyalPetClinicApp.jsx")
t = p.read_text(encoding="utf-8")
applied = []
skipped = []

def rep(old, new, label, count=1):
    global t
    if old not in t:
        skipped.append(label)
        return
    t = t.replace(old, new, count)
    applied.append(label)

# Login demos already? check
rep('  const DEMOS = [', '  const __DEMOS_REMOVED = [', 'demos-marker')
if 'demos-marker' in applied:
    # undo and remove block properly
    t = p.read_text(encoding="utf-8")
    applied.clear()

# Auth login
rep('''  const DEMOS = [
    { label: "Doctor", email: "doctor@royalpet.in", pass: "doctor123", icon: "👨‍⚕️", desc: "Full clinical access", bg: "#0d1f2d" },
    { label: "Receptionist", email: "reception@royalpet.in", pass: "recep123", icon: "👩‍💼", desc: "Appointments & billing", bg: "#1d6a6a" },
    { label: "Admin", email: "admin@royalpet.in", pass: "admin123", icon: "🛠️", desc: "System administration", bg: "#7a1a1a" },
    { label: "Pet Owner", email: "owner@royalpet.in", pass: "owner123", icon: "🐾", desc: "View records & cards", bg: "#7a5c1e" },
  ];

  ''', '', 'remove-demos')
rep('''  const quickLogin = async (acc) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    try {
      await doLogin(acc.email, acc.pass);
    } catch {
      setErr("Invalid email or password.");
    }
  };

  ''', '', 'remove-quicklogin')

if '          {/* Demo Buttons */}' in t:
    i = t.index('          {/* Demo Buttons */}')
    j = t.index('          {/* Manual form */}', i)
    t = t[:i] + '          ' + t[j:]
    applied.append('demo-ui')

rep('''      await apiRequest("/auth/register", {
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
      }''', 'register')

rep('  .filter((item) => !["analytics","billing","inventory","suppliers","reminders","settings"].includes(item.id))',
    '  .filter((item) => !["billing","inventory","suppliers","reminders","settings"].includes(item.id))', 'nav-recep')

rep('function Sidebar({ page, setPage, user, collapsed, setCollapsed }) {',
    'function Sidebar({ page, setPage, user, collapsed, setCollapsed, mobileOpen, setMobileOpen }) {', 'sidebar-fn')

rep('  return (\n    <div className={`sidebar${collapsed ? " mini" : ""}`}>',
    '  return (\n    <>\n      <div className={`sidebar-backdrop${mobileOpen ? " show" : ""}`} onClick={() => setMobileOpen && setMobileOpen(false)} />\n      <div className={`sidebar${collapsed ? " mini" : ""}${mobileOpen ? " mobile-open" : ""}`}>', 'sidebar-wrap')

rep('              <div className={`s-item${page === item.id ? " on" : ""}`} onClick={() => setPage(item.id)} title={collapsed ? item.label : ""}>',
    '              <div className={`s-item${page === item.id ? " on" : ""}`} onClick={() => { setPage(item.id); setMobileOpen && setMobileOpen(false); }} title={collapsed ? item.label : ""}>', 'sidebar-click')

rep('    </div>\n  );\n}\n\nfunction Topbar({ page, setPage, user, onLogout, onSwitchUser, globalSearch, setGlobalSearch, activeSessions }) {',
    '    </div>\n    </>\n  );\n}\n\nfunction Topbar({ page, setPage, user, onLogout, onSwitchUser, globalSearch, setGlobalSearch, activeSessions, setConsultVisit, onMenuToggle }) {', 'sidebar-close')

rep('  const [readNotifs, setReadNotifs] = useState([]);',
    '  const [readNotifs, setReadNotifs] = useState(() => { try { return JSON.parse(localStorage.getItem("rpc_read_notifs") || "[]"); } catch { return []; } });\n  const [showSearch, setShowSearch] = useState(false);\n  const searchResults = useMemo(() => runGlobalSearch(db, globalSearch), [db, globalSearch]);', 'topbar-search-state')

rep('  return (\n    <div className="topbar" style={{ position: "relative" }}>\n      <div>',
    '  return (\n    <div className="topbar" style={{ position: "relative" }}>\n      <button className="btn-ico hamburger" onClick={onMenuToggle} aria-label="Menu">☰</button>\n      <div>', 'hamburger')

rep('''      {user.role !== "owner" && (
        <div className="srch" style={{ marginLeft: 20 }}>
          <span className="srch-ic">🔍</span>
          <input className="srch-inp" placeholder="Search pet, owner, case number..." value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} />
        </div>
      )}''',
'''      {user.role !== "owner" && (
        <div className="srch" style={{ marginLeft: 20, position: "relative" }}>
          <span className="srch-ic">🔍</span>
          <input className="srch-inp" placeholder="Search pet, owner, case number..." value={globalSearch}
            onChange={e => { setGlobalSearch(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)} />
          {showSearch && globalSearch.trim().length >= 2 && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "var(--white)", borderRadius: 10, boxShadow: "var(--s3)", border: "1px solid var(--bdr)", zIndex: 600, maxHeight: 280, overflowY: "auto" }}>
              {searchResults.length === 0 ? (
                <div style={{ padding: 14, fontSize: 12, color: "var(--txt3)", textAlign: "center" }}>No results found</div>
              ) : searchResults.map((r) => (
                <div key={`${r.type}-${r.id}`} onMouseDown={() => { setShowSearch(false); setGlobalSearch(""); if (r.page) setPage(r.page); if (r.visitId && setConsultVisit) { const visit = db.visits.find(v => v.id === r.visitId); if (visit) setConsultVisit(visit); } }}
                  style={{ padding: "10px 12px", borderBottom: "1px solid var(--bdr3)", cursor: "pointer" }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{r.type === "pet" ? "🐾" : r.type === "owner" ? "👤" : "📋"} {r.label}</div>
                  <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}>{r.sub}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}''', 'global-search')

rep('    receptionist: ["dashboard","queue","planner","appointments","patients","consultation","vaccination","timeline","certificates"],',
    '    receptionist: ["dashboard","queue","planner","appointments","patients","consultation","vaccination","timeline","certificates","analytics"],', 'role-pages')

rep('  const [collapsed, setCollapsed] = useState(false);\n  const [globalSearch, setGlobalSearch] = useState("");',
    '  const [collapsed, setCollapsed] = useState(false);\n  const [mobileOpen, setMobileOpen] = useState(false);\n  const [globalSearch, setGlobalSearch] = useState("");', 'mobile-state')

rep('<Sidebar page={page} setPage={setPageWithDB} user={user} collapsed={collapsed} setCollapsed={setCollapsed} />',
    '<Sidebar page={page} setPage={setPageWithDB} user={user} collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />', 'sidebar-props')

rep('<Topbar page={page} setPage={setPageWithDB} user={user} onLogout={logout} onSwitchUser={switchUser} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} activeSessions={activeSessions} />',
    '<Topbar page={page} setPage={setPageWithDB} user={user} onLogout={logout} onSwitchUser={switchUser} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} activeSessions={activeSessions} setConsultVisit={setConsultVisit} onMenuToggle={() => setMobileOpen(v => !v)} />', 'topbar-props')

rep('case "billing": return <BillingPage />;', 'case "billing": return <BillingPage setPage={setPageWithDB} />;', 'billing-route')

rep('<RegisterPage onBack={() => setAuthView("login")} onSuccess={() => { toast("Account created! Please sign in.","success"); setAuthView("login"); }} />',
    '''<RegisterPage onBack={() => setAuthView("login")} onSuccess={(status) => {
          if (status === "pending") {
            toast("Registration submitted! An admin must approve your account before you can log in.", "warning");
          } else {
            toast("Account created! Please sign in.", "success");
          }
          setAuthView("login");
        }} />''', 'register-ui')

p.write_text(t, encoding="utf-8")
print("Applied:", applied)
print("Skipped:", skipped)
