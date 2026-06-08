import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";

/* ROYAL PET CLINIC - Complete Management System
   Full-stack simulation: Auth, Routing, Role-based Dashboards, All Modules */

// Global Styles
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    :root {
      --ink: #0d1f2d; --ink-mid: #1a3347; --ink-soft: #2a4a6a;
      --gold: #c9973a; --gold-lt: #e8bb6e; --gold-pale: #fdf6e8; --gold-dim: #7a5c1e;
      --teal: #1d6a6a; --teal-lt: #2d9c9c; --teal-pale: #e8f5f5;
      --cream: #faf8f4; --white: #fffefb; --canvas: #f4f1eb;
      --txt: #1a1a2e; --txt2: #4a5a6a; --txt3: #8a9aaa; --txt4: #b0bcc8;
      --bdr: #e0dbd4; --bdr2: #ede8e0; --bdr3: #f5f2ec;
      --red: #c0392b; --red-bg: #fdf0ee; --grn: #1e7e4e; --grn-bg: #e8f5ee;
      --org: #d4691a; --org-bg: #fdf3e8; --blu: #1a5fa0; --blu-bg: #e8f0fb;
      --r: 12px; --r-lg: 18px; --r-xl: 24px;
      --s1: 0 2px 8px rgba(13,31,45,.06); --s2: 0 4px 20px rgba(13,31,45,.10);
      --s3: 0 8px 40px rgba(13,31,45,.14); --s4: 0 20px 60px rgba(13,31,45,.20);
    }
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{height:100%;font-family:'Plus Jakarta Sans',sans-serif;background:var(--cream);color:var(--txt);overflow-x:hidden}
    #root{height:100%}
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:var(--bdr3)}
    ::-webkit-scrollbar-thumb{background:var(--txt4);border-radius:3px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideRight{from{transform:translateX(-24px);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes pop{0%{transform:scale(.7);opacity:0}80%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
    .fu{animation:fadeUp .35s ease forwards}
    .fi{animation:fadeIn .25s ease forwards}
    .sr{animation:slideRight .3s ease forwards}
    /* Layout */
    .shell{display:flex;height:100vh;overflow:hidden}
    .sidebar{width:256px;min-width:256px;background:var(--ink);display:flex;flex-direction:column;transition:width .3s;z-index:200}
    .sidebar.mini{width:64px;min-width:64px}
    .main{flex:1;display:flex;flex-direction:column;overflow:hidden}
    .topbar{height:60px;background:var(--white);border-bottom:1px solid var(--bdr);display:flex;align-items:center;padding:0 24px;gap:14px;flex-shrink:0;box-shadow:var(--s1)}
    .content{flex:1;overflow-y:auto;padding:28px;background:var(--canvas)}
    /* Sidebar */
    .s-logo{padding:18px 16px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:11px;cursor:default}
    .s-logo-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--gold),var(--gold-lt));display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
    .s-logo-name{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:700;color:#fff;line-height:1.2}
    .s-logo-sub{font-size:9px;color:rgba(255,255,255,.35);letter-spacing:.12em;text-transform:uppercase}
    .s-section{padding:10px 0 2px}
    .s-sec-label{font-size:9px;text-transform:uppercase;letter-spacing:.14em;color:rgba(255,255,255,.25);padding:6px 18px 3px;font-weight:700;white-space:nowrap;overflow:hidden}
    .s-item{display:flex;align-items:center;gap:11px;padding:9px 16px;cursor:pointer;color:rgba(255,255,255,.55);font-size:13px;font-weight:500;transition:all .18s;border-left:3px solid transparent;position:relative;white-space:nowrap;overflow:hidden}
    .s-item:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.9)}
    .s-item.on{background:rgba(201,151,58,.12);color:var(--gold-lt);border-left-color:var(--gold)}
    .s-icon{font-size:17px;flex-shrink:0;width:20px;text-align:center}
    .s-badge{margin-left:auto;background:var(--gold);color:var(--ink);font-size:10px;font-weight:800;padding:1px 6px;border-radius:10px;flex-shrink:0;animation:pop .3s}
    .s-divider{height:1px;background:rgba(255,255,255,.06);margin:6px 14px}
    /* Cards */
    .card{background:var(--white);border-radius:var(--r-lg);border:1px solid var(--bdr);box-shadow:var(--s1);overflow:hidden}
    .card-head{padding:16px 20px 13px;border-bottom:1px solid var(--bdr2);display:flex;align-items:center;justify-content:space-between}
    .card-body{padding:18px 20px}
    .card-title{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700;color:var(--txt)}
    /* Stats */
    .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
    .scard{background:var(--white);border-radius:var(--r-lg);padding:20px;border:1px solid var(--bdr);box-shadow:var(--s1);position:relative;overflow:hidden;transition:transform .2s,box-shadow .2s;cursor:default}
    .scard:hover{transform:translateY(-2px);box-shadow:var(--s2)}
    .scard::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:var(--r-lg) var(--r-lg) 0 0}
    .scard.c1::before{background:linear-gradient(90deg,var(--ink),var(--ink-soft))}
    .scard.c2::before{background:linear-gradient(90deg,var(--gold),var(--gold-lt))}
    .scard.c3::before{background:linear-gradient(90deg,var(--teal),var(--teal-lt))}
    .scard.c4::before{background:linear-gradient(90deg,var(--org),#f0a050)}
    .scard.c5::before{background:linear-gradient(90deg,var(--red),#e05555)}
    .sval{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;line-height:1;color:var(--txt)}
    .slbl{font-size:12px;color:var(--txt2);margin-top:4px;font-weight:600}
    .sico{position:absolute;right:16px;top:16px;font-size:28px;opacity:.1}
    .strd{font-size:11px;margin-top:8px;display:flex;align-items:center;gap:3px}
    .up{color:var(--grn)}.dn{color:var(--red)}.nu{color:var(--txt3)}
    /* Buttons */
    .btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all .18s;font-family:'Plus Jakarta Sans',sans-serif;white-space:nowrap}
    .btn:active{transform:scale(.97)}
    .btn-ink{background:var(--ink);color:#fff}.btn-ink:hover{background:var(--ink-mid);box-shadow:var(--s1)}
    .btn-gold{background:var(--gold);color:var(--ink)}.btn-gold:hover{background:var(--gold-lt)}
    .btn-teal{background:var(--teal);color:#fff}.btn-teal:hover{background:var(--teal-lt)}
    .btn-ghost{background:transparent;color:var(--txt2);border:1.5px solid var(--bdr)}.btn-ghost:hover{background:var(--bdr3);color:var(--txt)}
    .btn-red{background:var(--red);color:#fff}.btn-red:hover{filter:brightness(1.1)}
    .btn-sm{padding:6px 13px;font-size:12px;border-radius:7px}
    .btn-xs{padding:4px 10px;font-size:11px;border-radius:6px}
    .btn-ico{padding:8px;border-radius:8px;background:transparent;border:1.5px solid var(--bdr);cursor:pointer;transition:all .18s;display:flex;align-items:center;font-size:15px}
    .btn-ico:hover{background:var(--bdr3)}
    .print-report{display:none}
    @media print{
      body.print-analytics .sidebar,
      body.print-analytics .topbar,
      body.print-analytics .btn,
      body.print-analytics .btn-ico,
      body.print-analytics .toast-wrap{display:none !important}
      body.print-analytics .content{padding:0}
      body.print-analytics .print-hide{display:none !important}
      body.print-analytics .print-report{display:block !important}
      body.print-analytics .print-report{background:#fff;color:#000;box-shadow:none;border:none}
    }
    /* Inputs */
    .inp{width:100%;padding:10px 13px;border:1.5px solid var(--bdr);border-radius:8px;font-size:13.5px;font-family:'Plus Jakarta Sans',sans-serif;color:var(--txt);background:var(--white);transition:border-color .18s,box-shadow .18s;outline:none}
    .inp:focus{border-color:var(--ink-soft);box-shadow:0 0 0 3px rgba(26,51,71,.07)}
    .inp::placeholder{color:var(--txt4)}
    .inp-lbl{font-size:11.5px;font-weight:700;color:var(--txt2);margin-bottom:5px;display:block;letter-spacing:.02em;text-transform:uppercase}
    .inp-g{margin-bottom:14px}
    .inp-row{display:grid;gap:14px}
    .cols2{grid-template-columns:1fr 1fr}
    .cols3{grid-template-columns:1fr 1fr 1fr}
    select.inp{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%238a9aaa' d='M8 11L3 6h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;background-size:16px;padding-right:32px}
    textarea.inp{resize:vertical;min-height:80px}
    /* Badges */
    .badge{display:inline-flex;align-items:center;gap:3px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700}
    .b-wait{background:#fff8e1;color:#8a6000}.b-cons{background:#e3f0ff;color:#1a4080}.b-bill{background:#e3faf0;color:#1a5c38}.b-done{background:#f0f0f2;color:#444}.b-emg{background:#fde8e8;color:#900}.b-gold{background:var(--gold-pale);color:var(--gold-dim)}.b-info{background:var(--blu-bg);color:var(--blu)}.b-teal{background:var(--teal-pale);color:var(--teal)}
    /* Queue */
    .q-item{display:flex;align-items:center;gap:13px;padding:13px 15px;border-radius:var(--r);border:1px solid var(--bdr2);background:var(--white);margin-bottom:9px;transition:all .2s;cursor:pointer}
    .q-item:hover{border-color:var(--gold);box-shadow:var(--s1)}
    .q-item.emg{border-left:4px solid var(--red);background:var(--red-bg)}
    .q-ava{width:42px;height:42px;border-radius:50%;background:var(--gold-pale);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;border:2px solid var(--bdr)}
    /* Table */
    .tbl-wrap{overflow-x:auto}
    table{width:100%;border-collapse:collapse;font-size:13px}
    thead th{padding:10px 15px;text-align:left;font-size:10.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--txt3);background:var(--canvas);border-bottom:1px solid var(--bdr)}
    tbody tr{border-bottom:1px solid var(--bdr3);transition:background .12s}
    tbody tr:hover{background:var(--gold-pale)}
    tbody td{padding:11px 15px;vertical-align:middle}
    /* Tabs */
    .tabs{display:flex;gap:2px;border-bottom:2px solid var(--bdr);margin-bottom:20px}
    .tab{padding:9px 17px;font-size:13px;font-weight:600;cursor:pointer;color:var(--txt3);border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .18s;white-space:nowrap;display:flex;align-items:center;gap:5px}
    .tab:hover{color:var(--txt)}
    .tab.on{color:var(--ink);border-bottom-color:var(--gold)}
    /* Modal */
    .ov{position:fixed;inset:0;background:rgba(13,31,45,.5);backdrop-filter:blur(5px);z-index:1000;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s}
    .modal{background:var(--white);border-radius:var(--r-xl);box-shadow:var(--s4);width:92%;max-width:660px;max-height:92vh;overflow-y:auto;animation:fadeUp .25s}
    .modal-lg{max-width:860px}
    .m-head{padding:22px 26px 16px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--white);z-index:1}
    .m-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700}
    .m-body{padding:22px 26px}
    .m-foot{padding:14px 26px 22px;display:flex;gap:10px;justify-content:flex-end;border-top:1px solid var(--bdr2)}
    /* Timeline */
    .tl{position:relative;padding-left:22px}
    .tl::before{content:'';position:absolute;left:7px;top:0;bottom:0;width:2px;background:var(--bdr)}
    .tl-item{position:relative;padding-bottom:20px}
    .tl-dot{position:absolute;left:-19px;top:3px;width:12px;height:12px;border-radius:50%;background:var(--gold);border:2px solid var(--white);box-shadow:0 0 0 2px var(--gold)}
    .tl-dt{font-size:10.5px;color:var(--txt3);font-family:'JetBrains Mono',monospace;margin-bottom:4px}
    .tl-box{background:var(--white);border:1px solid var(--bdr);border-radius:var(--r);padding:11px 13px}
    .tl-t{font-weight:700;font-size:13px;margin-bottom:3px}
    /* Vitals */
    .vbox{background:var(--canvas);border-radius:var(--r);padding:14px;text-align:center;border:1.5px solid var(--bdr);transition:border-color .2s}
    .vbox:hover{border-color:var(--gold)}
    .vval{font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:500;color:var(--ink)}
    .vunit{font-size:9.5px;color:var(--txt3);margin-top:1px;text-transform:uppercase;letter-spacing:.06em}
    .vlbl{font-size:11px;font-weight:700;color:var(--txt2);margin-top:5px;text-transform:uppercase;letter-spacing:.04em}
    /* Alert */
    .alert{padding:11px 15px;border-radius:8px;font-size:13px;margin-bottom:10px;display:flex;align-items:flex-start;gap:9px;border:1px solid transparent}
    .a-warn{background:var(--org-bg);border-color:#f0c070;color:#7a3a00}
    .a-err{background:var(--red-bg);border-color:#f0b0a0;color:#7a0000}
    .a-ok{background:var(--grn-bg);border-color:#80d0a0;color:#0a4a20}
    .a-info{background:var(--blu-bg);border-color:#90b8e8;color:#0a3060}
    /* Search */
    .srch{position:relative;flex:1;max-width:360px}
    .srch-inp{width:100%;padding:8px 14px 8px 36px;border:1.5px solid var(--bdr);border-radius:8px;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;background:var(--canvas);outline:none;transition:all .18s}
    .srch-inp:focus{border-color:var(--ink-soft);background:var(--white);box-shadow:0 0 0 3px rgba(26,51,71,.06)}
    .srch-ic{position:absolute;left:11px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--txt4);pointer-events:none}
    /* Pet card */
    .pcard{background:var(--white);border-radius:var(--r-lg);border:1px solid var(--bdr);padding:18px;display:flex;gap:14px;transition:all .2s;cursor:pointer;position:relative;overflow:hidden}
    .pcard:hover{border-color:var(--gold);box-shadow:var(--s2);transform:translateY(-1px)}
    .pava{width:58px;height:58px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;border:2px solid var(--bdr)}
    /* Topbar user */
    .tu{display:flex;align-items:center;gap:9px;cursor:pointer;padding:6px 10px;border-radius:8px;transition:background .18s;margin-left:auto}
    .tu:hover{background:var(--bdr3)}
    .tu-ava{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0}
    .notif{position:relative}
    .ndot{position:absolute;top:1px;right:1px;width:7px;height:7px;border-radius:50%;background:var(--red);border:2px solid var(--white)}
    /* Stock bar */
    .stk-bar{height:5px;border-radius:3px;background:var(--bdr);overflow:hidden;margin-top:3px}
    .stk-fill{height:100%;border-radius:3px;transition:width .5s}
    /* Cal */
    .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
    .cal-cell{aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:8px;font-size:13px;cursor:pointer;transition:all .18s;position:relative;padding:2px}
    .cal-cell:hover{background:var(--bdr3)}
    .cal-cell.today{background:var(--ink);color:#fff;font-weight:700}
    .cal-cell.hapt::after{content:'';position:absolute;bottom:3px;width:4px;height:4px;border-radius:50%;background:var(--gold)}
    .cal-cell.today.hapt::after{background:var(--gold-lt)}
    .cal-cell.oth{color:var(--txt4)}
    /* Rx / Prescription */
    .rx-wrap{border:2px solid var(--ink);border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--s2)}
    .rx-hd{background:linear-gradient(135deg,var(--ink) 0%,var(--ink-soft) 100%);color:#fff;padding:22px 26px}
    .rx-bd{background:var(--white);padding:20px 26px}
    .rx-ft{background:var(--white);border-top:1px dashed var(--bdr);padding:14px 26px}
    /* Notification toast */
    .toast-wrap{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none}
    .toast{background:var(--ink);color:#fff;padding:12px 18px;border-radius:var(--r);font-size:13px;font-weight:500;box-shadow:var(--s3);animation:pop .3s ease;display:flex;align-items:center;gap:8px;pointer-events:all;max-width:320px}
    .toast.success{background:var(--grn)}.toast.error{background:var(--red)}.toast.warning{background:var(--org)}
    /* Login */
    .login-bg{min-height:100vh;background:linear-gradient(135deg,var(--ink) 0%,var(--ink-soft) 60%,#1a4a5a 100%);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
    .login-bg::before{content:'';position:absolute;inset:0;pointer-events:none;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")}
    .login-card{background:#fff;border-radius:var(--r-xl);box-shadow:var(--s4);width:92%;max-width:480px;overflow:hidden;animation:fadeUp .4s ease;position:relative;z-index:10}
    .login-head{background:linear-gradient(135deg,var(--gold) 0%,var(--gold-lt) 100%);padding:28px 32px;text-align:center}
    .login-body{padding:28px 32px}
    /* "?"? Misc utils "?"? */
    .ph{page-header;display:flex;align-items:center;justify-content:space-between;margin-bottom:22px}
    .pt{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:var(--txt)}
    .ps{font-size:13px;color:var(--txt2);margin-top:2px}
    .case-pill{font-family:'JetBrains Mono',monospace;font-size:11px;background:var(--ink);color:var(--gold-lt);padding:3px 8px;border-radius:5px}
    .divider{height:1px;background:var(--bdr2);margin:16px 0}
    .chip{display:inline-flex;align-items:center;gap:5px;padding:4px 11px;border-radius:20px;font-size:12px;font-weight:600;background:var(--canvas);border:1px solid var(--bdr);cursor:pointer;transition:all .18s}
    .chip:hover,.chip.on{background:var(--ink);color:#fff;border-color:var(--ink)}
    @media(max-width:1100px){.stats-grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:768px){.stats-grid{grid-template-columns:1fr 1fr};.sidebar{display:none}}
  `}</style>
);

// "?"?"? Context "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "rpc_token";
const SESSION_KEY = "rpc_sessions";
const MUTABLE_TABLES_BY_ROLE = {
  admin: ["owners", "pets", "visits", "appointments", "inventory", "prescriptions", "invoices", "vaccinations", "activity_log", "clinic_settings"],
  doctor: ["pets", "visits", "appointments", "inventory", "prescriptions", "invoices", "vaccinations"],
  receptionist: ["owners", "pets", "visits", "appointments", "inventory", "invoices", "vaccinations"],
};

const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
const setStoredToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const clearStoredToken = () => localStorage.removeItem(TOKEN_KEY);

const apiRequest = async (path, options = {}, tokenOverride) => {
  const token = tokenOverride ?? getStoredToken();
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = payload?.error?.message || payload?.error || payload?.message || "Request failed";
    throw new Error(message);
  }

  return payload?.data ?? payload;
};
// ctx shape: { db, saveDB, toast, logActivity, user }

// "?"?"? Mock DB (localStorage-backed) "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
const DB_KEY = "rpc_db";
const normalizeMedName = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const defaultInstructionFromDose = (dose) => {
  const d = (dose || "").toLowerCase();
  if (d.includes("q12")) return "Every 12 hours";
  if (d.includes("q24")) return "Once daily";
  if (d.includes("q8")) return "Every 8 hours";
  if (d.includes("q6")) return "Every 6 hours";
  return "";
};
const MED_DEFAULTS = {
  [normalizeMedName("Inj. Tribivet")]: { dose: "1 ml/15 kg", instruction: "Injection" },
  [normalizeMedName("Inj. Vitcofol")]: { dose: "1 ml/15 kg", instruction: "Injection" },
  [normalizeMedName("Inj. Ascoril")]: { dose: "1 ml/15 kg", instruction: "Injection" },
  [normalizeMedName("Inj. Activita-H")]: { dose: "1 ml/15 kg", instruction: "Injection" },
  [normalizeMedName("Inj. Conciplex")]: { dose: "1 ml/15 kg", instruction: "Injection" },
  [normalizeMedName("Inj. Iron Dextran")]: { dose: "1 ml/15 kg", instruction: "Injection" },
  [normalizeMedName("Inj. Calcium Gluconate")]: { dose: "As directed", instruction: "Injection" },
  [normalizeMedName("Inj. Vitamin K")]: { dose: "1 ml/15 kg", instruction: "Injection" },
  [normalizeMedName("Inj. Ampicillin + Cloxacillin")]: { dose: "15 mg/kg", instruction: "Injection" },
  [normalizeMedName("Inj. Cefotaxime")]: { dose: "25 mg/kg", instruction: "Injection" },
  [normalizeMedName("Inj. Amoxicillin + Sulbactam")]: { dose: "15 mg/kg", instruction: "Injection" },
  [normalizeMedName("Inj. Amikacin")]: { dose: "12 mg/kg", instruction: "Injection" },
  [normalizeMedName("Inj. Gentamicin")]: { dose: "4 mg/kg", instruction: "Injection" },
  [normalizeMedName("Inj. Cefuroxime")]: { dose: "1.5 g", instruction: "Injection" },
  [normalizeMedName("Inj. Enrofloxacin")]: { dose: "5 mg/kg", instruction: "Injection" },
  [normalizeMedName("Inj. Oxytetracycline")]: { dose: "12 mg/kg", instruction: "Injection" },
  [normalizeMedName("Inj. Metronidazole")]: { dose: "15 mg/kg", instruction: "Injection" },
  [normalizeMedName("Inj. Amoxicillin")]: { dose: "10-20 mg/kg q12h", instruction: "Injection" },
  [normalizeMedName("Inj. Amoxicillin-Clavulanate")]: { dose: "12.5-25 mg/kg q12h", instruction: "Injection" },
  [normalizeMedName("Inj. Cefalexin")]: { dose: "20-30 mg/kg q12h", instruction: "Injection" },
  [normalizeMedName("Inj. Ceftriaxone")]: { dose: "20-25 mg/kg q12-24h", instruction: "Injection" },
  [normalizeMedName("Doxycycline")]: { dose: "5-10 mg/kg q12-24h", instruction: "Oral" },
  [normalizeMedName("Gentamicin")]: { dose: "4-6 mg/kg q24h", instruction: "Oral" },
  [normalizeMedName("Metronidazole")]: { dose: "10-15 mg/kg q12h", instruction: "Oral" },
  [normalizeMedName("Clindamycin")]: { dose: "5-11 mg/kg q12h", instruction: "Oral" },
  [normalizeMedName("Azithromycin")]: { dose: "5-10 mg/kg q24h", instruction: "Oral" },
  [normalizeMedName("Trimethoprim-Sulfamethoxazole")]: { dose: "15-30 mg/kg q12h", instruction: "Oral" },
  [normalizeMedName("Marbofloxacin")]: { dose: "2-5 mg/kg q24h", instruction: "Oral" },
  [normalizeMedName("Meloxicam")]: { dose: "0.2 mg/kg day 1, then 0.1 mg/kg q24h", instruction: "PO / SC" },
  [normalizeMedName("Carprofen")]: { dose: "2.2 mg/kg q12h or 4.4 mg/kg q24h", instruction: "PO / SC" },
  [normalizeMedName("Firocoxib")]: { dose: "5 mg/kg q24h", instruction: "PO" },
  [normalizeMedName("Robenacoxib")]: { dose: "1-2 mg/kg q24h", instruction: "PO / SC" },
  [normalizeMedName("Ketoprofen")]: { dose: "1 mg/kg q24h", instruction: "IM / SC" },
  [normalizeMedName("Tramadol")]: { dose: "Dogs: 2-5 mg/kg q8-12h; Cats: 2-4 mg/kg q12h", instruction: "PO" },
  [normalizeMedName("Butorphanol")]: { dose: "0.2-0.4 mg/kg q4-6h", instruction: "IM / IV / SC" },
  [normalizeMedName("Buprenorphine")]: { dose: "0.01-0.02 mg/kg q8-12h", instruction: "IM / IV / transmucosal" },
  [normalizeMedName("Gabapentin")]: { dose: "Dogs: 10-20 mg/kg q8-12h; Cats: 5-10 mg/kg q12h", instruction: "PO" },
  [normalizeMedName("Prednisolone")]: { dose: "0.5-1 mg/kg q24h", instruction: "PO" },
  [normalizeMedName("Inj. Diazepam")]: { dose: "0.25 mg/kg", instruction: "Injection" },
  [normalizeMedName("Inj. Xylazine")]: { dose: "1 mg/kg", instruction: "Injection" },
  [normalizeMedName("Inj. Ketamine")]: { dose: "2.5 mg/kg", instruction: "Injection" },
  [normalizeMedName("Maropitant")]: { dose: "Dogs: 1 mg/kg q24h; Cats: 1 mg/kg q24h", instruction: "SC / PO" },
  [normalizeMedName("Metoclopramide")]: { dose: "Dogs: 0.2-0.5 mg/kg q6-8h; Cats: 0.2-0.4 mg/kg q8h", instruction: "PO / SC / IV" },
  [normalizeMedName("Ondansetron")]: { dose: "Dogs: 0.1-0.2 mg/kg q8-12h; Cats: 0.1-0.2 mg/kg q8-12h", instruction: "PO / IV" },
  [normalizeMedName("Dolasetron")]: { dose: "Dogs: 0.5-1 mg/kg q24h; Cats: 0.5-1 mg/kg q24h", instruction: "PO / IV" },
  [normalizeMedName("Chlorpromazine")]: { dose: "Dogs: 0.2-0.5 mg/kg q8h; Cats: 0.2-0.5 mg/kg q8h", instruction: "IM / IV" },
  [normalizeMedName("Dimenhydrinate")]: { dose: "Dogs: 4-8 mg/kg q8h; Cats: 4 mg/kg q8-12h", instruction: "PO" },
  [normalizeMedName("Diphenhydramine")]: { dose: "Dogs: 2-4 mg/kg q8h; Cats: 1-2 mg/kg q8-12h", instruction: "PO / IM" },
  [normalizeMedName("Inj. Ranitidine")]: { dose: "0.5 mg/kg", instruction: "Injection" },
  [normalizeMedName("Inj. Pantoprazole")]: { dose: "0.2 mg/kg", instruction: "Injection" },
  [normalizeMedName("Inj. Atropine")]: { dose: "0.01 mg/kg", instruction: "Injection" },
  [normalizeMedName("Inj. Dexamethasone")]: { dose: "0.2 mg/kg", instruction: "Injection" },
  [normalizeMedName("Inj. Botropase")]: { dose: "1 ml", instruction: "Injection" },
  [normalizeMedName("Inj. Ethamsylate")]: { dose: "2.0 ml", instruction: "Injection" },
  [normalizeMedName("Mannitol")]: { dose: "0.25-1 g/kg", instruction: "IV" },
  [normalizeMedName("Inj. Furosemide")]: { dose: "1 mg/kg", instruction: "Injection" },
  [normalizeMedName("Inj. Torsemide")]: { dose: "0.2 mg/kg", instruction: "Injection" },
  [normalizeMedName("Normal Saline (NS)")]: { dose: "As directed", instruction: "IV" },
  [normalizeMedName("Lactated Ringer?Ts Solution (RL)")]: { dose: "As directed", instruction: "IV" },
  [normalizeMedName("Lactated Ringer's Solution (RL)")]: { dose: "As directed", instruction: "IV" },
  [normalizeMedName("DNS")]: { dose: "As directed", instruction: "IV" },
  [normalizeMedName("D10")]: { dose: "As directed", instruction: "IV" },
  [normalizeMedName("D25")]: { dose: "As directed", instruction: "IV" },
  [normalizeMedName("Astymin")]: { dose: "As directed", instruction: "IV" },
  [normalizeMedName("Vetplasma")]: { dose: "As directed", instruction: "IV" },
  [normalizeMedName("Absorbent Cotton Wool")]: { dose: "As needed", instruction: "Use as required" },
  [normalizeMedName("Gauze Swab / Rolled Gauze")]: { dose: "As needed", instruction: "Use as required" },
  [normalizeMedName("Bandage Rolls")]: { dose: "As needed", instruction: "Use as required" },
  [normalizeMedName("Surgical Gloves")]: { dose: "As needed", instruction: "Use as required" },
  [normalizeMedName("Disposable Gloves")]: { dose: "As needed", instruction: "Use as required" },
  [normalizeMedName("Syringes (2ml, 5ml, 10ml, 20ml, 50ml)")]: { dose: "As needed", instruction: "Use as required" },
  [normalizeMedName("IV Sets / Pediatric Sets")]: { dose: "As needed", instruction: "Use as required" },
  [normalizeMedName("IV Cannula (21G, 22G, 23G)")]: { dose: "As needed", instruction: "Use as required" },
  [normalizeMedName("Scalp Vein Sets")]: { dose: "As needed", instruction: "Use as required" },
  [normalizeMedName("Infant Feeding Tube")]: { dose: "As needed", instruction: "Use as required" },
  [normalizeMedName("Lignocaine 2% Jelly")]: { dose: "As needed", instruction: "Topical" },
  [normalizeMedName("Surgical Spirit")]: { dose: "As needed", instruction: "Topical" },
  [normalizeMedName("Liquid Chloroform")]: { dose: "As needed", instruction: "Topical" },
  [normalizeMedName("D-Mag Spray")]: { dose: "As needed", instruction: "Topical" }
};
const getMedDefaults = (name) => {
  const d = MED_DEFAULTS[normalizeMedName(name)];
  if (!d) return null;
  return {
    dose: d.dose || "",
    duration: d.duration || "",
    instruction: d.instruction || defaultInstructionFromDose(d.dose)
  };
};
const openPrescriptionPrint = ({ clinic, pet, owner, visit, medicines }) => {
  const w = window.open("", "_blank");
  const rows = (medicines || []).map((m, i) => `<tr><td>${i + 1}</td><td>${m.name || "—"}</td><td>${m.dose || "—"}</td><td>${m.duration || "—"}</td><td>${m.instruction || "—"}</td></tr>`).join("");
  const vitals = [
    visit?.temp ? `Temp: ${visit.temp}°F` : "",
    visit?.hr ? `HR: ${visit.hr} bpm` : "",
    visit?.rr ? `RR: ${visit.rr}/min` : "",
    visit?.weight ? `Weight: ${visit.weight} kg` : ""
  ].filter(Boolean).join(" · ");
  w.document.write(`<html><head><title>Prescription</title><style>
    @page { margin: 12mm; }
    body{font-family:Arial,sans-serif;padding:0;color:#000;margin:0}
    .sheet{max-width:780px;margin:0 auto;padding:8px 6px}
    .head{text-align:center;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:12px}
    .meta{display:flex;justify-content:space-between;gap:20px;font-size:12px;margin-bottom:10px}
    table{width:100%;border-collapse:collapse;margin:10px 0;font-size:12px}
    th,td{border:1px solid #000;padding:6px 8px}
    th{background:#f2f2f2;text-align:left}
    .sig{margin-top:16px;text-align:right;font-size:12px}
    .foot{font-size:11px;text-align:center;margin-top:10px;color:#333}
    @media print{button{display:none} body{margin:0} .sheet{padding:0}}
  </style></head><body>
  <div class="sheet">
  <div class="head"><div style="font-size:28px">🐾</div><h2 style="margin:4px 0">${clinic.name}</h2>
  <div style="font-size:12px">${clinic.address}</div>
  <div style="font-size:12px">${clinic.phone} · ${clinic.email}</div></div>
  <div class="meta">
    <div><strong>Rx Date:</strong> ${visit?.date ? new Date(visit.date).toLocaleDateString("en-IN") : "—"}<br><strong>Case No:</strong> ${visit?.caseNum || "—"}</div>
    <div style="text-align:right"><strong>Pet:</strong> ${pet?.name || "—"}<br><strong>Owner:</strong> ${owner?.name || "—"}<br><strong>Mobile:</strong> ${owner?.mobile || "—"}</div>
  </div>
  ${vitals ? `<div style="font-size:12px;margin-bottom:8px"><strong>Vitals:</strong> ${vitals}</div>` : ""}
  ${visit?.diagnosis ? `<div style="font-size:12px;margin-bottom:8px"><strong>Diagnosis:</strong> ${visit.diagnosis}</div>` : ""}
  <table><thead><tr><th>#</th><th>Medicine</th><th>Dose</th><th>Duration</th><th>Instruction</th></tr></thead><tbody>
  ${rows || `<tr><td colspan="5" style="text-align:center">No medicines</td></tr>`}
  </tbody></table>
  <div class="sig">
    <div style="border-top:1px solid #000;padding-top:6px;display:inline-block;min-width:220px;text-align:center">${clinic.signature || clinic.doctor || "Veterinarian"}</div>
    <div style="font-size:11px;margin-top:4px">Authorized Signature</div>
  </div>
  <div class="foot">Thank you for choosing ${clinic.name}!</div>
  <br><button onclick="window.print()" style="padding:10px 20px;background:#0d1f2d;color:#fff;border:none;border-radius:6px;cursor:pointer">🖨️ Print</button>
  </div></body></html>`);
  w.document.close();
};
const initDB = () => {
  const saved = localStorage.getItem(DB_KEY);
  if (saved) {
    const db = JSON.parse(saved);
    db.users = db.users || [];
    db.owners = db.owners || [];
    db.pets = db.pets || [];
    db.visits = db.visits || [];
    db.prescriptions = db.prescriptions || [];
    db.appointments = db.appointments || [];
    db.vaccinations = db.vaccinations || [];
    db.invoices = db.invoices || [];
    db.inventory = db.inventory || [];
    db.activityLog = db.activityLog || [];
    db.auditLog = db.auditLog || [];
    db.clinicSettings = { name: "Royal Pet Clinic", doctor: "Dr. Rajan Mehta", signature: "Dr. Rajan Mehta, BVSc & AH", phone: "+91 80 1234 5678", email: "info@royalpetclinic.in", address: "123, MG Road, Bangalore - 560001", regNum: "VET/2020/BLR/0042", consultFee: 500, currency: "₹", reminderVaccDays: 7, reminderFollowupDays: 1, reminderTime: "09:00", reminderChannel: "Both", reminderWhatsapp: "+91 80 1234 5678", reminderVaccTemplate: "Dear {owner_name}, this is a reminder that {pet_name}'s {vaccine_name} vaccination is due on {due_date}. Please visit {clinic_name} to schedule an appointment. 🐾", reminderFollowupTemplate: "Dear {owner_name}, your appointment for {pet_name} is scheduled for {apt_date} at {apt_time} at {clinic_name}. See you soon! 🐾", vetReg: "VET/2020/BLR/0042", specialization: "Small Animals & Exotic Pets", experience: 12, doctorBio: "Specialized in small animal medicine, surgery, and exotic pet care. 12+ years of clinical experience in Bangalore.", taxRate: 0, invoicePrefix: "INV", paymentMethods: ["Cash","UPI","Card","Online"], showTax: false, logo: "", ...(db.clinicSettings || {}) };
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return db;
  }
  const db = {
    users: [
      { id: 1, name: "Dr. Rajan Mehta", email: "doctor@royalpet.in", password: "doctor123", role: "doctor", mobile: "9876500001", avatar: "DR", active: true, lastLogin: "2026-03-14T09:00:00" },
      { id: 2, name: "Rajesh Kumar", email: "owner@royalpet.in", password: "owner123", role: "owner", mobile: "9876543210", avatar: "RK", active: true, lastLogin: "2026-03-13T18:00:00" },
    ],
    owners: [
      { id: 1, name: "Rajesh Kumar", mobile: "9876543210", email: "rajesh@gmail.com", address: "12, MG Road, Bangalore" },
      { id: 2, name: "Priya Sharma", mobile: "9823456789", email: "priya@gmail.com", address: "45, Koramangala, Bangalore" },
    ],
    pets: [
      { id: 1, name: "Bruno", type: "Dog", breed: "Labrador Retriever", dob: "2023-01-15", sex: "Male", weight: 28.5, ownerId: 1, photo: "🐕", alerts: ["Allergic to Amoxicillin"], color: "#f5ede0" },
      { id: 2, name: "Whiskers", type: "Cat", breed: "Persian", dob: "2021-06-10", sex: "Female", weight: 4.2, ownerId: 2, photo: "🐱", alerts: [], color: "#e5e8f5" },
    ],
    visits: [
      { id: 1, petId: 1, caseNum: "RPC-20260311-001", date: "2026-03-11", status: "consulting", reason: "Skin rash & itching", temp: "102.8", hr: "88", rr: "22", weight: 28.5, diagnosis: "Skin Allergy", notes: "Chronic condition, needs follow-up", doctorId: 1 },
      { id: 2, petId: 2, caseNum: "RPC-20260308-001", date: "2026-03-08", status: "done", reason: "Annual vaccination", temp: "101.2", hr: "95", rr: "20", weight: 4.2, diagnosis: "Routine Vaccination", notes: "", doctorId: 1 },
    ],
    prescriptions: [
      { id: 1, visitId: 1, medicines: [{ name: "Prednisolone 5mg", dose: "1 tab", duration: "7 days", instruction: "After food" }, { name: "Cetirizine 5mg", dose: "0.5 tab", duration: "5 days", instruction: "Once daily" }] },
      { id: 2, visitId: 2, medicines: [{ name: "Tricat Vaccine", dose: "1 dose", duration: "Once", instruction: "Given at clinic" }] },
    ],
    appointments: [
      { id: 1, petId: 1, ownerId: 1, date: "2026-03-11", time: "09:00", type: "Follow-up", status: "checked-in", notes: "" },
      { id: 2, petId: 2, ownerId: 2, date: "2026-03-11", time: "10:00", type: "Vaccination", status: "confirmed", notes: "" },
    ],
    vaccinations: [
      { id: 1, petId: 1, vaccine: "9-in-1 (DHPPiL+)", given: "2025-03-10", next: "2026-03-10", batch: "9IN2025A", status: "due" },
      { id: 2, petId: 2, vaccine: "Tricat (FVRCP)", given: "2025-08-20", next: "2026-08-20", batch: "TRI2025A", status: "ok" },
    ],
    inventory: [
      { id: 1, name: "Amoxicillin 250mg", category: "Antibiotic", stock: 45, unit: "tablets", minStock: 20, batch: "AMX2025B", expiry: "2026-09-15", price: 8, vendor: "Pharma India" },
      { id: 2, name: "Rabies Vaccine", category: "Vaccine", stock: 28, unit: "doses", minStock: 10, batch: "RBV2026A", expiry: "2026-12-01", price: 350, vendor: "BioVet" },
    ],
    invoices: [
      { id: 1, visitId: 1, petId: 1, ownerId: 1, date: "2026-03-11", items: [{ name: "Consultation", qty: 1, rate: 500, amt: 500 }, { name: "Prednisolone 5mg (14tabs)", qty: 14, rate: 12, amt: 168 }, { name: "Cetirizine 5mg (10tabs)", qty: 10, rate: 6, amt: 60 }], total: 728, status: "paid", method: "UPI" },
      { id: 2, visitId: 2, petId: 2, ownerId: 2, date: "2026-03-08", items: [{ name: "Consultation", qty: 1, rate: 500, amt: 500 }, { name: "Tricat Vaccine", qty: 1, rate: 480, amt: 480 }], total: 980, status: "paid", method: "Cash" },
    ],
    auditLog: [],
    sessions: [],
    activityLog: [],
    nextVisitNum: { "2026-03-11": 3 },
    clinicSettings: { name: "Royal Pet Clinic", doctor: "Dr. Rajan Mehta", signature: "Dr. Rajan Mehta, BVSc & AH", phone: "+91 80 1234 5678", email: "info@royalpetclinic.in", address: "123, MG Road, Bangalore - 560001", regNum: "VET/2020/BLR/0042", consultFee: 500, currency: ",", reminderVaccDays: 7, reminderFollowupDays: 1, reminderTime: "09:00", reminderChannel: "Both", reminderWhatsapp: "+91 80 1234 5678", reminderVaccTemplate: "Dear {owner_name}, this is a reminder that {pet_name}'s {vaccine_name} vaccination is due on {due_date}. Please visit {clinic_name} to schedule an appointment. 🐾", reminderFollowupTemplate: "Dear {owner_name}, your appointment for {pet_name} is scheduled for {apt_date} at {apt_time} at {clinic_name}. See you soon! 🐾", vetReg: "VET/2020/BLR/0042", specialization: "Small Animals & Exotic Pets", experience: 12, doctorBio: "Specialized in small animal medicine, surgery, and exotic pet care. 12+ years of clinical experience in Bangalore.", taxRate: 0, invoicePrefix: "INV", paymentMethods: ["Cash","UPI","Card","Online"], showTax: false, logo: "" },
  };
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  return db;
};

const normalizeDbSnapshot = (payload = {}) => {
  const fallback = initDB();
  const next = {
    ...fallback,
    ...payload,
    users: payload.users || [],
    owners: payload.owners || [],
    pets: payload.pets || [],
    visits: payload.visits || [],
    prescriptions: payload.prescriptions || [],
    appointments: payload.appointments || [],
    vaccinations: payload.vaccinations || [],
    inventory: payload.inventory || [],
    invoices: payload.invoices || [],
    activityLog: payload.activityLog || [],
    auditLog: fallback.auditLog || [],
  };
  next.clinicSettings = { ...fallback.clinicSettings, ...(payload.clinicSettings || {}) };
  return next;
};

const toServerResourceMap = (snapshot) => ({
  owners: snapshot.owners || [],
  pets: snapshot.pets || [],
  visits: snapshot.visits || [],
  appointments: snapshot.appointments || [],
  inventory: snapshot.inventory || [],
  prescriptions: snapshot.prescriptions || [],
  invoices: snapshot.invoices || [],
  vaccinations: snapshot.vaccinations || [],
  activity_log: snapshot.activityLog || [],
  clinic_settings: snapshot.clinicSettings ? [snapshot.clinicSettings] : [],
});

// "?"?"? Helpers "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const todayStr = () => new Date().toISOString().split("T")[0];
const genCase = (db) => {
  const d = todayStr().replace(/-/g, "");
  const n = (db.nextVisitNum[todayStr()] || 1);
  db.nextVisitNum[todayStr()] = n + 1;
  return `RPC-${d}-${String(n).padStart(3, "0")}`;
};
const calcAge = (dob) => {
  const diff = new Date() - new Date(dob);
  const yrs = Math.floor(diff / (365.25 * 24 * 3600 * 1000));
  if (yrs < 1) {
    const mos = Math.floor(diff / (30.44 * 24 * 3600 * 1000));
    return `${mos} mo`;
  }
  return `${yrs} yr${yrs > 1 ? "s" : ""}`;
};
const STATUS_MAP = {
  waiting: <span className="badge b-wait">⏳ Waiting</span>,
  consulting: <span className="badge b-cons">🩺 In Consultation</span>,
  billing: <span className="badge b-bill">💳 Billing</span>,
  done: <span className="badge b-done">✅ Done</span>,
  emergency: <span className="badge b-emg">🚨 Emergency</span>,
};
const DISEASE_PROTOCOLS = {
  "Skin Allergy": [{ name: "Prednisolone 5mg", dose: "1 tab", duration: "7 days", instruction: "After food, taper dose" }, { name: "Cetirizine 5mg", dose: "0.5 tab", duration: "5 days", instruction: "Once daily" }],
  "Gastroenteritis": [{ name: "Metronidazole 200mg", dose: "1 tab", duration: "5 days", instruction: "Twice daily with food" }, { name: "Probiotic sachet", dose: "1 sachet", duration: "7 days", instruction: "Once daily with food" }],
  "Kennel Cough": [{ name: "Doxycycline 100mg", dose: "1 tab", duration: "10 days", instruction: "Once daily with food" }, { name: "Bromhexine syrup", dose: "5ml", duration: "7 days", instruction: "Twice daily" }],
  "Ear Infection": [{ name: "Gentamicin ear drops", dose: "3 drops", duration: "7 days", instruction: "Twice daily in affected ear" }, { name: "Prednisolone 5mg", dose: "0.5 tab", duration: "5 days", instruction: "Once daily" }],
  "Arthritis": [{ name: "Meloxicam 1mg", dose: "1 tab", duration: "14 days", instruction: "After food" }, { name: "Omega-3 supplement", dose: "1 capsule", duration: "30 days", instruction: "Once daily with food" }],
  "UTI": [{ name: "Amoxicillin-Clavulanate", dose: "1 tab", duration: "7 days", instruction: "Every 12 hours with food" }, { name: "Cranberry extract", dose: "1 capsule", duration: "14 days", instruction: "Once daily" }],
  "Diabetes": [{ name: "Insulin Glargine 1U/kg", dose: "Per weight", duration: "Ongoing", instruction: "Subcutaneous, twice daily" }],
};

// "?"?"? Toast "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
function ToastContainer({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type || ""}`}>{t.icon || "✓"} {t.msg}</div>
      ))}
    </div>
  );
}

// ...............................................................................
// AUTH PAGES
// ...............................................................................

function LoginPage({ onLogin, goRegister, activeSessions, onSwitchUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const DEMOS = [
    { label: "Doctor", email: "doctor@royalpet.com", pass: "Doctor@123", icon: "👨‍⚕️", desc: "Full clinical access", bg: "#0d1f2d" },
    { label: "Receptionist", email: "staff@royalpet.com", pass: "Staff@123", icon: "👩‍💼", desc: "Appointments & billing", bg: "#1d6a6a" },
    { label: "Admin", email: "admin@royalpet.com", pass: "Admin@123", icon: "🛠️", desc: "System administration", bg: "#7a1a1a" },
    { label: "Pet Owner", email: "owner@royalpet.com", pass: "Owner@123", icon: "🐾", desc: "View records & cards", bg: "#7a5c1e" },
  ];

  const ROLE_LABELS = { doctor: "Veterinarian", receptionist: "Receptionist", admin: "Admin", owner: "Pet Owner" };

  const doLogin = async (em, pw) => {
    setErr("");
    setLoading(true);
    try {
      const session = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: em, password: pw }),
      });
      await onLogin(session);
    } catch (error) {
      setErr(error.message || "Invalid email or password.");
      setLoading(false);
    }
  };

  const quickLogin = async (acc) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    try {
      await doLogin(acc.email, acc.pass);
    } catch {
      setErr("Invalid email or password.");
    }
  };

  const ROLE_COLORS = { doctor: "#1a3347", receptionist: "#1d6a6a", admin: "#7a1a1a", owner: "#7a5c1e" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0d1f2d 0%,#1a3347 50%,#1a4a5a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      {/* Non-blocking decorative bg */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {["🐕","🐱","🦜","🐇","🦮","🐈"].map((e, i) => (
          <div key={i} style={{ position: "absolute", fontSize: 60 + i*15, opacity: 0.03, top: `${8 + i*15}%`, left: `${4 + i*16}%`, transform: `rotate(${i*40}deg)`, userSelect: "none", pointerEvents: "none" }}>{e}</div>
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 480, animation: "fadeUp .4s ease" }}>
        {/* Active sessions panel */}
        {activeSessions && activeSessions.length > 0 && (
          <div style={{ background: "rgba(255,255,255,.07)", borderRadius: 14, padding: "14px 18px", marginBottom: 16, border: "1px solid rgba(255,255,255,.1)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>↩ Switch to Active Session</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {activeSessions.map((s, i) => (
                <button key={i} onClick={() => onSwitchUser && onSwitchUser(s.userId)}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 10, padding: "8px 12px", cursor: "pointer", color: "#fff", fontFamily: "inherit", transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,.18)"}
                  onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,.1)"}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: ROLE_COLORS[s.role]||"#1a3347", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>{s.avatar}</div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{s.name}</div>
                    <div style={{ fontSize: 10, opacity: .6, textTransform: "capitalize" }}>{ROLE_LABELS[s.role]||s.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#c9973a,#e8bb6e)", borderRadius: "20px 20px 0 0", padding: "28px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 8, lineHeight: 1 }}>🐾</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#0d1f2d" }}>Royal Pet Clinic</div>
          <div style={{ fontSize: 11, color: "#5a3a10", marginTop: 4, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Management System</div>
        </div>

        {/* Body */}
        <div style={{ background: "#fff", borderRadius: "0 0 20px 20px", padding: "28px 32px", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>

          {/* Demo Buttons */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ textAlign: "center", fontSize: 12, fontWeight: 800, color: "#8a9aaa", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>
              
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {DEMOS.map((acc) => (
                <button
                  key={acc.label}
                  onClick={() => quickLogin(acc)}
                  style={{
                    background: acc.bg, color: "#fff", border: "none", borderRadius: 12,
                    padding: "14px 8px", cursor: "pointer", textAlign: "center",
                    transition: "transform .15s, box-shadow .15s", fontFamily: "inherit",
                    boxShadow: "0 4px 12px rgba(0,0,0,.2)"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,.2)"; }}
                >
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{acc.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>{acc.label}</div>
                  <div style={{ fontSize: 10, opacity: .7, marginTop: 3, lineHeight: 1.3 }}>{acc.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: "#e0dbd4" }} />
            <span style={{ fontSize: 11, color: "#b0bcc8", fontWeight: 700 }}>OR SIGN IN MANUALLY</span>
            <div style={{ flex: 1, height: 1, background: "#e0dbd4" }} />
          </div>

          {/* Manual form */}
          {err && (
            <div style={{ background: "#fdf0ee", border: "1px solid #f0b0a0", color: "#7a0000", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
              ⚠️ {err}
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: "#4a5a6a", textTransform: "uppercase", letterSpacing: ".04em", display: "block", marginBottom: 5 }}>Email</label>
            <input
              style={{ width: "100%", padding: "10px 13px", border: "1.5px solid #e0dbd4", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border-color .18s" }}
              type="email" placeholder="your@email.com" value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={e => e.target.style.borderColor = "#2a4a6a"}
              onBlur={e => e.target.style.borderColor = "#e0dbd4"}
              onKeyDown={e => e.key === "Enter" && doLogin(email, password)}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: "#4a5a6a", textTransform: "uppercase", letterSpacing: ".04em", display: "block", marginBottom: 5 }}>Password</label>
            <input
              style={{ width: "100%", padding: "10px 13px", border: "1.5px solid #e0dbd4", borderRadius: 8, fontSize: 14, fontFamily: "inherit", outline: "none", transition: "border-color .18s" }}
              type="password" placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={e => e.target.style.borderColor = "#2a4a6a"}
              onBlur={e => e.target.style.borderColor = "#e0dbd4"}
              onKeyDown={e => e.key === "Enter" && doLogin(email, password)}
            />
          </div>
          <button
            onClick={() => doLogin(email, password)}
            disabled={loading}
            style={{ width: "100%", padding: "13px", background: loading ? "#8a9aaa" : "#0d1f2d", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background .18s" }}
          >
            {loading ? "🔄 Signing in..." : "🔐 Sign In"}
          </button>

          {/* Register link */}
          <div style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#8a9aaa" }}>
            New staff member?{" "}
            <button
              onClick={goRegister}
              style={{ background: "none", border: "none", color: "#7a5c1e", fontWeight: 800, cursor: "pointer", fontSize: 13, textDecoration: "underline", fontFamily: "inherit", padding: 0 }}
            >
              Register here →
            </button>
          </div>

          {/* Hint */}
          <div style={{ marginTop: 14, padding: "10px 12px", background: "#fdf6e8", borderRadius: 8, fontSize: 11, color: "#7a5c1e", textAlign: "center", lineHeight: 1.6 }}>
            💡 4 roles: Doctor · Receptionist · Admin · Pet Owner
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ onBack, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "", confirmPwd: "", role: "doctor", doctorCode: "", receptionCode: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const DOCTOR_REG_CODE = "RPC-DOC-2026";
  const RECEPTION_REG_CODE = "RPC-REC-2026";

  const submit = async () => {
    setErr("");
    if (!form.name || !form.email || !form.password) { setErr("Please fill all required fields."); return; }
    if (form.password !== form.confirmPwd) { setErr("Passwords do not match."); return; }
    if (form.password.length < 6) { setErr("Password must be at least 6 characters."); return; }
    if (form.role === "admin") { setErr("Admin registration is disabled."); return; }
    if (form.role === "doctor" && form.doctorCode.trim() !== DOCTOR_REG_CODE) { setErr("Invalid doctor registration code."); return; }
    if (form.role === "receptionist" && form.receptionCode.trim() !== RECEPTION_REG_CODE) { setErr("Invalid receptionist registration code."); return; }
    setLoading(true);
    try {
      await apiRequest("/auth/register", {
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
      onSuccess();
    } catch (error) {
      setErr(error.message || "Registration failed.");
      setLoading(false);
    }
  };

  const roles = [
    { val: "doctor", label: "Doctor / Vet", icon: "👨‍⚕️", desc: "Full clinical access" },
    { val: "receptionist", label: "Receptionist", icon: "👩‍💼", desc: "Appointments, billing" },
    { val: "owner", label: "Pet Owner", icon: "🏠", desc: "View records" },
  ];

  const S = { inp: { width:"100%", padding:"10px 13px", border:"1.5px solid #e0dbd4", borderRadius:8, fontSize:14, fontFamily:"inherit", outline:"none" }, lbl: { fontSize:11, fontWeight:800, color:"#4a5a6a", textTransform:"uppercase", letterSpacing:".04em", display:"block", marginBottom:5 } };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0d1f2d 0%,#1a3347 50%,#1a4a5a 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div style={{ position:"relative", zIndex:10, width:"100%", maxWidth:560, animation:"fadeUp .4s ease" }}>
        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#c9973a,#e8bb6e)", borderRadius:"20px 20px 0 0", padding:"22px 28px", display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ fontSize:36 }}>🐾</div>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:"#0d1f2d" }}>Create Account</div>
            <div style={{ fontSize:12, color:"#5a3a10", fontWeight:700 }}>Royal Pet Clinic — Staff / Owner Portal</div>
          </div>
        </div>

        <div style={{ background:"#fff", borderRadius:"0 0 20px 20px", padding:"26px 28px", boxShadow:"0 20px 60px rgba(0,0,0,.3)" }}>
          {err && <div style={{ background:"#fdf0ee", border:"1px solid #f0b0a0", color:"#7a0000", padding:"10px 14px", borderRadius:8, fontSize:13, marginBottom:14 }}>⚠️ {err}</div>}

          {/* Role picker */}
          <div style={{ marginBottom:16 }}>
            <label style={S.lbl}>Select Your Role *</label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {roles.map(r => (
                <div key={r.val} onClick={() => setForm({
                  ...form,
                  role: r.val,
                  doctorCode: r.val === "doctor" ? form.doctorCode : "",
                  receptionCode: r.val === "receptionist" ? form.receptionCode : "",
                })} style={{ border:`2px solid ${form.role===r.val?"#c9973a":"#e0dbd4"}`, background:form.role===r.val?"#fdf6e8":"#fff", borderRadius:12, padding:"12px 8px", cursor:"pointer", textAlign:"center", transition:"all .18s" }}>
                  <div style={{ fontSize:24 }}>{r.icon}</div>
                  <div style={{ fontSize:11, fontWeight:800, marginTop:4, color:form.role===r.val?"#7a5c1e":"#1a1a2e" }}>{r.label}</div>
                  <div style={{ fontSize:10, color:"#8a9aaa", marginTop:2 }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <div><label style={S.lbl}>Full Name *</label><input style={S.inp} placeholder="Your full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div><label style={S.lbl}>Mobile</label><input style={S.inp} placeholder="10-digit mobile" value={form.mobile} onChange={e=>setForm({...form,mobile:e.target.value})} /></div>
          </div>
          <div style={{ marginBottom:14 }}><label style={S.lbl}>Email Address *</label><input style={S.inp} type="email" placeholder="email@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <div><label style={S.lbl}>Password *</label><input style={S.inp} type="password" placeholder="Min 6 characters" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></div>
            <div><label style={S.lbl}>Confirm Password *</label><input style={S.inp} type="password" placeholder="Repeat password" value={form.confirmPwd} onChange={e=>setForm({...form,confirmPwd:e.target.value})} /></div>
          </div>
          {form.role === "doctor" && (
            <div style={{ marginBottom: 12 }}>
              <label style={S.lbl}>Doctor Registration Code *</label>
              <input style={S.inp} placeholder="Enter doctor code" value={form.doctorCode} onChange={e=>setForm({...form,doctorCode:e.target.value})} />
              <div style={{ fontSize: 11, color: "#8a9aaa", marginTop: 6 }}>Required for Doctor registration.</div>
            </div>
          )}
          {form.role === "receptionist" && (
            <div style={{ marginBottom: 20 }}>
              <label style={S.lbl}>Receptionist Registration Code *</label>
              <input style={S.inp} placeholder="Enter receptionist code" value={form.receptionCode} onChange={e=>setForm({...form,receptionCode:e.target.value})} />
              <div style={{ fontSize: 11, color: "#8a9aaa", marginTop: 6 }}>Required for Receptionist registration.</div>
            </div>
          )}

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={onBack} style={{ flex:1, padding:"12px", background:"transparent", border:"1.5px solid #e0dbd4", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", color:"#4a5a6a" }}>← Back to Login</button>
            <button onClick={submit} disabled={loading} style={{ flex:1, padding:"12px", background:loading?"#8a9aaa":"#c9973a", color:"#0d1f2d", border:"none", borderRadius:10, fontSize:14, fontWeight:800, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit" }}>
              {loading ? "🔄 Creating..." : "✅ Create Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ...............................................................................
// SIDEBAR + TOPBAR
// ...............................................................................

const NAV_DOCTOR = [
  { id: "dashboard", label: "Dashboard", icon: "🏠", section: "MAIN" },
  { id: "queue", label: "Patient Queue", icon: "🚶", section: "" },
  { id: "planner", label: "Daily Planner", icon: "📋", section: "" },
  { id: "appointments", label: "Appointments", icon: "📅", section: "" },
  { id: "patients", label: "Owners & Pets", icon: "🐾", section: "CLINICAL" },
  { id: "consultation", label: "Consultation", icon: "🩺", section: "" },
  { id: "vaccination", label: "Vaccination", icon: "💉", section: "" },
  { id: "timeline", label: "Patient Timeline", icon: "📜", section: "" },
  { id: "certificates", label: "Certificates & Forms", icon: "📋", section: "" },
  { id: "billing", label: "Billing", icon: "💳", section: "ADMIN" },
  { id: "inventory", label: "Inventory", icon: "📦", section: "" },
  { id: "suppliers", label: "Supplier Payments", icon: "🏭", section: "" },
  { id: "analytics", label: "Analytics", icon: "📊", section: "" },
  { id: "reminders", label: "Reminders", icon: "🔔", section: "" },
  { id: "settings", label: "Settings", icon: "⚙️", section: "" },
];
const NAV_ADMIN = [
  { id: "dashboard", label: "Dashboard", icon: "🏠", section: "OVERVIEW" },
  { id: "admin-users", label: "User Management", icon: "👥", section: "" },
  { id: "admin-sessions", label: "Active Sessions", icon: "🔐", section: "" },
  { id: "admin-activity", label: "Activity Log", icon: "📋", section: "" },
  { id: "queue", label: "Patient Queue", icon: "🚶", section: "CLINIC" },
  { id: "planner", label: "Daily Planner", icon: "🗒️", section: "" },
  { id: "appointments", label: "Appointments", icon: "📅", section: "" },
  { id: "patients", label: "Owners & Pets", icon: "🐾", section: "" },
  { id: "consultation", label: "Consultation", icon: "🩺", section: "" },
  { id: "vaccination", label: "Vaccination", icon: "💉", section: "" },
  { id: "timeline", label: "Timeline", icon: "📜", section: "" },
  { id: "certificates", label: "Certificates", icon: "📋", section: "" },
  { id: "billing", label: "Billing", icon: "💳", section: "ADMIN" },
  { id: "inventory", label: "Inventory", icon: "📦", section: "" },
  { id: "suppliers", label: "Suppliers", icon: "🏭", section: "" },
  { id: "analytics", label: "Analytics", icon: "📊", section: "" },
  { id: "reminders", label: "Reminders", icon: "🔔", section: "" },
  { id: "system-admin", label: "System Admin", icon: "🛡️", section: "SYSTEM" },
  { id: "settings", label: "Settings", icon: "⚙️", section: "" },
];
const NAV_RECEP = NAV_DOCTOR
  .filter((item) => !["analytics","billing","inventory","suppliers","reminders","settings"].includes(item.id))
  .map((item) => ({ ...item, section: item.section === "ADMIN" ? "" : item.section }));
const NAV_OWNER = [
  { id: "owner-home", label: "My Pets", icon: "🐾", section: "MY PORTAL" },
  { id: "owner-petinfo", label: "Pet Information", icon: "📋", section: "" },
  { id: "owner-book-apt", label: "Book Appointment", icon: "📅", section: "" },
  { id: "owner-records", label: "Medical Records", icon: "📜", section: "" },
  { id: "owner-vaccines", label: "Vaccination Card", icon: "💉", section: "" },
  { id: "owner-appointments", label: "My Appointments", icon: "🗓️", section: "" },
  { id: "owner-prescriptions", label: "Prescriptions", icon: "💊", section: "" },
];

function Sidebar({ page, setPage, user, collapsed, setCollapsed }) {
  const navItems = user.role === "admin" ? NAV_ADMIN : user.role === "doctor" ? NAV_DOCTOR : user.role === "receptionist" ? NAV_RECEP : NAV_OWNER;
  const db = initDB();
  const lowStock = db.inventory.filter(i => i.stock < i.minStock).length;
  const waiting = db.visits.filter(v => v.status === "waiting").length;
  const ROLE_COLORS = { doctor: "#1d6a6a", receptionist: "#c9973a", admin: "#c0392b", owner: "#7a5c1e" };
  const ROLE_LABELS = { doctor: "Veterinarian", receptionist: "Reception", admin: "System Admin", owner: "Pet Owner" };
  let lastSec = "";

  return (
    <div className={`sidebar${collapsed ? " mini" : ""}`}>
      <div className="s-logo">
        <div className="s-logo-icon">🐾</div>
        {!collapsed && <div><div className="s-logo-name">Royal Pet Clinic</div><div className="s-logo-sub">Management System</div></div>}
      </div>
      {!collapsed && (
        <div style={{ padding: "8px 14px 0", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", background: "rgba(255,255,255,.05)", borderRadius: 9, border: "1px solid rgba(255,255,255,.07)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: ROLE_COLORS[user.role] || "#1a3347", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{user.avatar}</div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: 10, color: ROLE_COLORS[user.role] || "#c9973a", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em" }}>{ROLE_LABELS[user.role] || user.role}</div>
            </div>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#2ecc71", flexShrink: 0 }} title="Online" />
          </div>
        </div>
      )}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {navItems.map((item) => {
          const showSec = item.section && item.section !== lastSec;
          if (showSec) lastSec = item.section;
          const badge = item.id === "inventory" ? lowStock > 0 ? lowStock : null : item.id === "queue" ? waiting > 0 ? waiting : null : null;
          return (
            <div key={item.id}>
              {showSec && !collapsed && <div className="s-sec-label">{item.section}</div>}
              {showSec && collapsed && <div className="s-divider" />}
              <div className={`s-item${page === item.id ? " on" : ""}`} onClick={() => setPage(item.id)} title={collapsed ? item.label : ""}>
                <span className="s-icon">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && badge && <span className="s-badge">{badge}</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="s-divider" />
      <div className="s-item" style={{ borderLeft: "none", justifyContent: collapsed ? "center" : "flex-start" }} onClick={() => setCollapsed(!collapsed)} title={collapsed ? "Expand" : "Collapse"}>
        <span className="s-icon">{collapsed ? "▶" : "◀"}</span>
        {!collapsed && <span style={{ fontSize: 12, color: "rgba(255,255,255,.3)" }}>Collapse</span>}
      </div>
    </div>
  );
}

function Topbar({ page, setPage, user, onLogout, onSwitchUser, globalSearch, setGlobalSearch, activeSessions }) {
  const { db } = useApp();
  const TITLES = { dashboard: "Dashboard", queue: "Patient Queue", planner: "Daily Planner", appointments: "Appointments", patients: "Owners & Pets", consultation: "Consultation Room", vaccination: "Vaccination", timeline: "Patient Timeline", certificates: "Certificates & Forms", billing: "Billing", inventory: "Inventory", suppliers: "Supplier Payments", analytics: "Analytics & Reports", reminders: "Reminders", "system-admin": "System Administration", "admin-users": "User Management", "admin-sessions": "Active Sessions", "admin-activity": "Activity Log", settings: "Settings", "owner-home": "My Pets", "owner-petinfo": "Pet Information", "owner-book-apt": "Book Appointment", "owner-records": "Medical Records", "owner-vaccines": "Vaccination Card", "owner-appointments": "My Appointments", "owner-prescriptions": "Prescriptions" };
  const ROLE_COLORS = { doctor: "#1a3347", receptionist: "#1d6a6a", admin: "#8b1a1a", owner: "#7a5c1e" };
  const ROLE_LABELS = { doctor: "Veterinarian", receptionist: "Receptionist", admin: "System Admin", owner: "Pet Owner" };
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [readNotifs, setReadNotifs] = useState([]);
  const now = new Date();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isValidDate = (d) => d && !isNaN(new Date(d).getTime());
  const lowStockCount = db.inventory.filter(i => i.stock < i.minStock).length;
  const overdueVaccs = db.vaccinations.filter(v => v.status === "overdue").length;
  const waitingCount = db.visits.filter(v => v.status === "waiting").length;
  const expiredInventory = db.inventory.filter(i => isValidDate(i.expiry) && new Date(i.expiry) < today);

  const notifications = [
    ...db.visits.filter(v => v.status === "waiting").map(v => { const p = db.pets.find(p => p.id === v.petId); return { key: `visit-${v.id}`, icon: "🚶", msg: `${p?.name || "Patient"} is waiting${v.emergency ? " - EMERGENCY" : ""}`, type: v.emergency ? "error" : "warning", time: "Now", page: "queue", action: "Open Queue" }; }),
    ...db.inventory.filter(i => i.stock < i.minStock).map(i => ({ key: `inv-${i.id}`, icon: "📦", msg: `${i.name} - Low stock (${i.stock} ${i.unit})`, type: "warning", time: "Today", page: "inventory", action: "Open Inventory" })),
    ...expiredInventory.map(i => ({ key: `exp-${i.id}`, icon: "⌛", msg: `${i.name} expired on ${fmt(i.expiry)}`, type: "error", time: "Expired", page: "inventory", action: "Review Stock" })),
    ...db.vaccinations.filter(v => v.status === "overdue").slice(0,3).map(v => { const p = db.pets.find(p => p.id === v.petId); return { key: `vacc-${v.id}`, icon: "💉", msg: `${p?.name || "Pet"}: ${v.vaccine} overdue`, type: "error", time: "Overdue", page: "reminders", action: "Open Reminders" }; }),
  ].slice(0, 10);
  const unreadNotifications = notifications.filter(n => !readNotifs.includes(n.key));
  const totalNotifs = unreadNotifications.length;

  const markAllRead = () => {
    if (unreadNotifications.length === 0) return;
    setReadNotifs(prev => {
      const all = new Set(prev);
      notifications.forEach(n => all.add(n.key));
      return Array.from(all);
    });
  };

  const openNotification = (n) => {
    setReadNotifs(prev => (prev.includes(n.key) ? prev : [...prev, n.key]));
    setShowNotif(false);
    if (n.page && setPage) setPage(n.page);
  };

  useEffect(() => {
    if (!showNotif || unreadNotifications.length === 0) return;
    const timer = setTimeout(() => {
      markAllRead();
      setShowNotif(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, [showNotif, unreadNotifications.length]);

  return (
    <div className="topbar" style={{ position: "relative" }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Cormorant Garamond',serif" }}>{TITLES[page] || page}</div>
        <div style={{ fontSize: 11, color: "var(--txt3)" }}>{now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
      </div>
      {user.role !== "owner" && (
        <div className="srch" style={{ marginLeft: 20 }}>
          <span className="srch-ic">🔍</span>
          <input className="srch-inp" placeholder="Search pet, owner, case number..." value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} />
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginLeft: 16, alignItems: "center" }}>
        {/* Notifications bell */}
        <div style={{ position: "relative" }}>
          <button className="btn-ico notif" onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false); setShowSessions(false); }}>
            <span style={{ fontSize: 16 }}>🔔</span>
            {totalNotifs > 0 && <span className="ndot" />}
          </button>
          {showNotif && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "var(--white)", borderRadius: "var(--r-lg)", boxShadow: "var(--s3)", border: "1px solid var(--bdr)", width: 320, zIndex: 500, animation: "fadeUp .2s" }}>
              <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid var(--bdr2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontWeight: 800, fontSize: 13 }}>🔔 Notifications</div><div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 1 }}>{unreadNotifications.length} alerts</div></div>
                {totalNotifs > 0 && <span className="badge b-emg" style={{ fontSize: 10 }}>{totalNotifs} new</span>}
              </div>
              {unreadNotifications.length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", color: "var(--txt3)", fontSize: 13 }}>✅ All clear - no notifications</div>
              ) : unreadNotifications.map((n, i) => (
                <div key={i} onClick={() => openNotification(n)} style={{ display: "flex", gap: 10, padding: "10px 14px", borderBottom: "1px solid var(--bdr3)", background: n.type === "error" ? "var(--red-bg)" : n.type === "warning" ? "var(--org-bg)" : "transparent", cursor: "pointer" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: n.type === "error" ? "var(--red)" : n.type === "warning" ? "var(--org)" : "var(--txt)" }}>{n.msg}</div>
                    <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 2 }}>{n.time}</div>
                  </div>
                  <button className="btn btn-ghost btn-xs" onClick={(e) => { e.stopPropagation(); openNotification(n); }} style={{ alignSelf: "center" }}>{n.action || "Open →"}</button>
                </div>
              ))}
              <div style={{ padding: "10px 14px", borderTop: "1px solid var(--bdr2)", textAlign: "center" }}>
                <button className="btn btn-ghost btn-xs" style={{ width: "100%" }} onClick={() => { markAllRead(); setShowNotif(false); }}>Mark all as read</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* User menu */}
      <div style={{ position: "relative" }}>
        <div className="tu" onClick={() => { setShowUserMenu(!showUserMenu); setShowNotif(false); setShowSessions(false); }}>
          <div className="tu-ava" style={{ background: ROLE_COLORS[user.role] || "#1a3347" }}>{user.avatar}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "var(--txt3)", textTransform: "capitalize" }}>{ROLE_LABELS[user.role] || user.role}</div>
          </div>
          <span style={{ fontSize: 12, color: "var(--txt3)", marginLeft: 2 }}>▾</span>
        </div>
        {showUserMenu && (
          <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "var(--white)", borderRadius: "var(--r-lg)", boxShadow: "var(--s3)", border: "1px solid var(--bdr)", width: 240, zIndex: 500, animation: "fadeUp .2s" }}>
            {/* User info */}
            <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid var(--bdr2)", background: "var(--canvas)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: ROLE_COLORS[user.role] || "#1a3347", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#fff" }}>{user.avatar}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: "var(--txt3)" }}>{user.email}</div>
                  <span style={{ fontSize: 10, background: ROLE_COLORS[user.role]+"22", color: ROLE_COLORS[user.role], padding: "1px 7px", borderRadius: 10, fontWeight: 700, marginTop: 3, display: "inline-block", textTransform: "capitalize" }}>{ROLE_LABELS[user.role] || user.role}</span>
                </div>
              </div>
            </div>
            {/* Menu items */}
            {[
              { icon: "👤", label: "My Profile", action: null },
              { icon: "🔒", label: "Change Password", action: null },
              { icon: "⚙️", label: "Preferences", action: null },
              { icon: "🔄", label: "Switch Account", action: () => { onSwitchUser(null); setShowUserMenu(false); } },
            ].map((item, i) => (
              <div key={i} onClick={item.action} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", cursor: item.action ? "pointer" : "default", fontSize: 13, color: "var(--txt)", transition: "background .15s", borderBottom: "1px solid var(--bdr3)" }}
                onMouseEnter={e => item.action && (e.currentTarget.style.background = "var(--bdr3)")}
                onMouseLeave={e => item.action && (e.currentTarget.style.background = "transparent")}>
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                <span style={{ fontWeight: 500 }}>{item.label}</span>
                {!item.action && <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--txt4)" }}>Soon</span>}
              </div>
            ))}
            <div style={{ padding: "6px 10px 8px" }}>
              <button onClick={() => { setShowUserMenu(false); onLogout(); }} className="btn btn-red btn-sm" style={{ width: "100%", justifyContent: "center" }}>⏻ Sign Out</button>
            </div>
          </div>
        )}
      </div>
      {/* Click-away overlay */}
      {(showUserMenu || showNotif || showSessions) && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400 }} onClick={() => { setShowUserMenu(false); setShowNotif(false); setShowSessions(false); }} />
      )}
    </div>
  );
}

// ...............................................................................
// DASHBOARD (Role-based)
// ...............................................................................

function AdminDashboard({ setPage }) {
  const { db } = useApp();
  const totalRevenue = db.invoices.reduce((s, i) => s + i.total, 0);
  const todayRevenue = db.invoices.filter(i => i.date === todayStr()).reduce((s, i) => s + i.total, 0);
  const activeUsers = db.users.filter(u => u.active !== false).length;
  const sessions = (() => { try { return JSON.parse(sessionStorage.getItem("rpc_sessions")||"[]"); } catch { return []; } })();
  const lowStock = db.inventory.filter(i => i.stock < i.minStock);
  const overdueVaccs = db.vaccinations.filter(v => v.status === "overdue");
  const pendingPayments = (db.supplierPayments||[]).filter(p => p.status === "pending");
  const actLog = [...(db.activityLog||[])].reverse().slice(0,8);
  const ROLE_COLORS = { doctor:"#1d6a6a", receptionist:"#c9973a", admin:"#c0392b", owner:"#7a5c1e" };

  return (
    <div className="fu">
      <div style={{ marginBottom: 22 }}>
        <div className="pt" style={{ fontSize: 22 }}>🛡️ System Overview</div>
        <div className="ps">Royal Pet Clinic - Administration Dashboard</div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { l: "Total Users", v: db.users.length, sub: `${activeUsers} active`, i: "👥", c: "c1", page: "system-admin" },
          { l: "Active Sessions", v: sessions.length || 1, sub: "Logged in now", i: "🔐", c: "c3", page: "system-admin" },
          { l: "Today Revenue", v: `₹${todayRevenue.toLocaleString()}`, sub: `Total ₹${totalRevenue.toLocaleString()}`, i: "💳", c: "c2", page: "billing" },
          { l: "Low Stock Alerts", v: lowStock.length, sub: overdueVaccs.length + " overdue vaccines", i: "⚠️", c: "c5", page: "inventory" },
        ].map((s, i) => (
          <div key={i} className={`scard ${s.c}`} style={{ cursor: "pointer" }} onClick={() => setPage(s.page)}>
            <div className="sico">{s.i}</div><div className="sval" style={{ fontSize: 28 }}>{s.v}</div>
            <div className="slbl">{s.l}</div><div className="strd nu">{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { l: "Total Patients", v: db.pets.length, i: "🐾", c: "c1" },
          { l: "Total Visits", v: db.visits.length, i: "🩺", c: "c2" },
          { l: "Invoices", v: db.invoices.length, i: "📋", c: "c3" },
          { l: "Pending Payments", v: pendingPayments.length, i: "⏳", c: "c4" },
        ].map((s, i) => (
          <div key={i} className={`scard ${s.c}`}><div className="sico">{s.i}</div><div className="sval" style={{ fontSize: 26 }}>{s.v}</div><div className="slbl">{s.l}</div></div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
        {/* Active Sessions */}
        <div className="card">
          <div className="card-head"><span className="card-title">🔐 Active Sessions</span><button className="btn btn-ghost btn-xs" onClick={() => setPage("system-admin")}>Manage →</button></div>
          <div style={{ padding: "8px 14px" }}>
            {sessions.length === 0 && <div style={{ padding: 14, textAlign: "center", color: "var(--txt3)", fontSize: 12 }}>Only you are logged in</div>}
            {sessions.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", borderBottom: "1px solid var(--bdr3)" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: ROLE_COLORS[s.role]||"#1a3347", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{s.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: "var(--txt3)", textTransform: "capitalize" }}>{s.role} · Since {s.loginTime}</div>
                </div>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--grn)" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Users by Role */}
        <div className="card">
          <div className="card-head"><span className="card-title">👥 Staff & Users</span><button className="btn btn-ghost btn-xs" onClick={() => setPage("system-admin")}>+ Add →</button></div>
          <div style={{ padding: "8px 14px" }}>
            {["doctor","receptionist","admin","owner"].map(role => {
              const count = db.users.filter(u => u.role === role).length;
              const labels = { doctor: "Doctors / Vets", receptionist: "Receptionists", admin: "Admins", owner: "Pet Owners" };
              const icons = { doctor: "👨‍⚕️", receptionist: "👩‍💼", admin: "🛡️", owner: "🏠" };
              return (
                <div key={role} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 4px", borderBottom: "1px solid var(--bdr3)" }}>
                  <span style={{ fontSize: 18 }}>{icons[role]}</span>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{labels[role]}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 800, color: ROLE_COLORS[role] }}>{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Log */}
        <div className="card">
          <div className="card-head"><span className="card-title">📋 Recent Activity</span></div>
          <div style={{ padding: "8px 14px" }}>
            {actLog.length === 0 && <div style={{ textAlign: "center", padding: 16, color: "var(--txt3)", fontSize: 12 }}>No activity logged yet</div>}
            {actLog.map((log, i) => (
              <div key={i} style={{ padding: "7px 0", borderBottom: "1px solid var(--bdr3)", fontSize: 11 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ color: log.type === "error" ? "var(--red)" : log.type === "warning" ? "var(--org)" : "var(--txt2)", fontWeight: 700, fontSize: 12 }}>{log.action}</span>
                  <span style={{ color: "var(--txt3)", marginLeft: "auto", fontFamily: "'JetBrains Mono',monospace", fontSize: 10 }}>{log.time?.split(",")[1]?.trim() || ""}</span>
                </div>
                <div style={{ color: "var(--txt3)", marginTop: 1 }}>{log.user} - {log.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(lowStock.length > 0 || overdueVaccs.length > 0 || pendingPayments.length > 0) && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>⚠️ System Alerts</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {lowStock.slice(0,3).map(i => <div key={i.id} className="alert a-err" style={{ margin: 0 }}>📦 <strong>{i.name}</strong> - {i.stock} {i.unit} left</div>)}
            {overdueVaccs.slice(0,3).map(v => { const p = db.pets.find(pt=>pt.id===v.petId); return <div key={v.id} className="alert a-warn" style={{ margin: 0 }}>💉 {p?.name}: {v.vaccine} overdue</div>; })}
            {pendingPayments.slice(0,3).map(p => <div key={p.id} className="alert a-info" style={{ margin: 0 }}>⏳ {p.vendor} - ₹{p.total} pending</div>)}
          </div>
        </div>
      )}
    </div>
  );
}

function Dashboard({ user, setPage }) {
  const { db, toast } = useApp();
  if (user.role === "admin") return <AdminDashboard setPage={setPage} />;

  const todayVisits = db.visits.filter(v => v.date === todayStr());
  const waiting = db.visits.filter(v => v.status === "waiting");
  const consulting = db.visits.filter(v => v.status === "consulting");
  const lowStock = db.inventory.filter(i => i.stock < i.minStock);
  const todayApts = db.appointments.filter(a => a.date === todayStr());
  const overdue = db.vaccinations.filter(v => v.status === "overdue");
  const todayRevenue = db.invoices.filter(i => i.date === todayStr()).reduce((s, i) => s + i.total, 0);
  const totalRevenue = db.invoices.reduce((s, i) => s + i.total, 0);
  const monthRevenue = db.invoices.filter(i => i.date?.startsWith(todayStr().slice(0,7))).reduce((s, i) => s + i.total, 0);
  const recentVisits = [...db.visits].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0,3);

  if (user.role === "owner") {
    const ownerRec = db.owners.find(o => o.mobile === user.mobile);
    const ownerPets = db.pets.filter(p => ownerRec && p.ownerId === ownerRec.id);
    const myVaccs = ownerPets.flatMap(p => db.vaccinations.filter(v => v.petId === p.id && (v.status === "due" || v.status === "overdue")));
    const myApts = db.appointments.filter(a => ownerPets.some(p => p.id === a.petId) && new Date(a.date) >= new Date()).sort((a,b) => new Date(a.date)-new Date(b.date));
    return (
      <div className="fu">
        <div style={{ background: "linear-gradient(135deg,var(--ink),var(--ink-soft))", borderRadius: "var(--r-lg)", padding: "22px 24px", marginBottom: 22, color: "#fff" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700 }}>Welcome back, {user.name.split(" ")[0]}! 🐾</div>
          <div style={{ fontSize: 13, opacity: .7, marginTop: 4 }}>Your pet health portal - {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 20 }}>
          {[
            { label: "My Pets", val: ownerPets.length, icon: "🐾", c: "c1", page: "owner-home" },
            { label: "Upcoming Apts", val: myApts.length, icon: "📅", c: "c2", page: "owner-appointments" },
            { label: "Vaccines Due", val: myVaccs.length, icon: "💉", c: myVaccs.length > 0 ? "c5" : "c3", page: "owner-vaccines" },
          ].map((s, i) => (
            <div key={i} className={`scard ${s.c}`} style={{ cursor: "pointer" }} onClick={() => setPage(s.page)}>
              <div className="sico">{s.icon}</div><div className="sval">{s.val}</div><div className="slbl">{s.label}</div>
            </div>
          ))}
        </div>
        {myVaccs.length > 0 && <div className="alert a-warn" style={{ marginBottom: 14 }}>💉 {myVaccs.length} vaccination(s) overdue or due soon. <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => setPage("owner-vaccines")}>View →</span></div>}
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>My Pets</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
          {ownerPets.length ? ownerPets.map(pet => <PetMiniCard key={pet.id} pet={pet} db={db} />) : (
            <div className="card" style={{ padding: 28, textAlign: "center", color: "var(--txt3)", gridColumn: "span 2" }}>
              <div style={{ fontSize: 40 }}>🐾</div><div style={{ marginTop: 10 }}>No pets registered. Contact the clinic.</div>
            </div>
          )}
        </div>
        {myApts.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Upcoming Appointments</div>
            {myApts.slice(0,3).map(a => {
              const pet = db.pets.find(p => p.id === a.petId);
              return (
                <div key={a.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", background: "var(--white)", borderRadius: "var(--r)", border: "1px solid var(--bdr2)", marginBottom: 8 }}>
                  <div style={{ fontSize: 26 }}>{pet?.photo}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{pet?.name} - {a.type}</div>
                    <div style={{ fontSize: 12, color: "var(--txt2)" }}>{fmt(a.date)} at {a.time}</div>
                  </div>
                  <span className={`badge ${a.status === "confirmed" ? "b-bill" : "b-wait"}`}>{a.status}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Doctor & Receptionist Dashboard
  const QUICK_ACTIONS = user.role === "doctor" ? [
    { label: "New Consultation", icon: "🩺", color: "var(--ink)", page: "consultation" },
    { label: "Walk-in Patient", icon: "🚶", color: "var(--teal)", page: "queue" },
    { label: "Vaccination", icon: "💉", color: "#7a1a5a", page: "vaccination" },
    { label: "View Patients", icon: "🐾", color: "var(--gold-dim)", page: "patients" },
    { label: "Daily Planner", icon: "📋", color: "#1a5a8a", page: "planner" },
    { label: "Analytics", icon: "📊", color: "#2a7a3a", page: "analytics" },
  ] : [
    { label: "Patient Queue", icon: "🚶", color: "var(--ink)", page: "queue" },
    { label: "Appointments", icon: "📅", color: "var(--teal)", page: "appointments" },
    { label: "Register Pet", icon: "🐾", color: "var(--gold-dim)", page: "patients" },
    { label: "New Invoice", icon: "💳", color: "#7a1a5a", page: "billing" },
    { label: "Inventory", icon: "📦", color: "#1a5a8a", page: "inventory" },
    { label: "Reminders", icon: "🔔", color: "#2a7a3a", page: "reminders" },
  ];

  return (
    <div className="fu">
      {/* Welcome banner */}
      <div style={{ background: "linear-gradient(135deg,var(--ink) 0%,var(--ink-soft) 60%,#1a4a5a 100%)", borderRadius: "var(--r-lg)", padding: "18px 24px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: "#fff" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700 }}>
            {new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 17 ? "Good Afternoon" : "Good Evening"}, {user.name.split(" ")[0]}! {new Date().getHours() < 12 ? "🌤️" : new Date().getHours() < 17 ? "☀️" : "🌙"}
          </div>
          <div style={{ fontSize: 12, opacity: .65, marginTop: 3 }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {user.role === "doctor" && <button className="btn btn-gold" onClick={() => setPage("consultation")}>🩺 Consultation</button>}
          <button className="btn" style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1px solid rgba(255,255,255,.2)" }} onClick={() => setPage("appointments")}>📅 Appointments</button>
        </div>
      </div>

      {/* KPI row */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {(user.role === "doctor" ? [
          { label: "Today's Patients", val: todayVisits.length, icon: "🐾", c: "c1", trend: `${waiting.length} waiting, ${consulting.length} consulting`, dir: "nu" },
          { label: "Revenue Today", val: `₹${todayRevenue.toLocaleString()}`, icon: "💳", c: "c2", trend: `Month: ₹${monthRevenue.toLocaleString()}`, dir: "up" },
          { label: "In Queue Now", val: waiting.length, icon: "⏳", c: waiting.length > 3 ? "c5" : "c3", trend: consulting.length + " in consultation", dir: "nu" },
          { label: "Low Stock Items", val: lowStock.length, icon: "📦", c: lowStock.length > 0 ? "c4" : "c3", trend: lowStock.length > 0 ? "Action needed" : "All stocked", dir: lowStock.length > 0 ? "dn" : "up" },
        ] : [
          { label: "Today's Appointments", val: todayApts.length, icon: "📅", c: "c1", trend: todayApts.filter(a=>a.status==="checked-in").length + " checked in", dir: "nu" },
          { label: "Queue Length", val: waiting.length, icon: "⏳", c: "c3", trend: consulting.length + " consulting", dir: "nu" },
          { label: "Revenue Today", val: `₹${todayRevenue.toLocaleString()}`, icon: "💳", c: "c2", trend: `Total ₹${totalRevenue.toLocaleString()}`, dir: "up" },
          { label: "Low Stock Alerts", val: lowStock.length, icon: "📦", c: lowStock.length > 0 ? "c5" : "c3", trend: lowStock.length > 0 ? "⚠️ Restock needed" : "✅ OK", dir: lowStock.length > 0 ? "dn" : "up" },
        ]).map((s, i) => (
          <div key={i} className={`scard ${s.c}`}><div className="sico">{s.icon}</div><div className="sval">{s.val}</div><div className="slbl">{s.label}</div><div className={`strd ${s.dir}`}>{s.trend}</div></div>
        ))}
      </div>

      {/* Alerts */}
      {lowStock.slice(0,2).map(i => <div key={i.id} className="alert a-err" style={{ marginBottom: 7 }}>📦 <strong>{i.name}</strong> - Only {i.stock} {i.unit} left (min {i.minStock}). <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => setPage("inventory")}>View →</span></div>)}
      {overdue.slice(0,2).map(v => { const p = db.pets.find(pt=>pt.id===v.petId); return <div key={v.id} className="alert a-warn" style={{ marginBottom: 7 }}>💉 <strong>{p?.name}</strong> - {v.vaccine} overdue. <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => setPage("reminders")}>Remind →</span></div>; })}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginBottom: 18 }}>
        {/* Quick Actions */}
        <div className="card">
          <div className="card-head"><span className="card-title">⚡ Quick Actions</span></div>
          <div style={{ padding: "10px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {QUICK_ACTIONS.map((a, i) => (
              <button key={i} onClick={() => setPage(a.page)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "12px 8px", background: "var(--canvas)", border: "1px solid var(--bdr2)", borderRadius: 10, cursor: "pointer", transition: "all .18s", fontFamily: "inherit" }}
                onMouseEnter={e => { e.currentTarget.style.background = a.color; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = a.color; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--canvas)"; e.currentTarget.style.color = ""; e.currentTarget.style.borderColor = "var(--bdr2)"; }}>
                <span style={{ fontSize: 20 }}>{a.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Queue / Schedule */}
        <div className="card">
          <div className="card-head"><span className="card-title">📋 Today's Queue</span><button className="btn btn-ghost btn-xs" onClick={() => setPage("queue")}>Full Queue →</button></div>
          <div style={{ padding: "6px 12px" }}>
            {db.visits.filter(v => v.date === todayStr()).sort((a, b) => (b.emergency?1:0)-(a.emergency?1:0)).slice(0, 5).map(v => {
              const pet = db.pets.find(p => p.id === v.petId);
              const owner = pet && db.owners.find(o => o.id === pet.ownerId);
              if (!pet) return null;
              return (
                <div key={v.id} className={`q-item${v.emergency?" emg":""}`} style={{ marginBottom: 7, padding: "9px 11px" }}>
                  <div className="q-ava" style={{ background: pet.color, width: 36, height: 36 }}>{pet.photo}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{pet.name} {v.emergency && <span className="badge b-emg" style={{ fontSize: 9 }}>EMG</span>}</div>
                    <div style={{ fontSize: 10, color: "var(--txt2)" }}>{owner?.name} · {v.reason?.slice(0,25)}</div>
                  </div>
                  {STATUS_MAP[v.status]}
                </div>
              );
            })}
            {db.visits.filter(v => v.date === todayStr()).length === 0 && <div style={{ textAlign: "center", padding: 18, color: "var(--txt3)", fontSize: 12 }}>No visits today yet</div>}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="card">
          <div className="card-head"><span className="card-title">📅 Today's Schedule</span><button className="btn btn-ghost btn-xs" onClick={() => setPage("appointments")}>All →</button></div>
          <div style={{ padding: "6px 12px" }}>
            {todayApts.slice(0, 5).map(a => {
              const pet = db.pets.find(p => p.id === a.petId);
              const owner = db.owners.find(o => o.id === a.ownerId);
              const typeColors = { "Emergency": "var(--red)", "Vaccination": "var(--teal)", "Follow-up": "var(--ink)", "Deworming": "#7a3a9a", "Check-up": "var(--gold-dim)" };
              return (
                <div key={a.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 6px", borderBottom: "1px solid var(--bdr3)" }}>
                  <div style={{ background: typeColors[a.type]||"var(--ink)", color: "#fff", borderRadius: 6, padding: "3px 7px", fontSize: 11, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, minWidth: 44, textAlign: "center" }}>{a.time}</div>
                  <div style={{ fontSize: 18 }}>{pet?.photo||"🐾"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{pet?.name}</div>
                    <div style={{ fontSize: 10, color: "var(--txt3)" }}>{owner?.name} · {a.type}</div>
                  </div>
                  <span className={`badge ${a.status==="checked-in"?"b-cons":a.status==="confirmed"?"b-bill":"b-wait"}`} style={{ fontSize: 9 }}>
                    {a.status==="checked-in"?"✅ In":a.status==="confirmed"?"Conf.":"Pend."}
                  </span>
                </div>
              );
            })}
            {todayApts.length === 0 && <div style={{ textAlign: "center", padding: 18, color: "var(--txt3)", fontSize: 12 }}>No appointments today</div>}
          </div>
        </div>
      </div>

      {/* Recent Patients + Revenue Snapshot */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div className="card">
          <div className="card-head"><span className="card-title">🐾 Recent Patients</span><button className="btn btn-ghost btn-xs" onClick={() => setPage("patients")}>All Patients →</button></div>
          <div style={{ padding: "6px 14px" }}>
            {recentVisits.map(v => {
              const pet = db.pets.find(p => p.id === v.petId);
              const owner = pet && db.owners.find(o => o.id === pet.ownerId);
              return (
                <div key={v.id} style={{ display: "flex", gap: 11, alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--bdr3)" }}>
                  <div style={{ fontSize: 22 }}>{pet?.photo}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{pet?.name}</div>
                    <div style={{ fontSize: 11, color: "var(--txt2)" }}>{owner?.name} · {v.diagnosis||v.reason}</div>
                    <div style={{ fontSize: 10, color: "var(--txt3)" }}>{fmt(v.date)}</div>
                  </div>
                  {STATUS_MAP[v.status]}
                </div>
              );
            })}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><span className="card-title">💳 Revenue Snapshot</span><button className="btn btn-ghost btn-xs" onClick={() => setPage("analytics")}>Full Report →</button></div>
          <div style={{ padding: "14px 18px" }}>
            {[
              { l: "Today", v: todayRevenue, max: 10000 },
              { l: "This Month", v: monthRevenue, max: 100000 },
              { l: "All Time", v: totalRevenue, max: totalRevenue },
            ].map(({ l, v, max }) => (
              <div key={l} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                  <span style={{ fontWeight: 600 }}>{l}</span>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>₹{v.toLocaleString()}</span>
                </div>
                <div style={{ height: 6, background: "var(--bdr)", borderRadius: 3 }}><div style={{ height: "100%", background: "linear-gradient(90deg,var(--gold),var(--gold-lt))", borderRadius: 3, width: `${max>0?Math.min(100,(v/max)*100):0}%`, transition: "width .5s" }} /></div>
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
              {[
                { l: "Paid Invoices", v: db.invoices.filter(i=>i.status==="paid").length },
                { l: "Cash Payments", v: db.invoices.filter(i=>i.method==="Cash").length },
                { l: "UPI Payments", v: db.invoices.filter(i=>i.method==="UPI").length },
                { l: "Avg per Visit", v: `₹${db.invoices.length ? Math.round(totalRevenue/db.invoices.length).toLocaleString() : 0}` },
              ].map(({ l, v }) => (
                <div key={l} style={{ padding: "8px 10px", background: "var(--canvas)", borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{v}</div>
                  <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PetMiniCard({ pet, db }) {
  const owner = db.owners.find(o => o.id === pet.ownerId);
  const lastVisit = db.visits.filter(v => v.petId === pet.id && v.status === "done").sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  return (
    <div className="pcard">
      <div className="pava" style={{ background: pet.color, fontSize: 26 }}>{pet.photo}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 700 }}>{pet.name}</div>
        <div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 2 }}>{pet.breed} · {pet.type} · {calcAge(pet.dob)}</div>
        <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 3 }}>Last visit: {lastVisit ? fmt(lastVisit.date) : "No visits"}</div>
        {pet.alerts.length > 0 && <div style={{ marginTop: 6 }}>{pet.alerts.slice(0, 1).map((a, i) => <span key={i} className="badge b-emg" style={{ fontSize: 10 }}>s ️ {a}</span>)}</div>}
      </div>
    </div>
  );
}

// ...............................................................................
// PATIENT QUEUE
// ...............................................................................

function QueuePage({ setPage, setConsultVisit }) {
  const { db, saveDB, toast } = useApp();
  const [filter, setFilter] = useState("all");
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [vitalsVisit, setVitalsVisit] = useState(null);
  const [vitalsForm, setVitalsForm] = useState({ temp: "", hr: "", rr: "", weight: "" });

  const todayVisits = db.visits.filter(v => v.date === todayStr()).sort((a, b) => (b.emergency ? 1 : 0) - (a.emergency ? 1 : 0));
  const filtered = filter === "all" ? todayVisits : todayVisits.filter(v => v.status === filter);

  const updateStatus = (id, status) => {
    db.visits = db.visits.map(v => v.id === id ? { ...v, status } : v);
    saveDB();
    toast(`Status updated to ${status}`, "success");
  };

  const openVitals = (v) => {
    setVitalsVisit(v);
    setVitalsForm({ temp: v.temp || "", hr: v.hr || "", rr: v.rr || "", weight: v.weight || "" });
  };

  const saveVitals = () => {
    db.visits = db.visits.map(v => v.id === vitalsVisit.id ? { ...v, ...vitalsForm } : v);
    saveDB();
    toast("✅ Vitals saved!", "success");
    setVitalsVisit(null);
  };

  return (
    <div className="fu">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <div className="pt">Patient Queue</div>
          <div className="ps">{todayVisits.filter(v => v.status !== "done").length} active · {todayVisits.filter(v => v.emergency).length} emergency</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => setShowWalkIn(true)}>+ Walk-in</button>
          <button className="btn btn-gold" style={{ background: "var(--red)", color: "#fff" }} onClick={() => { setShowWalkIn(true); }}>🚶 Emergency</button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 7, marginBottom: 18, flexWrap: "wrap" }}>
        {["all", "waiting", "consulting", "billing", "done"].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? "btn-ink" : "btn-ghost"}`} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            <span style={{ marginLeft: 4, background: filter === f ? "rgba(255,255,255,.2)" : "var(--bdr)", color: filter === f ? "#fff" : "var(--txt3)", borderRadius: 10, padding: "0 5px", fontSize: 10 }}>
              {f === "all" ? todayVisits.length : todayVisits.filter(v => v.status === f).length}
            </span>
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
        {filtered.map((v, i) => {
          const pet = db.pets.find(p => p.id === v.petId);
          const owner = pet && db.owners.find(o => o.id === pet.ownerId);
          if (!pet) return null;
          const hasVitals = v.temp || v.hr || v.rr;
          return (
            <div key={v.id} className={`q-item${v.emergency ? " emg" : ""}`} style={{ borderRadius: "var(--r-lg)", padding: "15px 17px", alignItems: "flex-start" }}>
              <div style={{ fontSize: 13, fontFamily: "'JetBrains Mono',monospace", color: "var(--txt3)", minWidth: 22, paddingTop: 2 }}>#{i + 1}</div>
              <div className="q-ava" style={{ background: pet.color, fontSize: 22, width: 48, height: 48 }}>{pet.photo}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{pet.name}</span>
                  <span className="case-pill">{v.caseNum}</span>
                  {v.emergency && <span className="badge b-emg" style={{ fontSize: 9 }}>🚶</span>}
                </div>
                <div style={{ fontSize: 12, color: "var(--txt2)" }}>{owner?.name} · {pet.breed}</div>
                <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 3, fontStyle: "italic" }}>"{v.reason}"</div>
                {/* Vitals quick summary */}
                {hasVitals && (
                  <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                    {v.temp && <span style={{ fontSize: 10, background: "var(--canvas)", padding: "2px 7px", borderRadius: 8, fontFamily: "'JetBrains Mono',monospace" }}>🌡️ {v.temp}°F</span>}
                    {v.hr && <span style={{ fontSize: 10, background: "var(--canvas)", padding: "2px 7px", borderRadius: 8, fontFamily: "'JetBrains Mono',monospace" }}>❤️ {v.hr} bpm</span>}
                    {v.rr && <span style={{ fontSize: 10, background: "var(--canvas)", padding: "2px 7px", borderRadius: 8, fontFamily: "'JetBrains Mono',monospace" }}>🌬️ {v.rr}/min</span>}
                    {v.weight && <span style={{ fontSize: 10, background: "var(--canvas)", padding: "2px 7px", borderRadius: 8, fontFamily: "'JetBrains Mono',monospace" }}>⚖️ {v.weight}kg</span>}
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
                  {STATUS_MAP[v.status]}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 2 }}>
                {/* Vitals button ?" always available */}
                <button className="btn btn-ghost btn-sm" onClick={() => openVitals(v)} title="Record vital signs" style={{ background: hasVitals ? "var(--teal-pale)" : undefined, borderColor: hasVitals ? "var(--teal)" : undefined, color: hasVitals ? "var(--teal)" : undefined }}>
                  {hasVitals ? "✅ Vitals" : "🌡️ Vitals"}
                </button>
                {v.status === "waiting" && (
                  <button className="btn btn-ink btn-sm" onClick={() => { updateStatus(v.id, "consulting"); setConsultVisit(v); setPage("consultation"); }}>🩺 Start</button>
                )}
                {v.status === "consulting" && (
                  <button className="btn btn-gold btn-sm" onClick={() => { setConsultVisit(v); setPage("consultation"); }}>🩺 Resume</button>
                )}
                {v.status === "consulting" && (
                  <button className="btn btn-ghost btn-sm" onClick={() => updateStatus(v.id, "billing")}>💳 Billing</button>
                )}
                {v.status === "billing" && (
                  <button className="btn btn-teal btn-sm" onClick={() => updateStatus(v.id, "done")}>✅ Done</button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="card" style={{ padding: 32, textAlign: "center", color: "var(--txt3)", gridColumn: "span 2" }}>
            <div style={{ fontSize: 40 }}>🐾</div>
            <div style={{ marginTop: 10 }}>No patients in {filter === "all" ? "queue today" : filter + " status"}</div>
          </div>
        )}
      </div>

      {/* Vitals Quick-Entry Modal */}
      {vitalsVisit && (
        <div className="ov" onClick={() => setVitalsVisit(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="m-head">
              <span className="m-title">🌡️ Record Vital Signs</span>
              <button className="btn-ico" onClick={() => setVitalsVisit(null)} style={{ fontSize: 16 }}>✕</button>
            </div>
            <div className="m-body">
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, padding: "12px 14px", background: "var(--canvas)", borderRadius: 10 }}>
                <span style={{ fontSize: 32 }}>{db.pets.find(p=>p.id===vitalsVisit.petId)?.photo}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{db.pets.find(p=>p.id===vitalsVisit.petId)?.name}</div>
                  <div style={{ fontSize: 12, color: "var(--txt2)" }}>{vitalsVisit.caseNum} · {vitalsVisit.reason}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { key: "temp", label: "Temperature", unit: "°F", placeholder: "101.5", normal: "100-102.5°F", icon: "🌡️" },
                  { key: "hr", label: "Heart Rate", unit: "bpm", placeholder: "80", normal: "60-120 bpm", icon: "❤️" },
                  { key: "rr", label: "Respiratory Rate", unit: "/min", placeholder: "20", normal: "10-30/min", icon: "🌬️" },
                  { key: "weight", label: "Weight", unit: "kg", placeholder: "10.5", normal: "", icon: "⚖️" },
                ].map(({ key, label, unit, placeholder, normal, icon }) => (
                  <div key={key} style={{ background: "var(--canvas)", borderRadius: 12, padding: "14px 16px", textAlign: "center", border: `1.5px solid ${vitalsForm[key] ? "var(--teal)" : "var(--bdr)"}`, transition: "border-color .15s" }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
                    <input
                      type="number" step="0.1"
                      style={{ border: "none", background: "transparent", textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 26, fontWeight: 600, color: "var(--ink)", width: "100%", outline: "none" }}
                      value={vitalsForm[key]} placeholder={placeholder}
                      onChange={e => setVitalsForm({ ...vitalsForm, [key]: e.target.value })}
                    />
                    <div style={{ fontSize: 11, color: "var(--txt3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", marginTop: 2 }}>{unit} - {label}</div>
                    {normal && <div style={{ fontSize: 9, color: "var(--txt4)", marginTop: 2 }}>Normal: {normal}</div>}
                  </div>
                ))}
              </div>
            </div>
            <div className="m-foot">
              <button className="btn btn-ghost" onClick={() => setVitalsVisit(null)}>Cancel</button>
              <button className="btn btn-teal" onClick={saveVitals}>💾 Save Vitals</button>
            </div>
          </div>
        </div>
      )}

      {showWalkIn && <WalkInModal onClose={() => setShowWalkIn(false)} />}
    </div>
  );
}

function WalkInModal({ onClose }) {
  const { db, saveDB, toast } = useApp();
  const [search, setSearch] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);
  const [reason, setReason] = useState("");
  const [emergency, setEmergency] = useState(false);

  const matchedPets = search.length > 1 ? db.pets.filter(p => {
    const owner = db.owners.find(o => o.id === p.ownerId);
    return p.name.toLowerCase().includes(search.toLowerCase()) || owner?.mobile.includes(search) || owner?.name.toLowerCase().includes(search.toLowerCase());
  }) : [];

  const add = () => {
    if (!selectedPet || !reason) { toast("Please select a pet and enter reason", "error"); return; }
    const caseNum = genCase(db);
    db.visits.push({ id: db.visits.length + 1, petId: selectedPet.id, caseNum, date: todayStr(), status: emergency ? "waiting" : "waiting", reason, emergency, temp: "", hr: "", rr: "", weight: selectedPet.weight, diagnosis: "", notes: "", doctorId: 1 });
    saveDB();
    toast(`Walk-in registered: ${caseNum}`, "success");
    onClose();
  };

  return (
    <div className="ov" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="m-head"><span className="m-title">Register Walk-in Patient</span><button className="btn-ico" onClick={onClose} style={{ fontSize: 16 }}>✕</button></div>
        <div className="m-body">
          <div className="inp-g">
            <label className="inp-lbl">Search Pet / Owner</label>
            <input className="inp" placeholder="Pet name, owner name or mobile..." value={search} onChange={e => { setSearch(e.target.value); setSelectedPet(null); }} />
          </div>
          {matchedPets.map(p => {
            const o = db.owners.find(x => x.id === p.ownerId);
            return (
              <div key={p.id} onClick={() => setSelectedPet(p)} style={{ display: "flex", gap: 10, padding: "10px 12px", border: `2px solid ${selectedPet?.id === p.id ? "var(--gold)" : "var(--bdr)"}`, borderRadius: "var(--r)", cursor: "pointer", marginBottom: 8, background: selectedPet?.id === p.id ? "var(--gold-pale)" : "var(--white)", transition: "all .18s" }}>
                <div style={{ fontSize: 22 }}>{p.photo}</div>
                <div><div style={{ fontWeight: 700 }}>{p.name}</div><div style={{ fontSize: 12, color: "var(--txt2)" }}>{p.breed} · Owner: {o?.name} ({o?.mobile})</div></div>
              </div>
            );
          })}
          <div className="inp-g">
            <label className="inp-lbl">Chief Complaint / Reason *</label>
            <textarea className="inp" rows={2} placeholder="Describe the problem..." value={reason} onChange={e => setReason(e.target.value)} />
          </div>
          <div onClick={() => setEmergency(!emergency)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: `2px solid ${emergency ? "var(--red)" : "var(--bdr)"}`, borderRadius: "var(--r)", cursor: "pointer", background: emergency ? "var(--red-bg)" : "var(--white)", transition: "all .18s" }}>
            <span style={{ fontSize: 22 }}>🚶</span>
            <div><div style={{ fontWeight: 700, color: emergency ? "var(--red)" : "var(--txt)" }}>Emergency Case</div><div style={{ fontSize: 12, color: "var(--txt3)" }}>Will be moved to top of queue</div></div>
            <div style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", border: `2px solid ${emergency ? "var(--red)" : "var(--bdr)"}`, background: emergency ? "var(--red)" : "transparent" }} />
          </div>
        </div>
        <div className="m-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-gold" onClick={add}>✅ Register Walk-in</button>
        </div>
      </div>
    </div>
  );
}

// ...............................................................................
// APPOINTMENTS
// ...............................................................................

function AppointmentsPage() {
  const { db, saveDB, toast } = useApp();
  const [viewMode, setViewMode] = useState("day");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ petId: "", date: todayStr(), time: "09:00", type: "New Visit", notes: "" });
  const [selDate, setSelDate] = useState(todayStr());
  const [calMonth, setCalMonth] = useState(() => { const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() }; });

  // Dynamic calendar based on calMonth
  const firstDay = new Date(calMonth.year, calMonth.month, 1).getDay();
  const daysInMonth = new Date(calMonth.year, calMonth.month + 1, 0).getDate();
  const calDays = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(calMonth.year, calMonth.month, 1);
    d.setDate(d.getDate() + (i - firstDay));
    return d;
  });

  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const apts = db.appointments.filter(a => a.date === selDate).sort((a, b) => a.time.localeCompare(b.time));

  const bookApt = () => {
    if (!form.petId || !form.date || !form.time) { toast("Fill all required fields", "error"); return; }
    const pet = db.pets.find(p => p.id === parseInt(form.petId));
    db.appointments.push({ id: db.appointments.length + 1, petId: parseInt(form.petId), ownerId: pet.ownerId, date: form.date, time: form.time, type: form.type, status: "confirmed", notes: form.notes });
    saveDB();
    toast("Appointment booked!", "success");
    setShowModal(false);
    setForm({ petId: "", date: todayStr(), time: "09:00", type: "New Visit", notes: "" });
  };

  return (
    <div className="fu">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div><div className="pt">Appointments</div><div className="ps">Manage clinic schedule</div></div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ display: "flex", border: "1px solid var(--bdr)", borderRadius: 8, overflow: "hidden" }}>
            {["day", "week", "month"].map(v => (
              <button key={v} onClick={() => setViewMode(v)} style={{ padding: "7px 14px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, background: viewMode === v ? "var(--ink)" : "var(--white)", color: viewMode === v ? "#fff" : "var(--txt2)", transition: "all .18s" }}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
            ))}
          </div>
          <button className="btn btn-gold" onClick={() => setShowModal(true)}>+ Book Appointment</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        <div className="card">
          <div className="card-body">
            {/* Month navigation */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <button className="btn btn-ghost btn-sm" onClick={()=>setCalMonth(m=>{ const d=new Date(m.year,m.month-1,1); return {year:d.getFullYear(),month:d.getMonth()}; })}>← Prev</button>
              <div style={{ fontWeight:700, fontFamily:"'Cormorant Garamond',serif", fontSize:17 }}>{MONTH_NAMES[calMonth.month]} {calMonth.year}</div>
              <button className="btn btn-ghost btn-sm" onClick={()=>setCalMonth(m=>{ const d=new Date(m.year,m.month+1,1); return {year:d.getFullYear(),month:d.getMonth()}; })}>Next →</button>
            </div>
            <div className="cal-grid" style={{ marginBottom: 8 }}>
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 800, color: "var(--txt4)", padding: "4px 0" }}>{d}</div>
              ))}
            </div>
            <div className="cal-grid">
              {calDays.map((d, i) => {
                const ds = d.toISOString().split("T")[0];
                const isToday = ds === todayStr();
                const isOther = d.getMonth() !== calMonth.month;
                const hasApt = db.appointments.some(a => a.date === ds);
                return (
                  <div key={i} className={`cal-cell${isToday ? " today" : ""}${hasApt ? " hapt" : ""}${isOther ? " oth" : ""}`}
                    style={{ outline: ds === selDate && !isToday ? "2px solid var(--gold)" : "none", outlineOffset: "2px" }}
                    onClick={() => setSelDate(ds)}>
                    {d.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <span className="card-title" style={{ fontSize: 14 }}>{new Date(selDate + "T12:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
            <span className="badge b-gold">{apts.length} apt{apts.length !== 1 ? "s" : ""}</span>
          </div>
          <div style={{ padding: "6px 12px", maxHeight: 400, overflowY: "auto" }}>
            {apts.map(a => {
              const pet = db.pets.find(p => p.id === a.petId);
              const owner = db.owners.find(o => o.id === a.ownerId);
              return (
                <div key={a.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 6px", borderBottom: "1px solid var(--bdr3)", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--gold-pale)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "var(--ink-soft)", fontWeight: 600, minWidth: 40, paddingTop: 2 }}>{a.time}</div>
                  <div style={{ fontSize: 18 }}>{pet?.photo || "🐾"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{pet?.name}</div>
                    <div style={{ fontSize: 11, color: "var(--txt3)" }}>{owner?.name}</div>
                    <span style={{ display: "inline-block", marginTop: 3, background: "var(--canvas)", border: "1px solid var(--bdr)", padding: "1px 7px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>{a.type}</span>
                  </div>
                  <span className={`badge ${a.status === "confirmed" ? "b-bill" : a.status === "checked-in" ? "b-cons" : "b-wait"}`} style={{ fontSize: 10, marginTop: 3 }}>{a.status === "confirmed" ? "✅" : a.status === "checked-in" ? "↩" : "?"}</span>
                </div>
              );
            })}
            {apts.length === 0 && <div style={{ textAlign: "center", padding: "28px", color: "var(--txt3)", fontSize: 13 }}>No appointments on this date</div>}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="ov" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="m-head"><span className="m-title">Book Appointment</span><button className="btn-ico" onClick={() => setShowModal(false)} style={{ fontSize: 16 }}>✕</button></div>
            <div className="m-body">
              <div className="inp-g">
                <label className="inp-lbl">Select Pet *</label>
                <select className="inp" value={form.petId} onChange={e => setForm({ ...form, petId: e.target.value })}>
                  <option value="">Choose pet...</option>
                  {db.pets.map(p => {
                    const o = db.owners.find(x => x.id === p.ownerId);
                    return <option key={p.id} value={p.id}>{p.photo} {p.name} - {o?.name} ({o?.mobile})</option>;
                  })}
                </select>
              </div>
              <div className="inp-row cols2">
                <div className="inp-g"><label className="inp-lbl">Date *</label><input type="date" className="inp" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
                <div className="inp-g"><label className="inp-lbl">Time *</label><input type="time" className="inp" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></div>
              </div>
              <div className="inp-g">
                <label className="inp-lbl">Visit Type</label>
                <select className="inp" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  {["New Visit", "Follow-up", "Vaccination", "Deworming", "Dental Check", "Surgery", "Emergency", "Grooming"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="inp-g"><label className="inp-lbl">Notes</label><textarea className="inp" rows={2} placeholder="Any special instructions..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
            </div>
            <div className="m-foot">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={bookApt}>📅 Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ...............................................................................
// PATIENTS / PETS
// ...............................................................................

function PatientsPage({ setPage, setConsultVisit, onAddVaccine }) {
  const { db, saveDB, toast } = useApp();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ownerName: "", mobile: "", email: "", address: "", petName: "", type: "Dog", breed: "", dob: "", sex: "Male", weight: "" });

  const filtered = db.pets.filter(p => {
    const o = db.owners.find(x => x.id === p.ownerId);
    return p.name.toLowerCase().includes(search.toLowerCase()) || o?.name.toLowerCase().includes(search.toLowerCase()) || o?.mobile.includes(search);
  });

  const registerPet = () => {
    const { ownerName, mobile, petName, type, breed, dob, sex, weight } = form;
    if (!ownerName || !mobile || !petName) { toast("Fill all required fields", "error"); return; }
    let owner = db.owners.find(o => o.mobile === mobile);
    if (!owner) {
      owner = { id: db.owners.length + 1, name: ownerName, mobile, email: form.email, address: form.address };
      db.owners.push(owner);
    }
    db.pets.push({ id: db.pets.length + 1, name: petName, type, breed, dob: dob || "2023-01-01", sex, weight: parseFloat(weight) || 0, ownerId: owner.id, photo: type === "Dog" ? "🐕" : type === "Cat" ? "🐱" : type === "Bird" ? "🦜" : type === "Rabbit" ? "🐇" : type === "Cattle" ? "🐄" : type === "Horse" ? "🐎" : type === "Reptile" ? "🦎" : type === "Fish" ? "🐟" : "🐾", alerts: [], color: "#f5f0e8" });
    saveDB();
    toast(`${petName} registered successfully!`, "success");
    setShowModal(false);
    setForm({ ownerName: "", mobile: "", email: "", address: "", petName: "", type: "Dog", breed: "", dob: "", sex: "Male", weight: "" });
  };

  if (selected) return <PetProfile pet={selected} onBack={() => setSelected(null)} setPage={setPage} setConsultVisit={setConsultVisit} />;

  return (
    <div className="fu">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div><div className="pt">Owners & Pets</div><div className="ps">{db.pets.length} pets · {db.owners.length} owners registered</div></div>
        <button className="btn btn-gold" onClick={() => setShowModal(true)}>🐾 Register New Pet</button>
      </div>
      <div className="srch" style={{ maxWidth: 420, marginBottom: 20 }}>
        <span className="srch-ic">🔍</span>
        <input className="srch-inp" placeholder="Search by pet name, owner, mobile..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 15 }}>
        {filtered.map(pet => {
          const owner = db.owners.find(o => o.id === pet.ownerId);
          const visits = db.visits.filter(v => v.petId === pet.id);
          return (
            <div key={pet.id} className="pcard" onClick={() => setSelected(pet)} style={{ background: `linear-gradient(135deg,var(--white) 65%,${pet.color})` }}>
              <div className="pava" style={{ background: pet.color, width: 60, height: 60, fontSize: 28, borderRadius: 16 }}>{pet.photo}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700 }}>{pet.name}</div>
                <div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 2 }}>{pet.breed} · {pet.type}</div>
                <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}>{calcAge(pet.dob)} · {pet.sex} · {pet.weight}kg</div>
                <div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>👤 {owner?.name}</div>
                <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
                  {pet.alerts.length === 0 ? <span className="badge b-bill" style={{ fontSize: 10 }}>✅ No alerts</span> : pet.alerts.slice(0, 2).map((a, i) => <span key={i} className="badge b-emg" style={{ fontSize: 10 }}>⚠️ {a}</span>)}
                </div>
              </div>
              <div style={{ alignSelf: "flex-start", fontSize: 11, color: "var(--txt3)", whiteSpace: "nowrap", textAlign: "right" }}>
                <div>{visits.length} visits</div>
                <div style={{ marginTop: 3 }}>📞 {owner?.mobile}</div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="card" style={{ padding: 32, textAlign: "center", color: "var(--txt3)", gridColumn: "span 3" }}>
            <div style={{ fontSize: 40 }}>📦</div>
            <div style={{ marginTop: 10 }}>{search ? "No pets found matching your search" : "No pets registered yet"}</div>
          </div>
        )}
      </div>
      {showModal && (
        <div className="ov" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="m-head"><span className="m-title">Register New Pet & Owner</span><button className="btn-ico" onClick={() => setShowModal(false)} style={{ fontSize: 16 }}>✕</button></div>
            <div className="m-body">
              <div style={{ background: "var(--canvas)", borderRadius: "var(--r)", padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--txt3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>👤 Owner Details</div>
                <div className="inp-row cols2">
                  <div className="inp-g" style={{ marginBottom: 10 }}><label className="inp-lbl">Owner Name *</label><input className="inp" placeholder="Full name" value={form.ownerName} onChange={e => setForm({ ...form, ownerName: e.target.value })} /></div>
                  <div className="inp-g" style={{ marginBottom: 10 }}><label className="inp-lbl">Mobile *</label><input className="inp" placeholder="10-digit" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} /></div>
                  <div className="inp-g" style={{ marginBottom: 0 }}><label className="inp-lbl">Email</label><input className="inp" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                  <div className="inp-g" style={{ marginBottom: 0 }}><label className="inp-lbl">Address</label><input className="inp" placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
                </div>
              </div>
              <div style={{ background: "var(--canvas)", borderRadius: "var(--r)", padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--txt3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>🐾 Pet Details</div>
                <div className="inp-row cols3">
                  <div className="inp-g" style={{ marginBottom: 10 }}><label className="inp-lbl">Pet Name *</label><input className="inp" placeholder="Pet name" value={form.petName} onChange={e => setForm({ ...form, petName: e.target.value })} /></div>
                  <div className="inp-g" style={{ marginBottom: 10 }}><label className="inp-lbl">Animal Type</label><select className="inp" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{["Dog", "Cat", "Bird", "Rabbit", "Cattle", "Horse", "Reptile", "Fish", "Hamster", "Guinea Pig", "Other"].map(t => <option key={t}>{t}</option>)}</select></div>
                  <div className="inp-g" style={{ marginBottom: 10 }}><label className="inp-lbl">Breed</label><input className="inp" placeholder="Breed" value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })} /></div>
                  <div className="inp-g" style={{ marginBottom: 0 }}><label className="inp-lbl">Date of Birth</label><input type="date" className="inp" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} /></div>
                  <div className="inp-g" style={{ marginBottom: 0 }}><label className="inp-lbl">Sex</label><select className="inp" value={form.sex} onChange={e => setForm({ ...form, sex: e.target.value })}><option>Male</option><option>Female</option></select></div>
                  <div className="inp-g" style={{ marginBottom: 0 }}><label className="inp-lbl">Weight (kg)</label><input className="inp" type="number" step="0.1" placeholder="e.g. 12.5" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} /></div>
                </div>
              </div>
            </div>
            <div className="m-foot"><button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-gold" onClick={registerPet}>🐾 Register Pet</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function PetProfile({ pet, onBack, setPage, setConsultVisit }) {
  const { db, saveDB, toast } = useApp();
  const owner = db.owners.find(o => o.id === pet.ownerId);
  const visits = db.visits.filter(v => v.petId === pet.id).sort((a, b) => new Date(b.date) - new Date(a.date));
  const vaccs = db.vaccinations.filter(v => v.petId === pet.id);
  const prescriptions = visits.map(v => db.prescriptions.find(p => p.visitId === v.id)).filter(Boolean);
  const [tab, setTab] = useState("history");

  const weights = visits.filter(v => v.weight).map(v => ({ date: v.date, w: v.weight })).slice(0, 6).reverse();

  return (
    <div className="fu">
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 16 }}>← Back to Pets</button>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ background: "linear-gradient(135deg,var(--ink) 0%,var(--ink-soft) 100%)", padding: "24px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 60, marginBottom: 8 }}>{pet.photo}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: "#fff", fontWeight: 700 }}>{pet.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginTop: 3 }}>{pet.breed}</div>
              <span className="badge b-gold" style={{ marginTop: 8 }}>{pet.type}</span>
            </div>
            <div className="card-body" style={{ padding: "14px 16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[["Age", calcAge(pet.dob)], ["Sex", pet.sex], ["Weight", `${pet.weight}kg`], ["Visits", visits.length], ["Owner", owner?.name], ["Mobile", owner?.mobile]].map(([k, v]) => (
                  <div key={k} style={{ background: "var(--canvas)", borderRadius: 8, padding: "9px 11px" }}>
                    <div style={{ fontSize: 10, color: "var(--txt3)", fontWeight: 800, textTransform: "uppercase" }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {pet.alerts.length > 0 && (
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="card-head" style={{ padding: "12px 16px" }}><span className="card-title" style={{ fontSize: 14 }}>s ️ Medical Alerts</span></div>
              <div style={{ padding: "10px 14px" }}>{pet.alerts.map((a, i) => <div key={i} className="alert a-err" style={{ marginBottom: 6 }}>s ️ {a}</div>)}</div>
            </div>
          )}
          <div className="card">
            <div className="card-head" style={{ padding: "12px 16px" }}><span className="card-title" style={{ fontSize: 14 }}>Weight Trend</span></div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 70 }}>
                {weights.map((w, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <div style={{ fontSize: 9, color: "var(--txt3)", fontFamily: "'JetBrains Mono',monospace" }}>{w.w}kg</div>
                    <div style={{ width: "100%", background: i === weights.length - 1 ? "var(--gold)" : "var(--ink)", borderRadius: "3px 3px 0 0", height: `${(w.w / 40) * 50}px`, opacity: i === weights.length - 1 ? 1 : 0.4 }} />
                    <div style={{ fontSize: 9, color: "var(--txt3)" }}>{new Date(w.date).toLocaleDateString("en-IN", { month: "short" })}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <button className="btn btn-ink" onClick={() => {
            let v = db.visits.find(x => x.petId === pet.id && x.date === todayStr() && x.status !== "done");
            if (!v) {
              const caseNum = genCase(db);
              v = { id: db.visits.length + 1, petId: pet.id, caseNum, date: todayStr(), status: "consulting", reason: "New consultation", emergency: false, temp: "", hr: "", rr: "", weight: pet.weight || "", diagnosis: "", notes: "", doctorId: 1 };
              db.visits.push(v);
              localStorage.setItem(DB_KEY, JSON.stringify(db));
            } else {
              db.visits = db.visits.map(x => x.id === v.id ? { ...x, status: "consulting" } : x);
              localStorage.setItem(DB_KEY, JSON.stringify(db));
            }
            setConsultVisit(v);
            setPage("consultation");
          }}>🩺 New Consultation</button>
            <button className="btn btn-ghost" onClick={() => onAddVaccine && onAddVaccine(pet.id)}>💉 Add Vaccine</button>
          </div>
          <div className="tabs">
            {[["history", "📜 History"], ["vaccines", "💉 Vaccines"], ["prescriptions", "💊 Prescriptions"]].map(([id, label]) => (
              <div key={id} className={`tab${tab === id ? " on" : ""}`} onClick={() => setTab(id)}>{label}</div>
            ))}
          </div>
          {tab === "history" && (
            <div className="tl">
              {visits.map((v, i) => (
                <div key={v.id} className="tl-item">
                  <div className="tl-dot" style={{ background: v.status === "done" ? "var(--gold)" : "var(--teal)" }} />
                  <div className="tl-dt">{fmt(v.date)} · {v.caseNum}</div>
                  <div className="tl-box">
                    <div className="tl-t">🩺 {v.diagnosis || "Visit"}</div>
                    <div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 2 }}>{v.reason}</div>
                    {v.temp && <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 4 }}>Temp: {v.temp}°F · HR: {v.hr}bpm · RR: {v.rr}/min · Weight: {v.weight}kg</div>}
                    {v.notes && <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 3 }}>📝 {v.notes}</div>}
                  </div>
                </div>
              ))}
              {visits.length === 0 && <div style={{ textAlign: "center", padding: "30px", color: "var(--txt3)" }}>No visits recorded yet</div>}
            </div>
          )}
          {tab === "vaccines" && (
            <div>
              {vaccs.map(v => (
                <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", background: "var(--white)", borderRadius: "var(--r)", border: "1px solid var(--bdr2)", marginBottom: 10 }}>
                  <div style={{ fontSize: 28 }}>💉</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{v.vaccine}</div>
                    <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 2 }}>Given: {fmt(v.given)} · Batch: {v.batch}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "var(--txt2)" }}>Next: {fmt(v.next)}</div>
                    <span className={`badge ${v.status === "ok" ? "b-bill" : v.status === "due" ? "b-wait" : "b-emg"}`} style={{ marginTop: 4 }}>
                      {v.status === "ok" ? "✅ Current" : v.status === "due" ? "⏰ Due" : "🔴 Overdue"}
                    </span>
                  </div>
                </div>
              ))}
              {vaccs.length === 0 && <div style={{ textAlign: "center", padding: "30px", color: "var(--txt3)" }}>No vaccinations on record</div>}
            </div>
          )}
          {tab === "prescriptions" && (
            <div>
              {prescriptions.map((rx, i) => {
                const visit = db.visits.find(v => v.id === rx.visitId);
                return (
                  <div key={rx.id} className="card" style={{ marginBottom: 14 }}>
                    <div className="card-head">
                      <span className="card-title" style={{ fontSize: 14 }}>Y'S Prescription ?" {visit && fmt(visit.date)}</span>
                      <span className="case-pill">{visit?.caseNum}</span>
                    </div>
                    <div className="card-body" style={{ padding: "12px 16px" }}>
                      {rx.medicines.map((m, j) => (
                        <div key={j} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: j < rx.medicines.length - 1 ? "1px dashed var(--bdr)" : "none" }}>
                          <div style={{ background: "var(--ink)", color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 3 }}>{j + 1}</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                            <div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 2 }}>Dose: {m.dose} · Duration: {m.duration} · {m.instruction}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {prescriptions.length === 0 && <div style={{ textAlign: "center", padding: "30px", color: "var(--txt3)" }}>No prescriptions on record</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ...............................................................................
// CONSULTATION ROOM
// ...............................................................................

// "?"? Helpers for the consult form "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
// "?"? Image Upload Box (base64, no server needed) "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
function ImageUploadBox({ label, files, onAdd, onRemove }) {
  const ref = useRef();
  const handleFile = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onAdd({ name: file.name, type: file.type, size: file.size, data: ev.target.result, uploaded: new Date().toLocaleTimeString() });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontSize: 10.5, fontWeight: 800, color: "var(--txt3)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>
        Y"Z Attach {label} Files
      </div>
      <div
        onClick={() => ref.current.click()}
        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--gold)"; }}
        onDragLeave={e => { e.currentTarget.style.borderColor = "var(--bdr)"; }}
        onDrop={e => { e.preventDefault(); e.currentTarget.style.borderColor = "var(--bdr)"; const dt = e.dataTransfer; if (dt.files.length) handleFile({ target: dt, files: dt.files }); }}
        style={{ border: "2px dashed var(--bdr)", borderRadius: 9, padding: "12px 14px", cursor: "pointer", textAlign: "center", transition: "border-color .18s", background: "var(--canvas)", marginBottom: 8 }}
      >
        <div style={{ fontSize: 22, opacity: .5 }}>📎</div>
        <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 3 }}>Click or drag &amp; drop - JPG, PNG, PDF, DICOM</div>
        <input ref={ref} type="file" accept="image/*,.pdf,.dcm" multiple style={{ display: "none" }} onChange={handleFile} />
      </div>
      {files && files.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {files.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--white)", border: "1px solid var(--bdr)", borderRadius: 7, padding: "5px 9px", fontSize: 11 }}>
              <span>{f.type?.startsWith("image") ? "🖼️" : "📄"}</span>
              <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600 }}>{f.name}</span>
              <span style={{ color: "var(--txt3)" }}>({(f.size / 1024).toFixed(0)}kb)</span>
              {f.type?.startsWith("image") && (
                <img src={f.data} alt="" style={{ width: 28, height: 28, objectFit: "cover", borderRadius: 4, border: "1px solid var(--bdr)" }} />
              )}
              <button onClick={() => onRemove(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", fontSize: 14, padding: "0 2px" }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChipGroup({ label, options, value, onChange, notes, onNotes, color }) {
  const bg = color || "var(--ink)";
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 11, fontWeight: 800, color: "var(--txt2)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>{label}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
        {options.map(o => (
          <button key={o} onClick={() => onChange(value === o ? "" : o)}
            style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${value === o ? bg : "var(--bdr)"}`, background: value === o ? bg : "var(--white)", color: value === o ? "#fff" : "var(--txt2)", transition: "all .15s", fontFamily: "inherit" }}>
            {o}
          </button>
        ))}
      </div>
      <input style={{ width: "100%", padding: "7px 11px", border: "1.5px solid var(--bdr)", borderRadius: 7, fontSize: 12, fontFamily: "inherit", outline: "none", background: "var(--canvas)", color: "var(--txt)" }}
        placeholder="+ Add custom finding / notes..."
        value={notes || ""}
        onChange={e => onNotes(e.target.value)} />
    </div>
  );
}

function CheckGroup({ label, options, values, onChange, notes, onNotes }) {
  const toggle = (o) => {
    const cur = values || [];
    onChange(cur.includes(o) ? cur.filter(x => x !== o) : [...cur, o]);
  };
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 11, fontWeight: 800, color: "var(--txt2)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>{label}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
        {options.map(o => {
          const on = (values || []).includes(o);
          return (
            <button key={o} onClick={() => toggle(o)}
              style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${on ? "var(--teal)" : "var(--bdr)"}`, background: on ? "var(--teal)" : "var(--white)", color: on ? "#fff" : "var(--txt2)", transition: "all .15s", fontFamily: "inherit" }}>
              {on ? "✓ " : ""}{o}
            </button>
          );
        })}
      </div>
      <input style={{ width: "100%", padding: "7px 11px", border: "1.5px solid var(--bdr)", borderRadius: 7, fontSize: 12, fontFamily: "inherit", outline: "none", background: "var(--canvas)", color: "var(--txt)" }}
        placeholder="+ Add custom item / notes..."
        value={notes || ""}
        onChange={e => onNotes(e.target.value)} />
    </div>
  );
}

function SectionBox({ title, icon, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ border: "1.5px solid var(--bdr)", borderRadius: 12, marginBottom: 16, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", background: "var(--canvas)", cursor: "pointer", userSelect: "none", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 17 }}>{icon}</span>
          <span style={{ fontWeight: 800, fontSize: 13, color: "var(--ink)" }}>{title}</span>
        </div>
        <span style={{ fontSize: 12, color: "var(--txt3)", transition: "transform .2s", display: "inline-block", transform: open ? "rotate(90deg)" : "" }}>▶</span>
      </div>
      {open && <div style={{ padding: "14px 16px", background: "var(--white)" }}>{children}</div>}
    </div>
  );
}

function TreatmentSection({ title, icon, options, items, onAdd, onRemove, onUpdate }) {
  const [custom, setCustom] = useState("");
  const [open, setOpen] = useState(true);
  return (
    <div style={{ border: "1.5px solid var(--bdr)", borderRadius: 12, marginBottom: 14, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", background: "var(--canvas)", cursor: "pointer", userSelect: "none", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 17 }}>{icon}</span>
          <span style={{ fontWeight: 800, fontSize: 13, color: "var(--ink)" }}>{title}</span>
          {items.length > 0 && <span style={{ background: "var(--gold)", color: "var(--ink)", fontSize: 10, fontWeight: 800, padding: "1px 7px", borderRadius: 10 }}>{items.length}</span>}
        </div>
        <span style={{ fontSize: 12, color: "var(--txt3)", transition: "transform .2s", display: "inline-block", transform: open ? "rotate(90deg)" : "" }}>▶</span>
      </div>
      {open && (
        <div style={{ padding: "14px 16px", background: "var(--white)" }}>
          {/* Quick add preset options */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {options.map(o => (
              <button key={o} onClick={() => { const d = getMedDefaults(o); onAdd({ name: o, dose: d?.dose || "", duration: d?.duration || "", instruction: d?.instruction || "", notes: "" }); }}
                style={{ padding: "4px 11px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "1.5px solid var(--bdr)", background: items.some(i => i.name === o) ? "var(--ink)" : "var(--white)", color: items.some(i => i.name === o) ? "#fff" : "var(--txt2)", transition: "all .15s", fontFamily: "inherit" }}>
                {items.some(i => i.name === o) ? "✓ " : "+ "}{o}
              </button>
            ))}
          </div>
          {/* Custom add */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input style={{ flex: 1, padding: "7px 11px", border: "1.5px solid var(--bdr)", borderRadius: 7, fontSize: 12, fontFamily: "inherit", outline: "none", background: "var(--canvas)" }}
              placeholder="+ Type custom medicine name..."
              value={custom} onChange={e => setCustom(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && custom.trim()) { const d = getMedDefaults(custom.trim()); onAdd({ name: custom.trim(), dose: d?.dose || "", duration: d?.duration || "", instruction: d?.instruction || "", notes: "" }); setCustom(""); } }} />
            <button onClick={() => { if (custom.trim()) { const d = getMedDefaults(custom.trim()); onAdd({ name: custom.trim(), dose: d?.dose || "", duration: d?.duration || "", instruction: d?.instruction || "", notes: "" }); setCustom(""); } }}
              style={{ padding: "7px 14px", background: "var(--ink)", color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Add</button>
          </div>
          {/* Added items */}
          {items.map((item, idx) => (
            <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr auto", gap: 8, marginBottom: 8, alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "var(--ink)", paddingLeft: 4 }}>Y'S {item.name}</div>
              {[["dose", "Dose"], ["duration", "Duration"], ["instruction", "Instruction"]].map(([k, ph]) => (
                <input key={k} style={{ padding: "6px 9px", border: "1.5px solid var(--bdr)", borderRadius: 7, fontSize: 12, fontFamily: "inherit", outline: "none" }}
                  placeholder={ph} value={item[k]} onChange={e => onUpdate(idx, k, e.target.value)} />
              ))}
              <button onClick={() => onRemove(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", fontSize: 18, padding: "0 4px" }}>o.</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ConsultationPage({ consultVisit }) {
  const { db, saveDB, toast } = useApp();
  const [tab, setTab] = useState("diagnosis");
  const getActiveVisit = () => {
    if (consultVisit) return consultVisit;
    return db.visits.find(v => v.status === "consulting") || db.visits.find(v => v.date === todayStr()) || null;
  };
  const [selVisit, setSelVisit] = useState(getActiveVisit);

  // "?"? Diagnosis state "?"?
  const [vitals, setVitals] = useState({ temp: selVisit?.temp || "", hr: selVisit?.hr || "", rr: selVisit?.rr || "", weight: selVisit?.weight || "" });
  const [genExam, setGenExam] = useState({ mucous: "", mucousNote: "", dehydration: "", dehydrationNote: "", bodyCondition: "", bodyConditionNote: "", appetite: "", appetiteNote: "", gait: "", gaitNote: "", urination: "", urinationNote: "", stool: "", stoolNote: "" });
  const [sysExam, setSysExam] = useState({ alimentary: "", alimentaryNote: "", resp: "", respNote: "", cardio: "", cardioNote: "", urinogenital: "", urinogenitalNote: "", gynae: "", gynaeNote: "", skin: "", skinNote: "" });
  const [tests, setTests] = useState({ bloodTest: [], bloodTestNote: "", cbc: [], cbcNote: "", liver: [], liverNote: "", kidney: [], kidneyNote: "", electrolyte: [], electrolyteNote: "", thyroid: [], thyroidNote: "", viral: [], viralNote: "" });
  const [imaging, setImaging] = useState({ xray: "", xrayNote: "", sono: "", sonoNote: "", echo: "", echoNote: "", ecg: "", ecgNote: "" });
  const [imagingFiles, setImagingFiles] = useState({ xray: [], sono: [], echo: [], ecg: [] });
  const addImagingFile = (key, f) => setImagingFiles(prev => ({ ...prev, [key]: [...(prev[key]||[]), f] }));
  const removeImagingFile = (key, idx) => setImagingFiles(prev => ({ ...prev, [key]: prev[key].filter((_,i)=>i!==idx) }));
  const [dxText, setDxText] = useState(selVisit?.diagnosis || "");

  // "?"? Treatment state (by category) "?"?
  const [treatment, setTreatment] = useState({
    injections: [],
    abxInjection: [],
    abxOral: [],
    pain: [],
    sedative: [],
    antiemetic: [],
    gastric: [],
    emergency: [],
    diuretic: [],
    fluids: [],
    consumables: [],
    topical: [],
  });
  const [treatNotes, setTreatNotes] = useState("");

  // "?"? Medication (full prescription list) "?"?
  const [medicines, setMedicines] = useState([]);

  // "?"? Vaccination state "?"?
  const [vaccForm, setVaccForm] = useState({ petType: "dog", deworm: false, dewormNote: "", tick: false, tickNote: "", dog9in1: false, dog9in1Note: "", dogRabies: false, dogRabiesNote: "", dogCorona: false, dogCoronaNote: "", dogKennel: false, dogKennelNote: "", catTricat: false, catTricatNote: "", catRabies: false, catRabiesNote: "", customVacc: "", reminderDays: "21", reminderNote: "" });

  // "?"? Billing "?"?
  const [billItems, setBillItems] = useState([{ name: "Consultation Fee", qty: 1, rate: db.clinicSettings.consultFee, amt: db.clinicSettings.consultFee }]);
  const [payMethod, setPayMethod] = useState("Cash");
  const [saved, setSaved] = useState(false);
  const [advice, setAdvice] = useState("");
  const [nextVisit, setNextVisit] = useState("");

  // "?"? Sync when consultVisit prop changes (new patient started from Queue/PetProfile) "?"?
  useEffect(() => {
    if (!consultVisit) return;
    const fresh = db.visits.find(v => v.id === consultVisit.id) || consultVisit;
    setSelVisit(fresh);
    setVitals({ temp: fresh.temp||"", hr: fresh.hr||"", rr: fresh.rr||"", weight: fresh.weight||"" });
    setDxText(fresh.diagnosis||"");
    setTab("diagnosis");
    setMedicines([]);
    setTreatment({
      injections: [],
      abxInjection: [],
      abxOral: [],
      pain: [],
      sedative: [],
      antiemetic: [],
      gastric: [],
      emergency: [],
      diuretic: [],
      fluids: [],
      consumables: [],
      topical: [],
    });
    setSaved(false);
    setBillItems([{ name:"Consultation Fee", qty:1, rate:db.clinicSettings.consultFee, amt:db.clinicSettings.consultFee }]);
  }, [consultVisit?.id]);

  const pet = selVisit && db.pets.find(p => p.id === selVisit.petId);
  const owner = pet && db.owners.find(o => o.id === pet.ownerId);

  if (!pet) return (
    <div className="fu">
      <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--txt3)" }}>
        <div style={{ fontSize: 50 }}>Y</div>
        <div style={{ fontSize: 18, fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, marginTop: 12 }}>No Active Consultation</div>
        <div style={{ marginTop: 8, fontSize: 14 }}>Select a patient from the Queue to start consultation.</div>
      </div>
    </div>
  );

  // helpers for treatment sections
  const addTx = (cat, item) => setTreatment(t => ({ ...t, [cat]: [...t[cat].filter(x => x.name !== item.name), item] }));
  const removeTx = (cat, idx) => setTreatment(t => ({ ...t, [cat]: t[cat].filter((_, i) => i !== idx) }));
  const updateTx = (cat, idx, key, val) => setTreatment(t => { const arr = [...t[cat]]; arr[idx] = { ...arr[idx], [key]: val }; return { ...t, [cat]: arr }; });

  // collect all treatment medicines for Rx
  const allMedFromTreatment = () => Object.entries(treatment).flatMap(([, items]) => items);

  // Deduct medicines from inventory by name match
  const deductFromInventory = (medList) => {
    let deducted = [];
    let notFound = [];
    medList.forEach(m => {
      const match = db.inventory.find(inv => inv.name.toLowerCase().includes(m.name.toLowerCase().split(" ")[0]));
      if (match && match.stock > 0) {
        const qty = parseInt(m.duration) || 1;
        const deductQty = Math.min(qty, match.stock);
        match.stock = Math.max(0, match.stock - deductQty);
        deducted.push(`${match.name} (-${deductQty})`);
      } else {
        notFound.push(m.name);
      }
    });
    return { deducted, notFound };
  };

  const saveDiagnosis = () => {
    const allMed = medicines.length > 0 ? medicines : allMedFromTreatment();
    db.visits = db.visits.map(v => v.id === selVisit.id ? { ...v, temp: vitals.temp, hr: vitals.hr, rr: vitals.rr, weight: vitals.weight, diagnosis: dxText, notes: advice, inventoryDeducted: true } : v);
    if (allMed.length > 0) {
      const existing = db.prescriptions.find(p => p.visitId === selVisit.id);
      if (!existing) db.prescriptions.push({ id: db.prescriptions.length + 1, visitId: selVisit.id, medicines: allMed });
      else db.prescriptions = db.prescriptions.map(p => p.visitId === selVisit.id ? { ...p, medicines: allMed } : p);
      // Deduct from inventory only once
      if (!selVisit.inventoryDeducted) {
        const { deducted, notFound } = deductFromInventory(allMed);
        if (deducted.length) toast(`Y" Inventory updated: ${deducted.join(", ")}`, "success");
        if (notFound.length) toast(`s ️ Not in inventory: ${notFound.join(", ")}`, "warning");
      }
    }
    saveDB();
    toast("Consultation saved!", "success");
    setTab("prescription");
  };

  const saveVaccinations = () => {
    const vacc21 = [];
    const addV = (flag, name, note) => {
      if (!flag) return;
      const nextDate = new Date(); nextDate.setDate(nextDate.getDate() + parseInt(vaccForm.reminderDays || 21));
      db.vaccinations.push({ id: db.vaccinations.length + 1, petId: pet.id, vaccine: name + (note ? ` (${note})` : ""), given: todayStr(), next: nextDate.toISOString().split("T")[0], batch: "", status: "ok" });
      // Deduct vaccine from inventory
      const invMatch = db.inventory.find(inv => inv.name.toLowerCase().includes(name.toLowerCase().split(" ")[0]) || inv.category === "Vaccine");
      if (invMatch && invMatch.stock > 0) {
        invMatch.stock = Math.max(0, invMatch.stock - 1);
        if (invMatch.stock < invMatch.minStock) {
          db.auditLog = db.auditLog || [];
          db.auditLog.push({ type: "low_stock", item: invMatch.name, stock: invMatch.stock, date: todayStr() });
        }
      }
      vacc21.push(name);
    };
    addV(vaccForm.deworm, "Deworming", vaccForm.dewormNote);
    addV(vaccForm.tick, "Tick Treatment", vaccForm.tickNote);
    addV(vaccForm.dog9in1, "9-in-1 (DHPPiL+)", vaccForm.dog9in1Note);
    addV(vaccForm.dogRabies, "Anti-Rabies (Dog)", vaccForm.dogRabiesNote);
    addV(vaccForm.dogCorona, "Corona Vaccine", vaccForm.dogCoronaNote);
    addV(vaccForm.dogKennel, "Kennel Cough", vaccForm.dogKennelNote);
    addV(vaccForm.catTricat, "Tricat (FVRCP)", vaccForm.catTricatNote);
    addV(vaccForm.catRabies, "Anti-Rabies (Cat)", vaccForm.catRabiesNote);
    if (vaccForm.customVacc.trim()) addV(true, vaccForm.customVacc.trim(), "");
    saveDB();
    if (vacc21.length) toast(`o. ${vacc21.length} vaccination(s) saved ?" reminders set for ${vaccForm.reminderDays} days`, "success");
    else toast("No vaccines selected", "error");
  };

  const collectPayment = () => {
    const total = billItems.reduce((s, i) => s + i.amt, 0);
    // Only deduct imaging/procedures not already covered by prescription deduction
    const alreadyDeducted = selVisit.inventoryDeducted;
    if (!alreadyDeducted) {
      billItems.forEach(item => {
        if (item.name === "Consultation Fee" || item.name === "Consultation") return;
        const match = db.inventory.find(inv => inv.name.toLowerCase().includes(item.name.toLowerCase().split(" ")[0]));
        if (match && match.stock > 0) {
          match.stock = Math.max(0, match.stock - (item.qty || 1));
          if (match.stock < match.minStock) {
            db.auditLog = db.auditLog || [];
            db.auditLog.push({ type: "low_stock", item: match.name, stock: match.stock, date: todayStr() });
          }
        }
      });
    }
    db.invoices.push({ id: db.invoices.length + 1, visitId: selVisit.id, petId: pet.id, ownerId: owner.id, date: todayStr(), items: billItems, total, status: "paid", method: payMethod });
    db.visits = db.visits.map(v => v.id === selVisit.id ? { ...v, status: "done" } : v);
    saveDB();
    toast(`✅ ₹${total} collected via ${payMethod}!`, "success");
    setSaved(true);
  };

  const total = billItems.reduce((s, i) => s + i.amt, 0);
  const rxMeds = medicines.length > 0 ? medicines : allMedFromTreatment();
  const TABS = [["diagnosis", "🩺 Diagnosis"], ["treatment", "💊 Treatment"], ["medication", "📋 Medication"], ["vaccination", "💉 Vaccination"], ["prescription", "📄 Prescription"], ["billing", "💳 Billing"]];

  // "?"? Inline style helpers "?"?
  const inp = { width: "100%", padding: "9px 12px", border: "1.5px solid var(--bdr)", borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", background: "var(--white)", color: "var(--txt)" };
  const lbl = { fontSize: 10.5, fontWeight: 800, color: "var(--txt2)", textTransform: "uppercase", letterSpacing: ".05em", display: "block", marginBottom: 4 };

  return (
    <div className="fu">
      {/* Patient banner */}
      <div style={{ background: "linear-gradient(135deg,var(--ink) 0%,var(--ink-soft) 100%)", borderRadius: "var(--r-lg)", padding: "14px 20px", marginBottom: 18, display: "flex", alignItems: "center", gap: 14, color: "#fff" }}>
        <div style={{ fontSize: 44 }}>{pet.photo}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700 }}>{pet.name}</span>
            <span className="case-pill">{selVisit.caseNum}</span>
            {selVisit.emergency && <span className="badge b-emg">Ys EMERGENCY</span>}
          </div>
          <div style={{ opacity: .72, fontSize: 12, marginTop: 2 }}>{pet.breed} · {calcAge(pet.dob)} · {pet.sex} · Owner: {owner?.name} · Y"z {owner?.mobile}</div>
        </div>
        {pet.alerts.length > 0 && pet.alerts.map((a,i) => <span key={i} style={{ background: "rgba(255,60,50,.3)", border: "1px solid rgba(255,60,50,.5)", borderRadius: 7, padding: "5px 10px", fontSize: 12 }}>s ️ {a}</span>)}
        <div style={{ textAlign: "right", fontSize: 12 }}>
          <div style={{ opacity: .55 }}>{selVisit.reason}</div>
          <div style={{ fontWeight: 700, marginTop: 2 }}>{fmt(selVisit.date)}</div>
        </div>
      </div>

      <div className="tabs">{TABS.map(([id, label]) => <div key={id} className={`tab${tab === id ? " on" : ""}`} onClick={() => setTab(id)}>{label}</div>)}</div>

      {/* ..........................................................
          TAB 1 ?" DIAGNOSIS
      .......................................................... */}
      {tab === "diagnosis" && (
        <div className="fu">
          {/* Vitals row */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-head"><span className="card-title">🌡️ Vital Signs</span></div>
            <div style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
              {[["temp","Temperature","°F","100-102.5"], ["hr","Heart Rate","bpm","60-120"], ["rr","Resp Rate","/min","10-30"], ["weight","Weight","kg",""]].map(([k,lbl_,unit,norm]) => (
                <div key={k} className="vbox">
                  <input style={{ border:"none", background:"transparent", textAlign:"center", fontFamily:"'JetBrains Mono',monospace", fontSize:24, fontWeight:500, color:"var(--ink)", width:"100%", outline:"none" }}
                    value={vitals[k]} onChange={e => setVitals({...vitals,[k]:e.target.value})} placeholder="—" />
                  <div className="vunit">{unit}</div>
                  <div className="vlbl">{lbl_}</div>
                  {norm && <div style={{fontSize:9,color:"var(--txt4)",marginTop:2}}>Normal: {norm}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* General Clinical Examination */}
          <SectionBox title="General Clinical Examination" icon="🩺">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <ChipGroup label="Mucous Membrane" options={["Pink/Moist","Pale","Icteric","Cyanotic","Congested","Dry"]} value={genExam.mucous} onChange={v=>setGenExam({...genExam,mucous:v})} notes={genExam.mucousNote} onNotes={v=>setGenExam({...genExam,mucousNote:v})} />
              <ChipGroup label="Dehydration" options={["None","Mild < 5%","Moderate 5-8%","Severe > 8%"]} value={genExam.dehydration} onChange={v=>setGenExam({...genExam,dehydration:v})} notes={genExam.dehydrationNote} onNotes={v=>setGenExam({...genExam,dehydrationNote:v})} />
              <ChipGroup label="Body Condition Score" options={["1 - Emaciated","2-3 Thin","4-5 Ideal","6-7 Overweight","8-9 Obese"]} value={genExam.bodyCondition} onChange={v=>setGenExam({...genExam,bodyCondition:v})} notes={genExam.bodyConditionNote} onNotes={v=>setGenExam({...genExam,bodyConditionNote:v})} />
              <ChipGroup label="Appetite" options={["Normal","Reduced","Absent","Increased","Polyphagia"]} value={genExam.appetite} onChange={v=>setGenExam({...genExam,appetite:v})} notes={genExam.appetiteNote} onNotes={v=>setGenExam({...genExam,appetiteNote:v})} />
              <ChipGroup label="Gait / Walk" options={["Normal","Lame","Ataxic","Paretic","Stiff","Reluctant to move"]} value={genExam.gait} onChange={v=>setGenExam({...genExam,gait:v})} notes={genExam.gaitNote} onNotes={v=>setGenExam({...genExam,gaitNote:v})} />
              <ChipGroup label="Urination" options={["Normal","Frequent","Infrequent","Straining","Blood in urine","None"]} value={genExam.urination} onChange={v=>setGenExam({...genExam,urination:v})} notes={genExam.urinationNote} onNotes={v=>setGenExam({...genExam,urinationNote:v})} />
              <ChipGroup label="Stool" options={["Normal","Loose","Watery","Bloody","Black (melena)","Absent","Constipated"]} value={genExam.stool} onChange={v=>setGenExam({...genExam,stool:v})} notes={genExam.stoolNote} onNotes={v=>setGenExam({...genExam,stoolNote:v})} />
            </div>
          </SectionBox>

          {/* System Examination */}
          <SectionBox title="System Examination" icon="🧬">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                ["alimentary","Alimentary Track",["Normal","Vomiting","Diarrhoea","Bloat","Pain on palpation","Masses felt","Constipation"]],
                ["resp","Respiratory Track",["Normal","Cough","Nasal discharge","Dyspnoea","Wheezing","Crackles","Open mouth breathing"]],
                ["cardio","Cardiovascular",["Normal","Murmur","Arrhythmia","Weak pulse","Tachycardia","Bradycardia","Ascites"]],
                ["urinogenital","Urinogenital",["Normal","Dysuria","Haematuria","Discharge","Enlarged prostate","Urethral obstruction"]],
                ["gynae","Gynaecology",["Normal","Pyometra","Pregnancy","False pregnancy","Vaginitis","Metritis","Irregular heat"]],
                ["skin","Skin",["Normal","Pruritus","Alopecia","Erythema","Papules","Scales","Ulcers","Wounds","Ectoparasites"]]
              ].map(([key, label, opts]) => (
                <ChipGroup key={key} label={label} options={opts}
                  value={sysExam[key]||""} onChange={v=>setSysExam({...sysExam,[key]:v})}
                  notes={sysExam[key+"Note"]||""} onNotes={v=>setSysExam({...sysExam,[key+"Note"]:v})} color="var(--teal)" />
              ))}
            </div>
          </SectionBox>

          {/* Tests */}
          <SectionBox title="Investigations / Tests" icon="🧪">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                ["bloodTest","Blood Test",["PCV/TLC/DLC","Glucose","BUN","Creatinine","ALT","AST","Total Protein"]],
                ["cbc","CBC (Complete Blood Count)",["Normal","Anaemia","Leucocytosis","Leucopenia","Thrombocytopenia","Left shift"]],
                ["liver","Liver Function",["Normal","Elevated ALT","Elevated AST","Elevated ALP","Elevated Bilirubin","Hypoalbuminaemia"]],
                ["kidney","Kidney Function",["Normal","Elevated Creatinine","Elevated BUN","Azotaemia","Proteinuria","Isosthenuria"]],
                ["electrolyte","Serum Electrolyte",["Normal","Hyponatraemia","Hypernatraemia","Hypokalaemia","Hyperkalaemia","Hypocalcaemia"]],
                ["thyroid","Thyroid",["Normal","Hypothyroidism","Hyperthyroidism","Elevated T4","Low T4","TSH elevated"]],
                ["viral","Viral Tests",["CPV - Parvovirus","CDV - Distemper","FeLV","FIV","FIP","Ehrlichia","Leishmania"]]
              ].map(([key, label, opts]) => (
                <CheckGroup key={key} label={label} options={opts}
                  values={tests[key]||[]} onChange={v=>setTests({...tests,[key]:v})}
                  notes={tests[key+"Note"]||""} onNotes={v=>setTests({...tests,[key+"Note"]:v})} />
              ))}
            </div>
          </SectionBox>

          {/* Imaging */}
          <SectionBox title="Imaging & Diagnostics" icon="🖼️">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              {[
                ["xray","🩻 X-Ray",["Chest AP","Chest Lateral","Abdomen","Hip & Pelvis","Limbs","Spine","Skull"]],
                ["sono","📊 Sonography / Ultrasound",["Abdominal","Cardiac","Urinary bladder","Reproductive","Thyroid","Guided FNAC"]],
                ["echo","❤️ Echocardiography",["Normal","Cardiomegaly","Mitral regurgitation","Tricuspid regurgitation","Pericardial effusion","DCM","HCM"]],
                ["ecg","📈 ECG",["Normal sinus rhythm","Tachycardia","Bradycardia","Atrial fibrillation","VPC","Heart block","ST changes"]]
              ].map(([key, label, opts]) => (
                <div key={key} style={{ background: "var(--canvas)", borderRadius: 10, padding: 13, border: "1px solid var(--bdr2)" }}>
                  <ChipGroup label={label} options={opts}
                    value={imaging[key]||""} onChange={v=>setImaging({...imaging,[key]:v})}
                    notes={imaging[key+"Note"]||""} onNotes={v=>setImaging({...imaging,[key+"Note"]:v})} color="var(--blu)" />
                  <ImageUploadBox
                    label={label}
                    files={imagingFiles[key]}
                    onAdd={f => addImagingFile(key, f)}
                    onRemove={idx => removeImagingFile(key, idx)}
                  />
                </div>
              ))}
            </div>
          </SectionBox>

          {/* Final Diagnosis */}
          <div className="card" style={{ padding: "14px 18px" }}>
            <label style={lbl}>🩺 Final Diagnosis / Impression</label>
            <input style={{...inp, fontSize:15, fontWeight:600}} placeholder="Enter final diagnosis..." value={dxText} onChange={e=>setDxText(e.target.value)} />
          </div>

          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:14 }}>
            <button className="btn btn-gold" style={{ padding:"11px 28px", fontSize:14 }} onClick={() => { db.visits = db.visits.map(v=>v.id===selVisit.id?{...v,temp:vitals.temp,hr:vitals.hr,rr:vitals.rr,weight:vitals.weight,diagnosis:dxText}:v); saveDB(); toast("Diagnosis saved!","success"); setTab("treatment"); }}>Save & Next: Treatment →</button>
          </div>
        </div>
      )}

      {/* ..........................................................
          TAB 2 ?" TREATMENT
      .......................................................... */}
      {tab === "treatment" && (
        <div className="fu">
          <div className="alert a-info" style={{ marginBottom: 16 }}>💾 Select from preset options or type a custom medicine. Fill Dose, Duration and Instruction for each.</div>
          <TreatmentSection title="Injections (General / Supportive / Vitamins)" icon="💉" options={[
            "Inj. Tribivet","Inj. Vitcofol","Inj. Ascoril","Inj. Activita-H","Inj. Conciplex","Inj. Iron Dextran","Inj. Calcium Gluconate","Inj. Vitamin K"
          ]} items={treatment.injections} onAdd={i=>addTx("injections",i)} onRemove={idx=>removeTx("injections",idx)} onUpdate={(idx,k,v)=>updateTx("injections",idx,k,v)} />
          <TreatmentSection title="Antibiotic Injections" icon="💉" options={[
            "Inj. Ampicillin + Cloxacillin","Inj. Cefotaxime","Inj. Amoxicillin + Sulbactam","Inj. Amikacin","Inj. Gentamicin",
            "Inj. Cefuroxime","Inj. Enrofloxacin","Inj. Oxytetracycline","Inj. Metronidazole","Inj. Amoxicillin",
            "Inj. Amoxicillin-Clavulanate","Inj. Cefalexin","Inj. Ceftriaxone"
          ]} items={treatment.abxInjection} onAdd={i=>addTx("abxInjection",i)} onRemove={idx=>removeTx("abxInjection",idx)} onUpdate={(idx,k,v)=>updateTx("abxInjection",idx,k,v)} />
          <TreatmentSection title="Oral Antibiotics" icon="💊" options={[
            "Doxycycline","Gentamicin","Metronidazole","Clindamycin","Azithromycin","Trimethoprim-Sulfamethoxazole","Marbofloxacin"
          ]} items={treatment.abxOral} onAdd={i=>addTx("abxOral",i)} onRemove={idx=>removeTx("abxOral",idx)} onUpdate={(idx,k,v)=>updateTx("abxOral",idx,k,v)} />
          <TreatmentSection title="Painkillers / Analgesics / Anti-inflammatory" icon="💊" options={[
            "Meloxicam","Carprofen","Firocoxib","Robenacoxib","Ketoprofen","Tramadol","Butorphanol","Buprenorphine","Gabapentin","Prednisolone"
          ]} items={treatment.pain} onAdd={i=>addTx("pain",i)} onRemove={idx=>removeTx("pain",idx)} onUpdate={(idx,k,v)=>updateTx("pain",idx,k,v)} />
          <TreatmentSection title="Sedatives / Anesthetics" icon="🛌" options={[
            "Inj. Diazepam","Inj. Xylazine","Inj. Ketamine"
          ]} items={treatment.sedative} onAdd={i=>addTx("sedative",i)} onRemove={idx=>removeTx("sedative",idx)} onUpdate={(idx,k,v)=>updateTx("sedative",idx,k,v)} />
          <TreatmentSection title="Anti-emetics (Vomiting Control)" icon="🐾" options={[
            "Maropitant","Metoclopramide","Ondansetron","Dolasetron","Chlorpromazine","Dimenhydrinate","Diphenhydramine"
          ]} items={treatment.antiemetic} onAdd={i=>addTx("antiemetic",i)} onRemove={idx=>removeTx("antiemetic",idx)} onUpdate={(idx,k,v)=>updateTx("antiemetic",idx,k,v)} />
          <TreatmentSection title="Gastric / Acid Control" icon="❤️" options={[
            "Inj. Ranitidine","Inj. Pantoprazole"
          ]} items={treatment.gastric} onAdd={i=>addTx("gastric",i)} onRemove={idx=>removeTx("gastric",idx)} onUpdate={(idx,k,v)=>updateTx("gastric",idx,k,v)} />
          <TreatmentSection title="Emergency / Critical Care Drugs" icon="s" options={[
            "Inj. Atropine","Inj. Dexamethasone","Inj. Botropase","Inj. Ethamsylate","Mannitol"
          ]} items={treatment.emergency} onAdd={i=>addTx("emergency",i)} onRemove={idx=>removeTx("emergency",idx)} onUpdate={(idx,k,v)=>updateTx("emergency",idx,k,v)} />
          <TreatmentSection title="Diuretics" icon="Y'" options={[
            "Inj. Furosemide","Inj. Torsemide"
          ]} items={treatment.diuretic} onAdd={i=>addTx("diuretic",i)} onRemove={idx=>removeTx("diuretic",idx)} onUpdate={(idx,k,v)=>updateTx("diuretic",idx,k,v)} />
          <TreatmentSection title="Fluids & Nutrition" icon="Y" options={[
            "Normal Saline (NS)","Lactated Ringer?Ts Solution (RL)","DNS","D10","D25","Astymin","Vetplasma"
          ]} items={treatment.fluids} onAdd={i=>addTx("fluids",i)} onRemove={idx=>removeTx("fluids",idx)} onUpdate={(idx,k,v)=>updateTx("fluids",idx,k,v)} />
          <TreatmentSection title="Surgical / Clinical Consumables" icon="Y" options={[
            "Absorbent Cotton Wool","Gauze Swab / Rolled Gauze","Bandage Rolls","Surgical Gloves","Disposable Gloves",
            "Syringes (2ml, 5ml, 10ml, 20ml, 50ml)","IV Sets / Pediatric Sets","IV Cannula (21G, 22G, 23G)","Scalp Vein Sets","Infant Feeding Tube"
          ]} items={treatment.consumables} onAdd={i=>addTx("consumables",i)} onRemove={idx=>removeTx("consumables",idx)} onUpdate={(idx,k,v)=>updateTx("consumables",idx,k,v)} />
          <TreatmentSection title="Topical / Misc" icon="Y" options={[
            "Lignocaine 2% Jelly","Surgical Spirit","Liquid Chloroform","D-Mag Spray"
          ]} items={treatment.topical} onAdd={i=>addTx("topical",i)} onRemove={idx=>removeTx("topical",idx)} onUpdate={(idx,k,v)=>updateTx("topical",idx,k,v)} />
          <div className="card" style={{ padding:"14px 18px", marginTop:4 }}>
            <label style={lbl}>Treatment Notes / Instructions</label>
            <textarea style={{...inp, minHeight:70}} placeholder="Diet restriction, rest, wound care, follow-up instructions..." value={treatNotes} onChange={e=>setTreatNotes(e.target.value)} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:14 }}>
            <button className="btn btn-ghost" onClick={()=>setTab("diagnosis")}>? Diagnosis</button>
            <button className="btn btn-gold" onClick={()=>setTab("medication")}>Next: Medication List ?'</button>
          </div>
        </div>
      )}

      {/* ..........................................................
          TAB 3 ?" MEDICATION (manual full list)
      .......................................................... */}
      {tab === "medication" && (
        <div className="fu">
          <div className="card" style={{ marginBottom:16 }}>
            <div className="card-head">
              <span className="card-title">Y'S Medication List</span>
              <button className="btn btn-ghost btn-sm" onClick={()=>setMedicines([...medicines,{name:"",dose:"",duration:"",instruction:"",notes:""}])}>+ Add Row</button>
            </div>
            <div style={{ padding:"8px 16px" }}>
              <div className="alert a-info" style={{ marginBottom:12 }}>Medicines from Treatment tab are auto-loaded below. You can edit, remove or add more rows.</div>
              {/* Auto-populate from treatment if medicines is empty */}
              {medicines.length === 0 && allMedFromTreatment().length > 0 && (
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:12, color:"var(--txt2)", marginBottom:8 }}>Auto-filled from Treatment tab:</div>
                  {allMedFromTreatment().map((m,i) => (
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"2.5fr 1fr 1fr 2fr auto", gap:8, marginBottom:8, alignItems:"center" }}>
                      <div style={{ fontWeight:700, fontSize:13, paddingLeft:4 }}>Y'S {m.name}</div>
                      {["dose","duration","instruction"].map(k => (
                        <input key={k} style={inp} value={m[k]||""} placeholder={k.charAt(0).toUpperCase()+k.slice(1)} readOnly />
                      ))}
                      <span/>
                    </div>
                  ))}
                  <button className="btn btn-ghost btn-sm" style={{ marginTop:4 }} onClick={()=>setMedicines(allMedFromTreatment().map(m=>({...m})))}>o️ Edit These</button>
                </div>
              )}
              {medicines.map((m,i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"2.5fr 1fr 1fr 2fr auto", gap:8, marginBottom:10, alignItems:"center", padding:"10px 12px", background:"var(--canvas)", borderRadius:9, border:"1px solid var(--bdr2)" }}>
                  <div>
                    <label style={lbl}>Medicine Name *</label>
                    <input style={inp} value={m.name} onChange={e=>{const n=[...medicines];n[i].name=e.target.value;setMedicines(n);}} placeholder="e.g. Amoxicillin 250mg" />
                  </div>
                  <div>
                    <label style={lbl}>Dose</label>
                    <input style={inp} value={m.dose} onChange={e=>{const n=[...medicines];n[i].dose=e.target.value;setMedicines(n);}} placeholder="1 tab" />
                  </div>
                  <div>
                    <label style={lbl}>Duration</label>
                    <input style={inp} value={m.duration} onChange={e=>{const n=[...medicines];n[i].duration=e.target.value;setMedicines(n);}} placeholder="5 days" />
                  </div>
                  <div>
                    <label style={lbl}>Instruction</label>
                    <input style={inp} value={m.instruction} onChange={e=>{const n=[...medicines];n[i].instruction=e.target.value;setMedicines(n);}} placeholder="After food, twice daily" />
                  </div>
                  <button onClick={()=>setMedicines(medicines.filter((_,j)=>j!==i))} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--red)", fontSize:20, paddingTop:14 }}>o.</button>
                </div>
              ))}
              {medicines.length === 0 && allMedFromTreatment().length === 0 && (
                <div style={{ textAlign:"center", padding:"24px", color:"var(--txt3)" }}>
                  <div style={{fontSize:36}}>Y'S</div>
                  <div style={{marginTop:8}}>No medicines added yet. Add from Treatment tab or click "+ Add Row" above.</div>
                </div>
              )}
            </div>
          </div>
          <div className="card" style={{ padding:"14px 18px", marginBottom:14 }}>
            <label style={lbl}>Doctor's Advice & Diet Instructions</label>
            <textarea style={{...inp,minHeight:70}} placeholder="Rest, diet restrictions, wound care, special instructions..." value={advice} onChange={e=>setAdvice(e.target.value)} />
          </div>
          <div className="card" style={{ padding:"14px 18px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div><label style={lbl}>Follow-up Date</label><input type="date" style={inp} value={nextVisit} onChange={e=>setNextVisit(e.target.value)} /></div>
              <div><label style={lbl}>Follow-up Type</label><select style={inp}><option>Routine Follow-up</option><option>Suture Removal</option><option>Recheck</option><option>Emergency</option></select></div>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:14 }}>
            <button className="btn btn-ghost" onClick={()=>setTab("treatment")}>? Treatment</button>
            <button className="btn btn-gold" onClick={saveDiagnosis}>Save & View Prescription ?'</button>
          </div>
        </div>
      )}

      {/* ..........................................................
          TAB 4 ?" VACCINATION
      .......................................................... */}
      {tab === "vaccination" && (
        <div className="fu">
          <div className="alert a-info" style={{ marginBottom:16 }}>Y'? Select vaccines given today. Reminder will auto-schedule after <strong>{vaccForm.reminderDays} days</strong>. Each option has a notes box for lot/batch details.</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

            {/* Deworming & Tick */}
            <div className="card">
              <div className="card-head" style={{ background:"linear-gradient(135deg,#1d6a6a,#2d9c9c)", borderRadius:"var(--r-lg) var(--r-lg) 0 0" }}>
                <span style={{ color:"#fff", fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:700 }}>Y Preventive Treatments</span>
              </div>
              <div style={{ padding:"16px 18px" }}>
                {[["deworm","Deworming","dewormNote","Common brands: Drontal, Fenbendazole, Pyrantel"],["tick","Tick / Flea Treatment","tickNote","Bravecto, NexGard, Frontline, Ivermectin"]].map(([key,label,noteKey,hint]) => (
                  <div key={key} style={{ marginBottom:14 }}>
                    <div onClick={()=>setVaccForm({...vaccForm,[key]:!vaccForm[key]})} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"11px 13px", borderRadius:9, border:`2px solid ${vaccForm[key]?"var(--teal)":"var(--bdr)"}`, background:vaccForm[key]?"var(--teal-pale)":"var(--white)", transition:"all .18s" }}>
                      <div style={{ width:20, height:20, borderRadius:"50%", border:`2.5px solid ${vaccForm[key]?"var(--teal)":"var(--bdr)"}`, background:vaccForm[key]?"var(--teal)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{vaccForm[key] && <span style={{color:"#fff",fontSize:12,fontWeight:800}}>o"</span>}</div>
                      <div><div style={{ fontWeight:800, fontSize:14, color:vaccForm[key]?"var(--teal)":"var(--txt)" }}>{label}</div><div style={{fontSize:11,color:"var(--txt3)",marginTop:1}}>{hint}</div></div>
                    </div>
                    <input style={{ ...inp, marginTop:7, fontSize:12 }} placeholder="Batch no., brand, dose, notes..." value={vaccForm[noteKey]} onChange={e=>setVaccForm({...vaccForm,[noteKey]:e.target.value})} />
                  </div>
                ))}
              </div>
            </div>

            {/* Dog Vaccines */}
            <div className="card">
              <div className="card-head" style={{ background:"linear-gradient(135deg,#0d1f2d,#1a3347)", borderRadius:"var(--r-lg) var(--r-lg) 0 0" }}>
                <span style={{ color:"#fff", fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:700 }}>🐕 Dog Vaccines</span>
              </div>
              <div style={{ padding:"16px 18px" }}>
                {[["dog9in1","9-in-1 / DHPPiL+","dog9in1Note","Distemper, Parvo, Hepatitis, Parainfluenza, Lepto"],["dogRabies","Anti-Rabies","dogRabiesNote","Annual - Nobivac, Rabisin, Defensor"],["dogCorona","Corona Vaccine","dogCoronaNote","Canine Coronavirus vaccine"],["dogKennel","Kennel Cough / Bordetella","dogKennelNote","Intranasal or injectable, annual"]].map(([key,label,noteKey,hint]) => (
                  <div key={key} style={{ marginBottom:12 }}>
                    <div onClick={()=>setVaccForm({...vaccForm,[key]:!vaccForm[key]})} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"10px 12px", borderRadius:9, border:`2px solid ${vaccForm[key]?"var(--ink)":"var(--bdr)"}`, background:vaccForm[key]?"rgba(13,31,45,.06)":"var(--white)", transition:"all .18s" }}>
                      <div style={{ width:20, height:20, borderRadius:"50%", border:`2.5px solid ${vaccForm[key]?"var(--ink)":"var(--bdr)"}`, background:vaccForm[key]?"var(--ink)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{vaccForm[key] && <span style={{color:vaccForm[key]?"var(--gold-lt)":"transparent",fontSize:12,fontWeight:800}}>✓</span>}</div>
                      <div><div style={{ fontWeight:800, fontSize:14 }}>{label}</div><div style={{fontSize:11,color:"var(--txt3)",marginTop:1}}>{hint}</div></div>
                    </div>
                    <input style={{ ...inp, marginTop:7, fontSize:12 }} placeholder="Batch no., brand, dose, notes..." value={vaccForm[noteKey]} onChange={e=>setVaccForm({...vaccForm,[noteKey]:e.target.value})} />
                  </div>
                ))}
              </div>
            </div>

            {/* Cat Vaccines */}
            <div className="card">
              <div className="card-head" style={{ background:"linear-gradient(135deg,#7a1a5a,#aa3a8a)", borderRadius:"var(--r-lg) var(--r-lg) 0 0" }}>
                <span style={{ color:"#fff", fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:700 }}>🐱 Cat Vaccines</span>
              </div>
              <div style={{ padding:"16px 18px" }}>
                {[["catTricat","Tricat / FVRCP","catTricatNote","Feline Rhinotracheitis, Calicivirus, Panleukopenia"],["catRabies","Anti-Rabies (Cat)","catRabiesNote","Annual - Nobivac, Rabisin, Purevax"]].map(([key,label,noteKey,hint]) => (
                  <div key={key} style={{ marginBottom:12 }}>
                    <div onClick={()=>setVaccForm({...vaccForm,[key]:!vaccForm[key]})} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"10px 12px", borderRadius:9, border:`2px solid ${vaccForm[key]?"#aa3a8a":"var(--bdr)"}`, background:vaccForm[key]?"rgba(170,58,138,.06)":"var(--white)", transition:"all .18s" }}>
                      <div style={{ width:20, height:20, borderRadius:"50%", border:`2.5px solid ${vaccForm[key]?"#aa3a8a":"var(--bdr)"}`, background:vaccForm[key]?"#aa3a8a":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{vaccForm[key] && <span style={{color:"#fff",fontSize:12,fontWeight:800}}>✓</span>}</div>
                      <div><div style={{ fontWeight:800, fontSize:14 }}>{label}</div><div style={{fontSize:11,color:"var(--txt3)",marginTop:1}}>{hint}</div></div>
                    </div>
                    <input style={{ ...inp, marginTop:7, fontSize:12 }} placeholder="Batch no., brand, dose, notes..." value={vaccForm[noteKey]} onChange={e=>setVaccForm({...vaccForm,[noteKey]:e.target.value})} />
                  </div>
                ))}
              </div>
            </div>

            {/* Custom + Reminder */}
            <div className="card">
              <div className="card-head"><span className="card-title">z. Custom & Reminder Settings</span></div>
              <div style={{ padding:"16px 18px" }}>
                <div style={{ marginBottom:14 }}>
                  <label style={lbl}>Add Custom Vaccine / Treatment</label>
                  <input style={inp} placeholder="Type vaccine or treatment name..." value={vaccForm.customVacc} onChange={e=>setVaccForm({...vaccForm,customVacc:e.target.value})} />
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={lbl}>⏰ Auto Reminder After (Days)</label>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {["7","14","21","30","90","180","365"].map(d => (
                      <button key={d} onClick={()=>setVaccForm({...vaccForm,reminderDays:d})}
                        style={{ padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:700, cursor:"pointer", border:`2px solid ${vaccForm.reminderDays===d?"var(--gold)":"var(--bdr)"}`, background:vaccForm.reminderDays===d?"var(--gold)":"var(--white)", color:vaccForm.reminderDays===d?"var(--ink)":"var(--txt2)", fontFamily:"inherit", transition:"all .15s" }}>{d}d</button>
                    ))}
                  </div>
                  <div style={{ marginTop:8, padding:"9px 12px", background:"var(--gold-pale)", borderRadius:8, fontSize:12, color:"var(--gold-dim)", fontWeight:600 }}>
                    Y". Next reminder date: <strong>{(() => { const d=new Date(); d.setDate(d.getDate()+parseInt(vaccForm.reminderDays||21)); return fmt(d.toISOString().split("T")[0]); })()}</strong>
                  </div>
                </div>
                <div>
                  <label style={lbl}>Reminder Notes</label>
                  <textarea style={{...inp,minHeight:60}} placeholder="Instructions to owner, what to watch for..." value={vaccForm.reminderNote} onChange={e=>setVaccForm({...vaccForm,reminderNote:e.target.value})} />
                </div>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:14 }}>
            <button className="btn btn-ghost" onClick={()=>setTab("medication")}>? Medication</button>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn btn-teal" onClick={saveVaccinations}>Y'? Save Vaccinations & Set Reminder</button>
              <button className="btn btn-gold" onClick={()=>setTab("prescription")}>Next: Prescription ?'</button>
            </div>
          </div>
        </div>
      )}

      {/* ..........................................................
          TAB 5 ?" PRESCRIPTION
      .......................................................... */}
      {tab === "prescription" && (
        <div className="fu">
          <div style={{ maxWidth:720, margin:"0 auto" }}>
            <div className="rx-wrap">
              <div className="rx-hd">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <div style={{ fontSize:36 }}>Y</div>
                    <div>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700 }}>{db.clinicSettings.name}</div>
                      <div style={{ fontSize:12, opacity:.8 }}>{db.clinicSettings.doctor}</div>
                      <div style={{ fontSize:11, opacity:.6, marginTop:2 }}>Y" {db.clinicSettings.address} · Y"z {db.clinicSettings.phone}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <span className="case-pill">{selVisit.caseNum}</span>
                    <div style={{ fontSize:12, opacity:.7, marginTop:4 }}>{fmt(selVisit.date)}</div>
                  </div>
                </div>
              </div>
              <div className="rx-bd">
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16, background:"var(--canvas)", padding:"12px 14px", borderRadius:"var(--r)", border:"1px solid var(--bdr)" }}>
                  {[["PET",pet.name],["SPECIES",`${pet.type} (${pet.breed})`],["AGE/SEX",`${calcAge(pet.dob)}, ${pet.sex}`],["WEIGHT",`${vitals.weight||pet.weight}kg`],["OWNER",owner?.name],["DIAGNOSIS",dxText||"—"]].map(([k,v]) => (
                    <div key={k}><span style={{fontSize:10,color:"var(--txt3)",fontWeight:800}}>{k}:</span> <strong style={{fontSize:13}}>{v}</strong></div>
                  ))}
                </div>
                {/* Vitals in prescription */}
                {(vitals.temp||vitals.hr||vitals.rr) && (
                  <div style={{ display:"flex", gap:18, marginBottom:14, padding:"9px 13px", background:"var(--canvas)", borderRadius:8, fontSize:12, color:"var(--txt2)" }}>
                    {vitals.temp && <span>YO️ <strong>Temp:</strong> {vitals.temp}°F</span>}
                    {vitals.hr && <span>❤️ <strong>HR:</strong> {vitals.hr}bpm</span>}
                    {vitals.rr && <span>Y <strong>RR:</strong> {vitals.rr}/min</span>}
                  </div>
                )}
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, color:"var(--ink)", marginBottom:14 }}>"z</div>
                {rxMeds.length > 0 ? rxMeds.map((m,i) => (
                  <div key={i} style={{ borderBottom:"1px dashed var(--bdr)", paddingBottom:10, marginBottom:10, display:"flex", gap:10 }}>
                    <div style={{ fontWeight:800, color:"var(--ink)", minWidth:20 }}>{i+1}.</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15 }}>{m.name}</div>
                      <div style={{ fontSize:13, color:"var(--txt2)", marginTop:2 }}>
                        {m.dose && <span>Dose: {m.dose}</span>}{m.duration && <span> · Duration: {m.duration}</span>}{m.instruction && <span> · {m.instruction}</span>}
                      </div>
                    </div>
                  </div>
                )) : <div style={{ color:"var(--txt3)", fontStyle:"italic", marginBottom:14 }}>No medicines prescribed</div>}
                {advice && <div style={{ marginTop:12, padding:"10px 12px", background:"var(--canvas)", borderRadius:8, fontSize:13 }}><strong>Advice:</strong> {advice}</div>}
                {nextVisit && <div style={{ marginTop:8, fontSize:13 }}><strong>Follow-up:</strong> {fmt(nextVisit)}</div>}
                {treatNotes && <div style={{ marginTop:8, fontSize:13, color:"var(--txt2)" }}><strong>Notes:</strong> {treatNotes}</div>}
                {/* Imaging attachments */}
                {Object.entries(imagingFiles).some(([,files]) => files.length > 0) && (
                  <div style={{ marginTop:14, borderTop:"1px dashed var(--bdr)", paddingTop:10 }}>
                    <div style={{ fontSize:11, fontWeight:800, color:"var(--txt3)", textTransform:"uppercase", marginBottom:8 }}>Y"Z Attached Imaging Files</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                      {Object.entries(imagingFiles).flatMap(([key, files]) => files.map((f,i) => (
                        <div key={key+i} style={{ display:"flex", alignItems:"center", gap:6, background:"var(--canvas)", borderRadius:7, padding:"5px 9px", fontSize:11, border:"1px solid var(--bdr)" }}>
                          {f.type?.startsWith("image") && <img src={f.data} alt="" style={{ width:32, height:32, objectFit:"cover", borderRadius:4 }} />}
                          <div>
                            <div style={{ fontWeight:700 }}>{f.name}</div>
                            <div style={{ color:"var(--txt3)" }}>{key.toUpperCase()} · {(f.size/1024).toFixed(0)}kb</div>
                          </div>
                        </div>
                      )))}
                    </div>
                  </div>
                )}
              </div>
              <div className="rx-ft" style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontSize:12, color:"var(--txt3)" }}>Reg: {db.clinicSettings.regNum}</div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ borderTop:"1px solid var(--txt)", paddingTop:4, fontSize:12, width:160 }}>{db.clinicSettings.signature || db.clinicSettings.doctor}</div>
                  <div style={{ fontSize:10, color:"var(--txt3)" }}>Signature & Stamp</div>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"center", marginTop:16 }}>
              <button className="btn btn-ink" onClick={() => {
                const pet = db.pets.find(p => p.id === selVisit?.petId);
                const owner = db.owners.find(o => o.id === pet?.ownerId);
                const rxMeds = (db.prescriptions.find(p => p.visitId === selVisit?.id)?.medicines) || [];
                openPrescriptionPrint({ clinic: db.clinicSettings, pet, owner, visit: selVisit, medicines: rxMeds });
              }}>Y-️ Print Prescription</button>
              <button className="btn btn-ghost" onClick={()=>setTab("vaccination")}>? Vaccination</button>
              <button className="btn btn-gold" onClick={()=>setTab("billing")}>Next: Billing ?'</button>
            </div>
          </div>
        </div>
      )}

      {/* ..........................................................
          TAB 6 ?" BILLING
      .......................................................... */}
      {tab === "billing" && (
        <div className="fu" style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20 }}>
          <div className="card">
            <div className="card-head">
              <span className="card-title">Invoice Items</span>
              <button className="btn btn-ghost btn-sm" onClick={()=>setBillItems([...billItems,{name:"",qty:1,rate:0,amt:0}])}>+ Add Item</button>
            </div>
            <div className="card-body">
              {/* Auto-add from medicines */}
              {rxMeds.length > 0 && billItems.length === 1 && (
                <button className="btn btn-ghost btn-sm" style={{ marginBottom:12 }} onClick={() => setBillItems([billItems[0], ...rxMeds.map(m => ({ name: m.name, qty: 1, rate: 80, amt: 80 })), { name:"Vaccination", qty:1, rate:300, amt:300 }])}>s Auto-fill from Prescription</button>
              )}
              {/* Inventory stock check */}
              {billItems.length > 1 && (
                <div style={{ marginBottom: 14, background: "var(--canvas)", borderRadius: 9, padding: "10px 14px", border: "1px solid var(--bdr2)" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "var(--txt2)", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>Y" Inventory Stock Check</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {billItems.filter(i => i.name && i.name !== "Consultation Fee" && i.name !== "Consultation").map((item, idx) => {
                      const inv = db.inventory.find(inv => inv.name.toLowerCase().includes(item.name.toLowerCase().split(" ")[0]));
                      if (!inv) return <span key={idx} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 12, background: "#fff8e8", border: "1px solid #f0c060", color: "#7a4a00" }}>s ️ {item.name}: not in inventory</span>;
                      const ok = inv.stock >= (item.qty || 1);
                      return <span key={idx} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 12, background: ok ? "#e8f5ee" : "#fdf0ee", border: `1px solid ${ok ? "#80d090" : "#f0a090"}`, color: ok ? "#1a5c38" : "#900" }}>{ok ? "o." : "s ️"} {inv.name}: {inv.stock} {inv.unit}</span>;
                    })}
                  </div>
                </div>
              )}
              <table>
                <thead><tr><th>Item / Service</th><th style={{textAlign:"right"}}>Qty</th><th style={{textAlign:"right"}}>Rate (,)</th><th style={{textAlign:"right"}}>Amount (,)</th><th></th></tr></thead>
                <tbody>
                  {billItems.map((item,i) => (
                    <tr key={i}>
                      <td><input className="inp" value={item.name} onChange={e=>{const n=[...billItems];n[i].name=e.target.value;setBillItems(n);}} style={{padding:"6px 10px"}} /></td>
                      <td style={{textAlign:"right"}}><input className="inp" type="number" value={item.qty} style={{width:60,textAlign:"right",padding:"6px 8px"}} onChange={e=>{const n=[...billItems];n[i].qty=parseInt(e.target.value)||1;n[i].amt=n[i].qty*n[i].rate;setBillItems([...n]);}} /></td>
                      <td style={{textAlign:"right"}}><input className="inp" type="number" value={item.rate} style={{width:80,textAlign:"right",padding:"6px 8px"}} onChange={e=>{const n=[...billItems];n[i].rate=parseFloat(e.target.value)||0;n[i].amt=n[i].qty*n[i].rate;setBillItems([...n]);}} /></td>
                      <td style={{textAlign:"right",fontWeight:700}}>,{item.amt}</td>
                      <td><button style={{background:"none",border:"none",cursor:"pointer",color:"var(--red)",fontSize:16}} onClick={()=>setBillItems(billItems.filter((_,j)=>j!==i))}>o.</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="card" style={{ marginBottom:14 }}>
              <div className="card-head"><span className="card-title">Summary</span></div>
              <div className="card-body">
                {[["Subtotal",`,${total}`],["Tax (0%)",",0"],["Discount",",0"]].map(([k,v]) => (
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:13,color:"var(--txt2)"}}><span>{k}</span><span>{v}</span></div>
                ))}
                <div style={{borderTop:"2px solid var(--bdr)",marginTop:8,paddingTop:12,display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontWeight:700,fontSize:15}}>TOTAL</span>
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:28,color:"var(--ink)"}}>,{total}</span>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-head"><span className="card-title">Payment</span></div>
              <div className="card-body">
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                  {["Cash","UPI","Card","Online"].map(m => (
                    <button key={m} className={`btn btn-sm ${payMethod===m?"btn-ink":"btn-ghost"}`} onClick={()=>setPayMethod(m)} style={{justifyContent:"center"}}>
                      {m==="Cash"?"💵":m==="UPI"?"📱":m==="Card"?"💳":"🌐"} {m}
                    </button>
                  ))}
                </div>
                {saved ? (
                  <div className="alert a-ok">✅ Payment of ₹{total} collected via {payMethod}!</div>
                ) : (
                  <button className="btn btn-gold" style={{width:"100%",justifyContent:"center",padding:"12px",fontSize:15}} onClick={collectPayment}>
                    o. Collect ,{total} & Generate Invoice
                  </button>
                )}
                <button className="btn btn-ghost btn-sm" style={{width:"100%",justifyContent:"center",marginTop:8}} onClick={()=>window.print()}>Y-️ Print Invoice</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ...............................................................................
// VACCINATION
// ...............................................................................

function VaccinationPage({ prefill, clearPrefill }) {
  const { db, saveDB, toast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ petId: "", vaccine: "", given: todayStr(), batch: "", reminderDays: "21", notes: "" });

  const VACC_OPTIONS = {
    "Preventive": ["Deworming", "Tick / Flea Treatment", "Heartworm Prevention"],
    "Dog Vaccines": ["9-in-1 (DHPPiL+)", "Anti-Rabies", "Corona Vaccine", "Kennel Cough / Bordetella", "Leptospirosis"],
    "Cat Vaccines": ["Tricat (FVRCP)", "Anti-Rabies (Cat)", "FeLV", "FIV", "Chlamydia"],
  };

  const addVacc = () => {
    if (!form.petId || !form.vaccine) { toast("Select pet and vaccine", "error"); return; }
    const nextDate = new Date(form.given);
    nextDate.setDate(nextDate.getDate() + parseInt(form.reminderDays || 365));
    db.vaccinations.push({ id: db.vaccinations.length + 1, petId: parseInt(form.petId), vaccine: form.vaccine, given: form.given, next: nextDate.toISOString().split("T")[0], batch: form.batch, status: "ok", notes: form.notes });
    saveDB();
    toast(`Y'? ${form.vaccine} saved ?" reminder in ${form.reminderDays} days`, "success");
    setShowModal(false);
    setForm({ petId: "", vaccine: "", given: todayStr(), batch: "", reminderDays: "21", notes: "" });
  };

  const overdueVaccs = db.vaccinations.filter(v => v.status === "overdue");
  const dueVaccs = db.vaccinations.filter(v => v.status === "due");

  useEffect(() => {
    if (!prefill?.petId) return;
    setForm(f => ({ ...f, petId: String(prefill.petId) }));
    setShowModal(true);
    if (clearPrefill) clearPrefill();
  }, [prefill, clearPrefill]);

  return (
    <div className="fu">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
        <div><div className="pt">Vaccination Management</div><div className="ps">Track & schedule all vaccines with auto-reminders</div></div>
        <button className="btn btn-gold" onClick={() => setShowModal(true)}>Y'? Record Vaccination</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:18 }}>
        {[{l:"Due",v:dueVaccs.length,i:"⏰",c:"c4"},{l:"Overdue",v:overdueVaccs.length,i:"🔴",c:"c5"},{l:"Current",v:db.vaccinations.filter(v=>v.status==="ok").length,i:"✅",c:"c3"},{l:"Total Records",v:db.vaccinations.length,i:"📋",c:"c1"}].map((s,i)=>(
          <div key={i} className={`scard ${s.c}`}><div className="sico" style={{fontSize:22}}>{s.i}</div><div className="sval">{s.v}</div><div className="slbl">{s.l}</div></div>
        ))}
      </div>
      {overdueVaccs.map(v=>{const pet=db.pets.find(p=>p.id===v.petId);return <div key={v.id} className="alert a-err">🔴 <strong>{pet?.name}</strong> - {v.vaccine} overdue since {fmt(v.next)}</div>;})}

      {/* Vaccine protocol reference cards */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:20 }}>
        {Object.entries(VACC_OPTIONS).map(([cat, vaccines]) => (
          <div key={cat} className="card">
            <div className="card-head" style={{ padding:"11px 15px" }}><span className="card-title" style={{ fontSize:14 }}>{cat === "Dog Vaccines" ? "Y." : cat === "Cat Vaccines" ? "Y" : "Y>️"} {cat}</span></div>
            <div style={{ padding:"10px 14px" }}>
              {vaccines.map(v => (
                <div key={v} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 0", borderBottom:"1px solid var(--bdr3)", fontSize:13 }}>
                  <span style={{ fontSize:16 }}>Y'?</span>
                  <span style={{ fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-head"><span className="card-title">All Vaccination Records</span><button className="btn btn-ghost btn-sm">Y"S Export</button></div>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Pet</th><th>Owner</th><th>Vaccine</th><th>Given</th><th>Next Due</th><th>Reminder</th><th>Batch</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {db.vaccinations.map(v=>{
                const pet=db.pets.find(p=>p.id===v.petId);
                const owner=pet&&db.owners.find(o=>o.id===pet.ownerId);
                const daysLeft=Math.ceil((new Date(v.next)-new Date())/(1000*60*60*24));
                return (
                  <tr key={v.id}>
                    <td><div style={{fontWeight:700}}>{pet?.photo} {pet?.name}</div><div style={{fontSize:11,color:"var(--txt3)"}}>{pet?.breed}</div></td>
                    <td style={{fontSize:12,color:"var(--txt2)"}}>{owner?.name}<br/><span style={{fontSize:11,color:"var(--txt3)"}}>{owner?.mobile}</span></td>
                    <td style={{fontWeight:600}}>{v.vaccine}</td>
                    <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{fmt(v.given)}</td>
                    <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>{fmt(v.next)}</td>
                    <td style={{fontSize:12}}>{daysLeft > 0 ? <span style={{color:daysLeft < 30 ? "var(--org)" : "var(--grn)",fontWeight:700}}>{daysLeft}d left</span> : <span style={{color:"var(--red)",fontWeight:700}}>Overdue</span>}</td>
                    <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"var(--txt3)"}}>{v.batch||"—"}</td>
                    <td><span className={`badge ${v.status==="ok"?"b-bill":v.status==="due"?"b-wait":"b-emg"}`}>{v.status==="ok"?"✅ Current":v.status==="due"?"⏰ Due":"🔴 Overdue"}</span></td>
                    <td><div style={{display:"flex",gap:5}}>
                      <button className="btn btn-gold btn-xs" onClick={()=>toast(`Reminder sent to ${owner?.name}!`,"success")}>🔔</button>
                      <button className="btn btn-ghost btn-xs" onClick={()=>{ const msg=encodeURIComponent(`Hello ${owner?.name}, a vaccination reminder has been scheduled for ${pet?.name}. Please contact us to book an appointment.`); (function(num,txt){const wapp=`whatsapp://send?phone=91${num}&text=${txt}`;const web=`https://api.whatsapp.com/send?phone=91${num}&text=${txt}`;const a=document.createElement("a");a.href=wapp;a.click();setTimeout(()=>{if(!document.hidden)window.open(web,"_blank");},1500);})(owner?.mobile?.replace(/[^0-9]/g,"")|| "", msg); }} style={{background:"#25d366",color:"#fff",border:"none"}}>💬</button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="ov" onClick={()=>setShowModal(false)}>
          <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="m-head"><span className="m-title">Y'? Record Vaccination</span><button className="btn-ico" onClick={()=>setShowModal(false)} style={{fontSize:16}}>o.</button></div>
            <div className="m-body">
              <div className="inp-g">
                <label className="inp-lbl">Pet *</label>
                <select className="inp" value={form.petId} onChange={e=>setForm({...form,petId:e.target.value})}>
                  <option value="">Choose pet...</option>
                  {db.pets.map(p=><option key={p.id} value={p.id}>{p.photo} {p.name} ?" {db.owners.find(o=>o.id===p.ownerId)?.name}</option>)}
                </select>
              </div>
              <div className="inp-g">
                <label className="inp-lbl">Vaccine *</label>
                {/* Group select with all options */}
                <select className="inp" value={form.vaccine} onChange={e=>setForm({...form,vaccine:e.target.value})}>
                  <option value="">Select vaccine...</option>
                  {Object.entries(VACC_OPTIONS).map(([cat,vaccines])=>(
                    <optgroup key={cat} label={cat}>
                      {vaccines.map(v=><option key={v}>{v}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div className="inp-g"><label className="inp-lbl">Date Given *</label><input type="date" className="inp" value={form.given} onChange={e=>setForm({...form,given:e.target.value})} /></div>
                <div className="inp-g"><label className="inp-lbl">Batch / Lot Number</label><input className="inp" placeholder="e.g. RBV2026A" value={form.batch} onChange={e=>setForm({...form,batch:e.target.value})} /></div>
              </div>
              <div className="inp-g">
                <label className="inp-lbl">⏰ Reminder After (Days)</label>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                  {["7","14","21","28","90","180","365"].map(d=>(
                    <button key={d} onClick={()=>setForm({...form,reminderDays:d})}
                      style={{padding:"5px 13px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer",border:`2px solid ${form.reminderDays===d?"var(--gold)":"var(--bdr)"}`,background:form.reminderDays===d?"var(--gold)":"var(--white)",color:form.reminderDays===d?"var(--ink)":"var(--txt2)",fontFamily:"inherit",transition:"all .15s"}}>{d} days</button>
                  ))}
                </div>
                {form.given && <div style={{padding:"8px 11px",background:"var(--gold-pale)",borderRadius:7,fontSize:12,color:"var(--gold-dim)",fontWeight:600}}>
                  Y". Reminder date: <strong>{(() => { const d = new Date(form.given); d.setDate(d.getDate()+parseInt(form.reminderDays||21)); return fmt(d.toISOString().split("T")[0]); })()}</strong>
                </div>}
              </div>
              <div className="inp-g"><label className="inp-lbl">Notes</label><textarea className="inp" rows={2} placeholder="Dosage, brand, owner instructions..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} /></div>
            </div>
            <div className="m-foot"><button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn btn-gold" onClick={addVacc}>Y'? Save & Set Reminder</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ...............................................................................
// INVENTORY
// ...............................................................................

function InventoryPage() {
  const { db, saveDB, toast } = useApp();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Antibiotic", stock: "", unit: "tablets", minStock: "", batch: "", expiry: "", price: "", vendor: "" });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isValidDate = (d) => d && !isNaN(new Date(d).getTime());

  const filtered = db.inventory.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()));
  const lowStock = db.inventory.filter(i => i.stock < i.minStock);
  const expiredItems = db.inventory.filter(i => isValidDate(i.expiry) && new Date(i.expiry) < today);

  const addItem = () => {
    if (!form.name || !form.stock) { toast("Fill required fields", "error"); return; }
    db.inventory.push({ id: db.inventory.length + 1, ...form, stock: parseInt(form.stock), minStock: parseInt(form.minStock) || 10, price: parseFloat(form.price) || 0 });
    saveDB();
    toast("Item added to inventory!", "success");
    setShowModal(false);
  };

  const updateStock = (id, delta) => {
    db.inventory = db.inventory.map(i => i.id === id ? { ...i, stock: Math.max(0, i.stock + delta) } : i);
    saveDB();
    toast("Stock updated!", "success");
  };

  const stockPct = i => Math.min(100, Math.round((i.stock / (i.minStock * 3)) * 100));
  const stockColor = i => i.stock < i.minStock ? "var(--red)" : i.stock < i.minStock * 1.5 ? "var(--org)" : "var(--grn)";
  const expiringSoon = db.inventory.filter(i => {
    if (!isValidDate(i.expiry)) return false;
    const diff = new Date(i.expiry) - today;
    return diff > 0 && diff < 30*24*3600*1000;
  });

  return (
    <div className="fu">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div><div className="pt">Inventory Management</div><div className="ps">{lowStock.length} items below minimum · {expiredItems.length} expired · {expiringSoon.length} expiring within 30 days</div></div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => {
            const rows = ["Item,Category,Stock,Unit,Min Stock,Batch,Expiry,Price,Vendor", ...db.inventory.map(i => `${i.name},${i.category},${i.stock},${i.unit},${i.minStock},${i.batch},${i.expiry},${i.price},${i.vendor}`)].join("\n");
            const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8,"+encodeURIComponent(rows); a.download = "inventory.csv"; a.click();
            toast("CSV exported!", "success");
          }}>📤 Export CSV</button>
          <button className="btn btn-gold" onClick={() => setShowModal(true)}>+ Add Item</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 18 }}>
        {[
          { l: "Total Items", v: db.inventory.length, i: "📦", c: "c1" },
          { l: "Low Stock", v: lowStock.length, i: "⚠️", c: "c5" },
          { l: "Expiring (30d)", v: expiringSoon.length, i: "⏰", c: "c4" },
          { l: "Categories", v: [...new Set(db.inventory.map(i => i.category))].length, i: "🏷️", c: "c3" }
        ].map((s, i) => (
          <div key={i} className={`scard ${s.c}`}><div className="sico" style={{ fontSize: 22 }}>{s.i}</div><div className="sval" style={{ fontSize: 30 }}>{s.v}</div><div className="slbl">{s.l}</div></div>
        ))}
      </div>
      {lowStock.map(i => <div key={i.id} className="alert a-err" style={{ marginBottom: 6 }}>⚠️ <strong>{i.name}</strong> - Only <strong>{i.stock} {i.unit}</strong> left (min: {i.minStock}). <button className="btn btn-ghost btn-xs" style={{ marginLeft: 8 }} onClick={() => { updateStock(i.id, i.minStock * 2); }}>📦 Restock +{i.minStock * 2}</button></div>)}
      {expiredItems.map(i => <div key={`exp-${i.id}`} className="alert a-err" style={{ marginBottom: 6 }}>🚫 <strong>{i.name}</strong> expired on <strong>{fmt(i.expiry)}</strong> (Batch: {i.batch || "N/A"})</div>)}
      {expiringSoon.map(i => <div key={"exp"+i.id} className="alert a-warn" style={{ marginBottom: 6 }}>⏰ <strong>{i.name}</strong> expires on <strong>{fmt(i.expiry)}</strong> (Batch: {i.batch})</div>)}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, marginTop: 8 }}>
        <div className="srch" style={{ maxWidth: 340 }}>
          <span className="srch-ic">🔍</span>
          <input className="srch-inp" placeholder="Search medicines, vaccines..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Item Name</th><th>Category</th><th>Stock</th><th>Level</th><th>Batch</th><th>Expiry</th><th>Price/Unit</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={{ background: item.stock < item.minStock ? "rgba(192,57,43,.04)" : "" }}>
                  <td><div style={{ fontWeight: 700 }}>{item.name}</div><div style={{ fontSize: 11, color: "var(--txt3)" }}>{item.vendor}</div></td>
                  <td><span className="badge b-gold" style={{ fontSize: 10 }}>{item.category}</span></td>
                  <td><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: item.stock < item.minStock ? "var(--red)" : "var(--txt)" }}>{item.stock} {item.unit}</span></td>
                  <td style={{ width: 120 }}>
                    <div className="stk-bar"><div className="stk-fill" style={{ width: `${stockPct(item)}%`, background: stockColor(item) }} /></div>
                    <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 2 }}>Min: {item.minStock}</div>
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "var(--txt3)" }}>{item.batch}</td>
                  <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: isValidDate(item.expiry) && new Date(item.expiry) < today ? "var(--red)" : isValidDate(item.expiry) && new Date(item.expiry) - today < 30*24*3600*1000 ? "var(--org)" : "inherit" }}>{item.expiry ? fmt(item.expiry) : "N/A"}</td>
                  <td style={{ fontWeight: 700 }}>,{item.price}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-teal btn-xs" onClick={() => updateStock(item.id, 10)}>+10</button>
                      <button className="btn btn-ghost btn-xs" onClick={() => updateStock(item.id, -1)}>^'1</button>
                      <button className="btn btn-ghost btn-xs" onClick={() => { if(window.confirm(`Delete ${item.name}?`)) { db.inventory = db.inventory.filter(i => i.id !== item.id); saveDB(); toast("Item removed", ""); } }}>Y-'️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Audit log */}
      {(db.auditLog||[]).length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-head"><span className="card-title">📦 Recent Inventory Activity</span></div>
          <div style={{ padding: "10px 18px" }}>
            {[...(db.auditLog||[])].reverse().slice(0,10).map((log, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--bdr3)", fontSize: 12 }}>
                <span style={{ fontSize: 16 }}>{log.type === "low_stock" ? "⚠️" : "📝"}</span>
                <span style={{ flex: 1 }}>{log.type === "low_stock" ? `Low stock alert: ${log.item} - ${log.stock} remaining` : log.msg}</span>
                <span style={{ color: "var(--txt3)", fontFamily: "'JetBrains Mono',monospace" }}>{fmt(log.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {showModal && (
        <div className="ov" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="m-head"><span className="m-title">Add Inventory Item</span><button className="btn-ico" onClick={() => setShowModal(false)} style={{ fontSize: 16 }}>o.</button></div>
            <div className="m-body">
              <div className="inp-row cols2">
                <div className="inp-g"><label className="inp-lbl">Item Name *</label><input className="inp" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="inp-g"><label className="inp-lbl">Category</label><select className="inp" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{["Antibiotic","Vaccine","Steroid","Antiparasitic","Antihistamine","Antifungal","Antiviral","Fluid","Supplement","Other"].map(c => <option key={c}>{c}</option>)}</select></div>
                <div className="inp-g"><label className="inp-lbl">Stock Qty *</label><input type="number" className="inp" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} /></div>
                <div className="inp-g"><label className="inp-lbl">Unit</label><select className="inp" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>{["tablets","capsules","vials","doses","ml","bags","sachets","units","bottles","strips"].map(u => <option key={u}>{u}</option>)}</select></div>
                <div className="inp-g"><label className="inp-lbl">Min Stock Alert</label><input type="number" className="inp" value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} /></div>
                <div className="inp-g"><label className="inp-lbl">Price per Unit (,)</label><input type="number" className="inp" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
                <div className="inp-g"><label className="inp-lbl">Batch Number</label><input className="inp" value={form.batch} onChange={e => setForm({ ...form, batch: e.target.value })} /></div>
                <div className="inp-g"><label className="inp-lbl">Expiry Date</label><input type="date" className="inp" value={form.expiry} onChange={e => setForm({ ...form, expiry: e.target.value })} /></div>
              </div>
              <div className="inp-g"><label className="inp-lbl">Vendor / Supplier</label><input className="inp" value={form.vendor} onChange={e => setForm({ ...form, vendor: e.target.value })} /></div>
            </div>
            <div className="m-foot"><button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-gold" onClick={addItem}>Y" Add to Inventory</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ...............................................................................
// BILLING PAGE
// ...............................................................................

function BillingPage() {
  const { db, saveDB, toast } = useApp();
  const [showNew, setShowNew] = useState(false);
  const [viewInv, setViewInv] = useState(null);
  const [newInv, setNewInv] = useState({ petId: "", ownerId: "", items: [{ name: "Consultation Fee", qty: 1, rate: 500, amt: 500 }], method: "Cash", notes: "" });
  const todayRev = db.invoices.filter(i => i.date === todayStr()).reduce((s, i) => s + i.total, 0);
  const monthRev = db.invoices.reduce((s, i) => s + i.total, 0);

  const addItem = () => setNewInv({ ...newInv, items: [...newInv.items, { name: "", qty: 1, rate: 0, amt: 0 }] });
  const updateItem = (idx, k, v) => {
    const items = newInv.items.map((it, i) => {
      if (i !== idx) return it;
      const updated = { ...it, [k]: k === "name" ? v : parseFloat(v) || 0 };
      if (k === "qty" || k === "rate") updated.amt = (updated.qty || 0) * (updated.rate || 0);
      return updated;
    });
    setNewInv({ ...newInv, items });
  };
  const saveInvoice = () => {
    if (!newInv.petId) { toast("Select a pet", "error"); return; }
    const total = newInv.items.reduce((s, i) => s + i.amt, 0);
    const pet = db.pets.find(p => p.id === parseInt(newInv.petId));
    db.invoices.push({ id: db.invoices.length + 1, petId: parseInt(newInv.petId), ownerId: pet?.ownerId, date: todayStr(), items: newInv.items, total, status: "paid", method: newInv.method, notes: newInv.notes });
    saveDB(); toast("Invoice created!", "success"); setShowNew(false);
  };

  const printInvoice = (inv) => {
    const pet = db.pets.find(p => p.id === inv.petId);
    const owner = db.owners.find(o => o.id === inv.ownerId);
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Invoice</title><style>
      body{font-family:Arial,sans-serif;padding:30px;color:#000;max-width:720px;margin:0 auto}
      .head{text-align:center;border-bottom:3px solid #0d1f2d;padding-bottom:14px;margin-bottom:18px}
      table{width:100%;border-collapse:collapse;margin:14px 0}
      th{background:#0d1f2d;color:#fff;padding:9px 12px;text-align:left}
      td{padding:9px 12px;border-bottom:1px solid #eee}
      .total{font-size:20px;font-weight:bold;text-align:right;padding:10px 0}
      @media print{button{display:none}}
    </style></head><body>
    <div class="head"><div style="font-size:28px">Y</div><h2 style="margin:4px 0">${db.clinicSettings.name}</h2>
    <div style="font-size:12px">${db.clinicSettings.address}</div>
    <div style="font-size:12px">${db.clinicSettings.phone} · ${db.clinicSettings.email}</div></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:14px">
      <div><strong>Invoice:</strong> INV-${String(inv.id).padStart(3,"0")}<br><strong>Date:</strong> ${new Date(inv.date).toLocaleDateString("en-IN")}<br><strong>Payment:</strong> ${inv.method}</div>
      <div style="text-align:right"><strong>Pet:</strong> ${pet?.name || "N/A"}<br><strong>Owner:</strong> ${owner?.name || "N/A"}<br><strong>Mobile:</strong> ${owner?.mobile || "N/A"}</div>
    </div>
    <table><thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>
    ${inv.items.map((it, i) => `<tr><td>${i+1}</td><td>${it.name}</td><td>${it.qty}</td><td>${it.rate}</td><td>${it.amt}</td></tr>`).join("")}
    </tbody></table>
    <div class="total">Total: ₹${inv.total.toLocaleString()}</div>
    <div style="text-align:center;margin-top:20px;font-size:11px;color:#888">Thank you for choosing ${db.clinicSettings.name}!</div>
    <br><button onclick="window.print()" style="padding:10px 20px;background:#0d1f2d;color:#fff;border:none;border-radius:6px;cursor:pointer">Print</button>
    </body></html>`);
    w.document.close();
  };

  return (
    <div className="fu">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div><div className="pt">Billing & Invoices</div><div className="ps">Today's revenue: <strong style={{ color: "var(--ink)" }}>,{todayRev.toLocaleString()}</strong></div></div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => {
            const rows = ["Inv#,Case#,Pet,Owner,Date,Total,Method,Status", ...db.invoices.map(inv => { const pet = db.pets.find(p=>p.id===inv.petId); const owner = db.owners.find(o=>o.id===inv.ownerId); const visit = db.visits.find(v=>v.id===inv.visitId); return `INV-${String(inv.id).padStart(3,"0")},${visit?.caseNum||""},${pet?.name||""},${owner?.name||""},${inv.date},${inv.total},${inv.method},${inv.status}`; })].join("\n");
            const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8,"+encodeURIComponent(rows); a.download = "invoices.csv"; a.click();
            toast("CSV exported!", "success");
          }}>Export CSV</button>
          <button className="btn btn-gold" onClick={() => setShowNew(true)}>+ New Invoice</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[{ l: "Today's Revenue", v: `,${todayRev.toLocaleString()}`, i: "💰", c: "c2" }, { l: "Total Invoices", v: db.invoices.length, i: "🧾", c: "c1" }, { l: "Monthly Revenue", v: `,${monthRev.toLocaleString()}`, i: "📈", c: "c3" }, { l: "Pending", v: db.invoices.filter(i => i.status === "pending").length, i: "⏳", c: "c4" }].map((s, i) => (
          <div key={i} className={`scard ${s.c}`}><div className="sico" style={{ fontSize: 22 }}>{s.i}</div><div className="sval" style={{ fontSize: 26 }}>{s.v}</div><div className="slbl">{s.l}</div></div>
        ))}
      </div>
      <div className="card">
        <div className="card-head"><span className="card-title">Invoice History</span></div>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Invoice #</th><th>Pet / Owner</th><th>Date</th><th>Items</th><th>Total</th><th>Method</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {[...db.invoices].sort((a,b) => new Date(b.date)-new Date(a.date)).map(inv => {
                const pet = db.pets.find(p => p.id === inv.petId);
                const owner = db.owners.find(o => o.id === inv.ownerId);
                return (
                  <tr key={inv.id}>
                    <td><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>INV-{String(inv.id).padStart(3, "0")}</span></td>
                    <td><div style={{ fontWeight: 700 }}>{pet?.photo} {pet?.name}</div><div style={{ fontSize: 11, color: "var(--txt3)" }}>{owner?.name} · {owner?.mobile}</div></td>
                    <td style={{ fontSize: 12 }}>{fmt(inv.date)}</td>
                    <td style={{ fontSize: 12, color: "var(--txt2)" }}>{inv.items.length} items · {inv.items.map(i=>i.name).slice(0,2).join(", ")}{inv.items.length>2?"...":""}</td>
                    <td><span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 18 }}>,{inv.total.toLocaleString()}</span></td>
                    <td><span className="badge b-gold">{inv.method || "N/A"}</span></td>
                    <td><span className={`badge ${inv.status === "paid" ? "b-bill" : "b-wait"}`}>{inv.status === "paid" ? "✓ Paid" : "⏳ Pending"}</span></td>
                    <td><div style={{ display: "flex", gap: 5 }}>
                      <button className="btn btn-ghost btn-xs" onClick={() => setViewInv(inv)}>View</button>
                      <button className="btn btn-ghost btn-xs" onClick={() => printInvoice(inv)}>Print</button>
                    </div></td>
                  </tr>
                );
              })}
              {db.invoices.length === 0 && <tr><td colSpan={8} style={{ textAlign: "center", padding: 24, color: "var(--txt3)" }}>No invoices yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Invoice Modal */}
      {showNew && (
        <div className="ov" onClick={() => setShowNew(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="m-head"><span className="m-title">Y New Invoice</span><button className="btn-ico" onClick={() => setShowNew(false)} style={{ fontSize: 16 }}>o.</button></div>
            <div className="m-body">
              <div className="inp-row cols2" style={{ marginBottom: 14 }}>
                <div className="inp-g"><label className="inp-lbl">Pet *</label>
                  <select className="inp" value={newInv.petId} onChange={e => { const pet = db.pets.find(p=>p.id===parseInt(e.target.value)); setNewInv({...newInv, petId: e.target.value, ownerId: pet?.ownerId}); }}>
                    <option value="">Select pet...</option>
                    {db.pets.map(p => { const o = db.owners.find(o=>o.id===p.ownerId); return <option key={p.id} value={p.id}>{p.photo} {p.name} ?" {o?.name}</option>; })}
                  </select>
                </div>
                <div className="inp-g"><label className="inp-lbl">Payment Method</label>
                  <select className="inp" value={newInv.method} onChange={e => setNewInv({...newInv, method: e.target.value})}>
                    {["Cash","UPI","Card","Online","Insurance"].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <label className="inp-lbl" style={{ margin: 0 }}>Line Items</label>
                  <button className="btn btn-ghost btn-xs" onClick={addItem}>+ Add Row</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr auto", gap: 8, marginBottom: 6 }}>
                  {["Description", "Qty", "Rate (,)", "Amount", ""].map((h, i) => <div key={i} style={{ fontSize: 10, fontWeight: 800, color: "var(--txt3)", textTransform: "uppercase", padding: "0 4px" }}>{h}</div>)}
                </div>
                {newInv.items.map((it, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr auto", gap: 8, marginBottom: 7 }}>
                    <input className="inp" value={it.name} onChange={e => updateItem(idx, "name", e.target.value)} placeholder="Item description" />
                    <input type="number" className="inp" value={it.qty} onChange={e => updateItem(idx, "qty", e.target.value)} min="1" />
                    <input type="number" className="inp" value={it.rate} onChange={e => updateItem(idx, "rate", e.target.value)} />
                    <input className="inp" value={`,${it.amt}`} readOnly style={{ background: "var(--canvas)", fontWeight: 700 }} />
                    <button onClick={() => setNewInv({...newInv, items: newInv.items.filter((_,i)=>i!==idx)})} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", fontSize: 18 }}>o.</button>
                  </div>
                ))}
                <div style={{ textAlign: "right", fontSize: 18, fontWeight: 700, fontFamily: "'Cormorant Garamond',serif", padding: "10px 14px", background: "var(--canvas)", borderRadius: 8, marginTop: 8 }}>
                  Total: ,{newInv.items.reduce((s,i)=>s+i.amt,0).toLocaleString()}
                </div>
              </div>
              <div className="inp-g"><label className="inp-lbl">Notes</label><input className="inp" value={newInv.notes} onChange={e => setNewInv({...newInv, notes: e.target.value})} placeholder="Optional notes..." /></div>
            </div>
            <div className="m-foot"><button className="btn btn-ghost" onClick={() => setShowNew(false)}>Cancel</button><button className="btn btn-gold" onClick={saveInvoice}>Y' Save Invoice</button></div>
          </div>
        </div>
      )}

      {/* View Invoice Modal */}
      {viewInv && (
        <div className="ov" onClick={() => setViewInv(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="m-head"><span className="m-title">Invoice INV-{String(viewInv.id).padStart(3,"0")}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => printInvoice(viewInv)}>Y-️ Print</button>
                <button className="btn-ico" onClick={() => setViewInv(null)} style={{ fontSize: 16 }}>o.</button>
              </div>
            </div>
            <div className="m-body">
              {(() => { const pet = db.pets.find(p=>p.id===viewInv.petId); const owner = db.owners.find(o=>o.id===viewInv.ownerId);
                return (<>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18, padding: "12px 16px", background: "var(--canvas)", borderRadius: 10 }}>
                    <div><div style={{ fontWeight: 700, fontSize: 15 }}>{pet?.photo} {pet?.name}</div><div style={{ fontSize: 12, color: "var(--txt2)" }}>{owner?.name} · {owner?.mobile}</div></div>
                    <div style={{ textAlign: "right" }}><div style={{ fontSize: 12, color: "var(--txt3)" }}>{fmt(viewInv.date)}</div><span className="badge b-gold">{viewInv.method}</span></div>
                  </div>
                  <table style={{ marginBottom: 12 }}><thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
                    <tbody>{viewInv.items.map((it, i) => (
                      <tr key={i}><td>{i+1}</td><td style={{ fontWeight: 600 }}>{it.name}</td><td>{it.qty}</td><td>,{it.rate}</td><td style={{ fontWeight: 700 }}>,{it.amt.toLocaleString()}</td></tr>
                    ))}</tbody>
                  </table>
                  <div style={{ textAlign: "right", fontSize: 22, fontWeight: 700, fontFamily: "'Cormorant Garamond',serif", padding: "10px", background: "var(--gold-pale)", borderRadius: 8 }}>Total: ,{viewInv.total.toLocaleString()}</div>
                  <div style={{ marginTop: 12, fontSize: 12, color: "var(--txt3)", textAlign: "center" }}>Thank you for choosing {db.clinicSettings.name}! Y</div>
                </>);
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ...............................................................................
// ANALYTICS
// ...............................................................................

function AnalyticsPage() {
  const { db } = useApp();
  const currency = db.clinicSettings?.currency || "₹";
  const totalRevenue = db.invoices.reduce((s, i) => s + i.total, 0);
  const totalVisits = db.visits.length;
  const totalPatients = db.pets.length;
  const totalInvoices = db.invoices.length;

  return (
    <div className="fu">
      <div className="pt" style={{ marginBottom: 6 }}>Analytics & Reports 📊</div>
      <div className="ps" style={{ marginBottom: 18 }}>Overview snapshot</div>
      <div className="stats-grid">
        <div className="scard c1"><div className="sval">{totalVisits}</div><div className="slbl">Total Visits</div></div>
        <div className="scard c2"><div className="sval">{currency}{totalRevenue.toLocaleString()}</div><div className="slbl">Total Revenue</div></div>
        <div className="scard c3"><div className="sval">{totalPatients}</div><div className="slbl">Active Patients</div></div>
        <div className="scard c4"><div className="sval">{totalInvoices}</div><div className="slbl">Invoices</div></div>
      </div>
      <div className="card">
        <div className="card-head"><span className="card-title">Detailed analytics</span></div>
        <div className="card-body">
          <div style={{ fontSize: 13, color: "var(--txt2)" }}>
            Analytics charts are temporarily simplified to keep the build stable. If you want the full charts,
            I will rebuild them safely without breaking emojis.
          </div>
        </div>
      </div>
    </div>
  );
}
function PlannerPage() {
  const { db, saveDB, toast } = useApp();
  const todayApts = db.appointments.filter(a => a.date === todayStr()).sort((a, b) => a.time.localeCompare(b.time));
  const todayVisits = db.visits.filter(v => v.date === todayStr());
  const [showTask, setShowTask] = useState(false);
  const [task, setTask] = useState({ time: "", title: "", notes: "" });
  const [tasks, setTasks] = useState(() => { try { return JSON.parse(localStorage.getItem("rpc_tasks") || "[]"); } catch { return []; } });

  const saveTask = () => {
    if (!task.title) { toast("Enter task title", "error"); return; }
    const newTasks = [...tasks, { id: Date.now(), ...task, date: todayStr(), done: false }];
    setTasks(newTasks);
    localStorage.setItem("rpc_tasks", JSON.stringify(newTasks));
    toast("Task added!", "success"); setShowTask(false);
    setTask({ time: "", title: "", notes: "" });
  };
  const toggleTask = (id) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setTasks(newTasks); localStorage.setItem("rpc_tasks", JSON.stringify(newTasks));
  };
  const todayTasks = tasks.filter(t => t.date === todayStr());

  return (
    <div className="fu">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div><div className="pt">Daily Planner</div><div className="ps">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div></div>
        <button className="btn btn-gold" onClick={() => setShowTask(true)}>+ Add Task</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 22 }}>
        {[{ l: "Done", v: todayVisits.filter(v => v.status === "done").length, i: "✅", c: "c3" }, { l: "In Progress", v: todayVisits.filter(v => v.status === "consulting").length, i: "🚧", c: "c1" }, { l: "Remaining", v: todayApts.filter(a => a.status !== "checked-in").length, i: "⏳", c: "c4" }].map((s, i) => (
          <div key={i} className={`scard ${s.c}`} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.i}</div>
            <div className="sval" style={{ fontSize: 30 }}>{s.v}</div>
            <div className="slbl">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-head"><span className="card-title">Today's Schedule</span></div>
        <div className="card-body">
          {todayApts.map((a, i) => {
            const pet = db.pets.find(p => p.id === a.petId);
            const visit = db.visits.find(v => v.petId === a.petId && v.date === todayStr());
            const status = visit?.status || "upcoming";
            return (
              <div key={a.id} style={{
                display: "flex", alignItems: "center", gap: 15, padding: "13px 16px", borderRadius: "var(--r)",
                background: status === "done" ? "var(--canvas)" : status === "consulting" ? "rgba(201,151,58,.06)" : "var(--white)",
                border: `1px solid ${status === "consulting" ? "var(--gold)" : "var(--bdr2)"}`,
                marginBottom: 10, opacity: status === "done" ? 0.65 : 1
              }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "var(--ink-soft)", fontWeight: 700, minWidth: 44 }}>{a.time}</div>
                <div style={{ fontSize: 26 }}>{pet?.photo || "Y"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, textDecoration: status === "done" ? "line-through" : "none" }}>{pet?.name}</div>
                  <div style={{ fontSize: 12, color: "var(--txt2)" }}>{a.type} {a.notes ? `· ${a.notes}` : ""}</div>
                </div>
                {STATUS_MAP[status] || <span className="badge b-wait">⏳ Upcoming</span>}
              </div>
            );
          })}
          {todayApts.length === 0 && <div style={{ textAlign: "center", padding: "30px", color: "var(--txt3)" }}>No appointments scheduled for today</div>}
        </div>
      </div>
      {/* Additional Tasks */}
      {todayTasks.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-head"><span className="card-title">Y"O Today's Tasks</span></div>
          <div className="card-body">
            {todayTasks.map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--bdr3)" }}>
                <div onClick={() => toggleTask(t.id)} style={{ width: 22, height: 22, borderRadius: "50%", border: `2.5px solid ${t.done ? "var(--grn)" : "var(--bdr)"}`, background: t.done ? "var(--grn)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  {t.done && <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>o"</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, textDecoration: t.done ? "line-through" : "none", color: t.done ? "var(--txt3)" : "var(--txt)" }}>{t.title}</div>
                  {t.notes && <div style={{ fontSize: 12, color: "var(--txt3)" }}>{t.notes}</div>}
                </div>
                {t.time && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "var(--ink-soft)", fontWeight: 700 }}>{t.time}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {showTask && (
        <div className="ov" onClick={() => setShowTask(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="m-head"><span className="m-title">Y"O Add Task</span><button className="btn-ico" onClick={() => setShowTask(false)} style={{ fontSize: 16 }}>o.</button></div>
            <div className="m-body">
              <div className="inp-row cols2" style={{ marginBottom: 12 }}>
                <div className="inp-g"><label className="inp-lbl">Task *</label><input className="inp" value={task.title} onChange={e => setTask({...task, title: e.target.value})} placeholder="e.g. Call lab for results" /></div>
                <div className="inp-g"><label className="inp-lbl">Time</label><input type="time" className="inp" value={task.time} onChange={e => setTask({...task, time: e.target.value})} /></div>
              </div>
              <div className="inp-g"><label className="inp-lbl">Notes</label><textarea className="inp" rows={2} value={task.notes} onChange={e => setTask({...task, notes: e.target.value})} placeholder="Optional details..." /></div>
            </div>
            <div className="m-foot"><button className="btn btn-ghost" onClick={() => setShowTask(false)}>Cancel</button><button className="btn btn-gold" onClick={saveTask}>+ Add Task</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ...............................................................................
// TIMELINE
// ...............................................................................

function TimelinePage() {
  const { db } = useApp();
  const [selected, setSelected] = useState(db.pets[0]);

  const events = [...db.visits.filter(v => v.petId === selected.id).map(v => ({ type: "visit", date: v.date, data: v })),
    ...db.vaccinations.filter(v => v.petId === selected.id).map(v => ({ type: "vaccine", date: v.given, data: v })),
    ...db.invoices.filter(i => i.petId === selected.id).map(i => ({ type: "invoice", date: i.date, data: i }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="fu">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div><div className="pt">Patient Timeline</div><div className="ps">Complete medical history</div></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: 20 }}>
        <div className="card" style={{ alignSelf: "start" }}>
          <div className="card-head" style={{ padding: "12px 14px" }}><span className="card-title" style={{ fontSize: 14 }}>Select Patient</span></div>
          <div style={{ padding: 8 }}>
            {db.pets.map(p => (
              <div key={p.id} onClick={() => setSelected(p)} style={{ display: "flex", gap: 10, alignItems: "center", padding: "9px 10px", borderRadius: 8, cursor: "pointer", background: selected.id === p.id ? "var(--gold-pale)" : "transparent", border: `1px solid ${selected.id === p.id ? "var(--gold)" : "transparent"}`, marginBottom: 4, transition: "all .18s" }}>
                <div style={{ fontSize: 22 }}>{p.photo}</div>
                <div><div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div><div style={{ fontSize: 11, color: "var(--txt3)" }}>{p.breed}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ fontSize: 32 }}>{selected.photo}</div>
              <div><div className="card-title">{selected.name}'s Timeline</div><div style={{ fontSize: 12, color: "var(--txt3)" }}>{selected.breed}</div></div>
            </div>
          </div>
          <div className="card-body">
            <div className="tl">
              {events.map((e, i) => (
                <div key={i} className="tl-item">
                  <div className="tl-dot" style={{ background: e.type === "vaccine" ? "var(--teal)" : e.type === "invoice" ? "var(--gold)" : "var(--ink)" }} />
                  <div className="tl-dt">{fmt(e.date)}</div>
                  <div className="tl-box">
                    {e.type === "visit" && (<><div className="tl-t">Y {e.data.diagnosis || "Visit"}</div><div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 2 }}>{e.data.reason}</div>{e.data.temp && <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 3 }}>T:{e.data.temp}°F · HR:{e.data.hr}bpm · {e.data.weight}kg</div>}<span className="case-pill" style={{ fontSize: 10, display: "inline-block", marginTop: 6 }}>{e.data.caseNum}</span></>)}
                    {e.type === "vaccine" && (<><div className="tl-t">Y'? {e.data.vaccine}</div><div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 2 }}>Batch: {e.data.batch} · Next: {fmt(e.data.next)}</div></>)}
                    {e.type === "invoice" && (<><div className="tl-t">Y' Invoice ?" ,{e.data.total.toLocaleString()}</div><div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 2 }}>Paid via {e.data.method} · {e.data.items.length} items</div></>)}
                  </div>
                </div>
              ))}
              {events.length === 0 && <div style={{ textAlign: "center", padding: 30, color: "var(--txt3)" }}>No history recorded yet</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ...............................................................................
// REMINDERS
// ...............................................................................

function RemindersPage() {
  const { db, toast } = useApp();
  const settings = db.clinicSettings || {};
  const vaccLeadDays = settings.reminderVaccDays ?? 7;
  const followLeadDays = settings.reminderFollowupDays ?? 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tpl = (str, data) => (str || "").replace(/\{(\w+)\}/g, (_, k) => data[k] ?? "");
  const overdueVaccs = db.vaccinations.filter(v => {
    const daysLeft = Math.ceil((new Date(v.next) - today) / (1000 * 60 * 60 * 24));
    return daysLeft <= vaccLeadDays;
  });
  const followUps = db.appointments.filter(a => {
    if (a.type !== "Follow-up") return false;
    const daysLeft = Math.ceil((new Date(a.date) - today) / (1000 * 60 * 60 * 24));
    return daysLeft >= 0 && daysLeft <= followLeadDays;
  });

  return (
    <div className="fu">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div><div className="pt">Automated Reminders</div><div className="ps">{overdueVaccs.length + followUps.length} reminders to send</div></div>
        <button className="btn btn-gold" onClick={() => toast(`Sending all reminders via ${settings.reminderChannel || "Both"}...`, "success")}>Y" Send All Reminders</button>
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head"><span className="card-title">Vaccination Reminders</span></div>
        <div className="card-body">
          {overdueVaccs.map(v => {
            const pet = db.pets.find(p => p.id === v.petId);
            const owner = db.owners.find(o => o.id === pet?.ownerId);
            const daysLeft = Math.ceil((new Date(v.next) - today) / (1000 * 60 * 60 * 24));
            const isOverdue = daysLeft < 0;
            return (
              <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", border: "1px solid var(--bdr2)", borderRadius: "var(--r)", marginBottom: 10, background: isOverdue ? "var(--red-bg)" : "var(--org-bg)" }}>
                <div style={{ fontSize: 24 }}>{pet?.photo}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{pet?.name} ?" {v.vaccine}</div>
                  <div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 2 }}>{owner?.name} · Y"z {owner?.mobile} · Y" {owner?.email}</div>
                  <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 2 }}>Due: {fmt(v.next)}</div>
                </div>
                <span className={`badge ${isOverdue ? "b-emg" : "b-wait"}`}>{isOverdue ? "Overdue" : `⏰ Due in ${daysLeft}d`}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-sm btn-ghost" onClick={() => {
                    const msg = encodeURIComponent(tpl(settings.reminderVaccTemplate, {
                      owner_name: owner?.name || "",
                      pet_name: pet?.name || "",
                      vaccine_name: v.vaccine || "",
                      due_date: fmt(v.next),
                      clinic_name: db.clinicSettings?.name || "Royal Pet Clinic",
                      clinic_phone: db.clinicSettings?.phone || ""
                    }));
                    (function(num,txt){const wapp=`whatsapp://send?phone=91${num}&text=${txt}`;const web=`https://api.whatsapp.com/send?phone=91${num}&text=${txt}`;const a=document.createElement("a");a.href=wapp;a.click();setTimeout(()=>{if(!document.hidden)window.open(web,"_blank");},1500);})(owner?.mobile?.replace(/[^0-9]/g,"")|| "", msg);
                  }} style={{ background: "#25d366", color: "#fff", border: "none" }}>Y' WhatsApp</button>
                  <button className="btn btn-sm btn-ghost" onClick={() => toast(`Email sent to ${owner?.email}`, "success")}>Y" Email</button>
                </div>
              </div>
            );
          })}
          {overdueVaccs.length === 0 && <div style={{ textAlign: "center", padding: 20, color: "var(--txt3)" }}>o. No vaccination reminders needed</div>}
        </div>
      </div>
      <div className="card">
        <div className="card-head"><span className="card-title">Upcoming Follow-up Reminders</span></div>
        <div className="card-body">
          {followUps.map(a => {
            const pet = db.pets.find(p => p.id === a.petId);
            const owner = db.owners.find(o => o.id === a.ownerId);
            return (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", border: "1px solid var(--bdr2)", borderRadius: "var(--r)", marginBottom: 10 }}>
                <div style={{ fontSize: 24 }}>{pet?.photo}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{pet?.name} ?" {a.type}</div>
                  <div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 2 }}>{owner?.name} · Y"z {owner?.mobile}</div>
                  <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 2 }}>Appointment: {fmt(a.date)} at {a.time}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-sm btn-ghost" onClick={() => {
                    const msg = encodeURIComponent(tpl(settings.reminderFollowupTemplate, {
                      owner_name: owner?.name || "",
                      pet_name: pet?.name || "",
                      apt_date: fmt(a.date),
                      apt_time: a.time || settings.reminderTime || "",
                      clinic_name: db.clinicSettings?.name || "Royal Pet Clinic",
                      clinic_phone: db.clinicSettings?.phone || ""
                    }));
                    (function(num,txt){const wapp=`whatsapp://send?phone=91${num}&text=${txt}`;const web=`https://api.whatsapp.com/send?phone=91${num}&text=${txt}`;const a=document.createElement("a");a.href=wapp;a.click();setTimeout(()=>{if(!document.hidden)window.open(web,"_blank");},1500);})(owner?.mobile?.replace(/[^0-9]/g,"")|| "", msg);
                  }} style={{ background: "#25d366", color: "#fff", border: "none" }}>Y' WhatsApp</button>
                  <button className="btn btn-sm btn-ghost" onClick={() => toast(`Email sent to ${owner?.email}`, "success")}>Y" Email</button>
                </div>
              </div>
            );
          })}
          {followUps.length === 0 && <div style={{ textAlign: "center", padding: 20, color: "var(--txt3)" }}>No upcoming follow-up reminders</div>}
        </div>
      </div>
    </div>
  );
}
function SettingsPage() {
  const { db, saveDB, toast, user } = useApp();
  const [settings, setSettings] = useState({ ...db.clinicSettings });
  const [tab, setTab] = useState("clinic");
  const save = () => {
    db.clinicSettings = settings;
    saveDB();
    toast("Settings saved!", "success");
  };
  const deleteStaff = (u) => {
    if (u.id === user?.id) { toast("You cannot delete your own account while logged in.", "error"); return; }
    if (!window.confirm(`Delete staff member ${u.name}?`)) return;
    db.users = db.users.filter(x => x.id !== u.id);
    saveDB();
    toast("Staff member deleted.", "success");
  };

  return (
    <div className="fu">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div className="pt">Clinic Settings</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
        <div className="card" style={{ alignSelf: "start" }}>
          {["clinic", "doctor", "billing", "reminders", "users", "security"].map((s, i) => {
            const labels = { clinic: "Clinic Profile", doctor: "Doctor Info", billing: "Billing Settings", reminders: "Reminder Config", users: "Users & Roles", security: "Security" };
            return <div key={s} onClick={() => setTab(s)} style={{ padding: "12px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, background: tab === s ? "var(--gold-pale)" : "transparent", borderLeft: tab === s ? "3px solid var(--gold)" : "3px solid transparent", color: tab === s ? "var(--gold-dim)" : "var(--txt)", transition: "all .18s" }}>{labels[s]}</div>;
          })}
        </div>
        <div className="card">
          <div className="card-head"><span className="card-title">{tab === "clinic" ? "Clinic Profile" : tab === "doctor" ? "Doctor Info" : tab === "billing" ? "Billing" : tab === "reminders" ? "Reminders" : tab === "users" ? "Users" : "Security"}</span></div>
          <div className="card-body">
            {tab === "clinic" && (
              <>
                <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 22, padding: "14px 16px", background: "var(--canvas)", borderRadius: "var(--r)", border: "1px solid var(--bdr)" }}>
                  <div style={{ width: 70, height: 70, background: "var(--ink)", borderRadius: "var(--r)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>Y</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{settings.name}</div>
                    <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 2 }}>Clinic Logo</div>
                    <label className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>
                      Y" Upload Logo
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => setSettings({ ...settings, logo: reader.result });
                        reader.readAsDataURL(file);
                      }} />
                    </label>
                  </div>
                </div>
                <div className="inp-row cols2">
                  <div className="inp-g"><label className="inp-lbl">Clinic Name *</label><input className="inp" value={settings.name} onChange={e => setSettings({ ...settings, name: e.target.value })} /></div>
                  <div className="inp-g"><label className="inp-lbl">Registration No.</label><input className="inp" value={settings.regNum} onChange={e => setSettings({ ...settings, regNum: e.target.value })} /></div>
                  <div className="inp-g"><label className="inp-lbl">Phone</label><input className="inp" value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} /></div>
                  <div className="inp-g"><label className="inp-lbl">Email</label><input className="inp" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} /></div>
                  <div className="inp-g" style={{ gridColumn: "span 2" }}><label className="inp-lbl">Address</label><textarea className="inp" rows={2} value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} /></div>
                </div>
              </>
            )}
            {tab === "doctor" && (
              <>
                <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 22, padding: "14px 16px", background: "var(--canvas)", borderRadius: "var(--r)", border: "1px solid var(--bdr)" }}>
                  <div style={{ width: 60, height: 60, background: "linear-gradient(135deg,var(--ink),var(--ink-soft))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: "#fff", fontWeight: 800 }}>DR</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{settings.doctor}</div>
                    <div style={{ fontSize: 12, color: "var(--grn)", marginTop: 2 }}>- Active</div>
                  </div>
                </div>
                <div className="inp-row cols2">
                  <div className="inp-g"><label className="inp-lbl">Doctor Name *</label><input className="inp" value={settings.doctor} onChange={e => setSettings({ ...settings, doctor: e.target.value })} /></div>
                  <div className="inp-g"><label className="inp-lbl">Vet Reg. Number</label><input className="inp" value={settings.vetReg || ""} onChange={e => setSettings({ ...settings, vetReg: e.target.value })} /></div>
                  <div className="inp-g"><label className="inp-lbl">Specialization</label><input className="inp" value={settings.specialization || ""} onChange={e => setSettings({ ...settings, specialization: e.target.value })} /></div>
                  <div className="inp-g"><label className="inp-lbl">Experience (years)</label><input type="number" className="inp" value={settings.experience ?? 0} onChange={e => setSettings({ ...settings, experience: parseInt(e.target.value) || 0 })} /></div>
                  <div className="inp-g"><label className="inp-lbl">Signature (for Rx)</label><input className="inp" value={settings.signature || ""} onChange={e => setSettings({ ...settings, signature: e.target.value })} placeholder="Dr. Name, Qualification" /></div>
                  <div className="inp-g"><label className="inp-lbl">Consultation Fee (,)</label><input type="number" className="inp" value={settings.consultFee} onChange={e => setSettings({ ...settings, consultFee: parseInt(e.target.value) })} /></div>
                </div>
                <div className="inp-g"><label className="inp-lbl">Doctor Bio / Speciality Note</label><textarea className="inp" rows={3} value={settings.doctorBio || ""} onChange={e => setSettings({ ...settings, doctorBio: e.target.value })} /></div>
              </>
            )}
            {tab === "billing" && (
              <div className="inp-row cols2">
                <div className="inp-g"><label className="inp-lbl">Default Consultation Fee (,)</label><input type="number" className="inp" value={settings.consultFee} onChange={e => setSettings({ ...settings, consultFee: parseInt(e.target.value) })} /></div>
                <div className="inp-g"><label className="inp-lbl">Currency Symbol</label><input className="inp" value={settings.currency} onChange={e => setSettings({ ...settings, currency: e.target.value })} /></div>
                <div className="inp-g"><label className="inp-lbl">Tax Rate (%)</label><input type="number" className="inp" value={settings.taxRate ?? 0} onChange={e => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })} /></div>
                <div className="inp-g"><label className="inp-lbl">Invoice Prefix</label><input className="inp" value={settings.invoicePrefix || "INV"} onChange={e => setSettings({ ...settings, invoicePrefix: e.target.value })} /></div>
                <div className="inp-g"><label className="inp-lbl">Payment Methods Accepted</label>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    {["Cash", "UPI", "Card", "Online"].map(m => <label key={m} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      <input type="checkbox" checked={(settings.paymentMethods || []).includes(m)} onChange={() => {
                        const cur = new Set(settings.paymentMethods || []);
                        if (cur.has(m)) cur.delete(m); else cur.add(m);
                        setSettings({ ...settings, paymentMethods: Array.from(cur) });
                      }} />{m}
                    </label>)}
                  </div>
                </div>
                <div className="inp-g"><label className="inp-lbl">Show Tax on Invoice</label>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, cursor: "pointer" }}><input type="radio" name="tax" value="yes" checked={!!settings.showTax} onChange={() => setSettings({ ...settings, showTax: true })} />Yes</label>
                    <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, cursor: "pointer" }}><input type="radio" name="tax" value="no" checked={!settings.showTax} onChange={() => setSettings({ ...settings, showTax: false })} />No</label>
                  </div>
                </div>
              </div>
            )}
            {tab === "reminders" && (
              <div>
                <div className="alert a-info" style={{ marginBottom: 16 }}>Configure automated WhatsApp and Email reminders sent to pet owners.</div>
                <div className="inp-row cols2">
                  <div className="inp-g"><label className="inp-lbl">Vaccination Reminder (days before)</label><input type="number" className="inp" value={settings.reminderVaccDays ?? 7} onChange={e => setSettings({ ...settings, reminderVaccDays: parseInt(e.target.value) || 0 })} /></div>
                  <div className="inp-g"><label className="inp-lbl">Follow-up Reminder (days before)</label><input type="number" className="inp" value={settings.reminderFollowupDays ?? 1} onChange={e => setSettings({ ...settings, reminderFollowupDays: parseInt(e.target.value) || 0 })} /></div>
                  <div className="inp-g"><label className="inp-lbl">Appointment Reminder Time</label><input type="time" className="inp" value={settings.reminderTime || "09:00"} onChange={e => setSettings({ ...settings, reminderTime: e.target.value })} /></div>
                  <div className="inp-g"><label className="inp-lbl">WhatsApp Number (Clinic)</label><input className="inp" value={settings.reminderWhatsapp || ""} onChange={e => setSettings({ ...settings, reminderWhatsapp: e.target.value })} /></div>
                </div>
                <div className="inp-g" style={{ marginTop: 8 }}><label className="inp-lbl">Vaccination Reminder Message Template</label>
                  <textarea className="inp" rows={3} value={settings.reminderVaccTemplate || ""} onChange={e => setSettings({ ...settings, reminderVaccTemplate: e.target.value })} /></div>
                <div className="inp-g"><label className="inp-lbl">Follow-up Reminder Message Template</label>
                  <textarea className="inp" rows={3} value={settings.reminderFollowupTemplate || ""} onChange={e => setSettings({ ...settings, reminderFollowupTemplate: e.target.value })} /></div>
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  {["Send via WhatsApp", "Send via Email", "Both"].map(opt => (
                    <label key={opt} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 8, border: "1.5px solid var(--bdr)", cursor: "pointer", fontSize: 13, fontWeight: 600, background: opt === "Both" ? "var(--ink)" : "var(--white)", color: opt === "Both" ? "#fff" : "var(--txt)" }}>
                      <input type="radio" name="reminder_channel" checked={(settings.reminderChannel || "Both") === opt} onChange={() => setSettings({ ...settings, reminderChannel: opt })} style={{ display: "none" }} />{opt}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {tab === "users" && (
              <div>
                <div className="tbl-wrap">
                  <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Mobile</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {db.users.map(u => (
                        <tr key={u.id}>
                          <td style={{ fontWeight: 600 }}>{u.name}</td>
                          <td style={{ fontSize: 12, color: "var(--txt2)" }}>{u.email}</td>
                          <td><span className={`badge ${u.role === "doctor" ? "b-info" : u.role === "receptionist" ? "b-teal" : "b-gold"}`} style={{ textTransform: "capitalize" }}>{u.role}</span></td>
                          <td style={{ fontSize: 12 }}>{u.mobile}</td>
                          <td><span className="badge b-bill">- Active</span></td>
                          <td><div style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-ghost btn-xs" style={{ color: "var(--red)" }} onClick={() => deleteStaff(u)}>Y-'️</button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {tab === "security" && (
              <div>
                <div className="alert a-info" style={{ marginBottom: 16 }}>Y"' Manage password, session timeouts, and access controls.</div>
                <div className="inp-row cols2" style={{ marginBottom: 14 }}>
                  <div className="inp-g"><label className="inp-lbl">Current Password</label><input type="password" className="inp" placeholder="Enter current password" /></div>
                  <div className="inp-g"></div>
                  <div className="inp-g"><label className="inp-lbl">New Password</label><input type="password" className="inp" placeholder="Min 8 characters" /></div>
                  <div className="inp-g"><label className="inp-lbl">Confirm New Password</label><input type="password" className="inp" placeholder="Repeat new password" /></div>
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                  <button className="btn btn-ink btn-sm" onClick={() => toast("Password updated!", "success")}>Y"' Update Password</button>
                </div>
                <div style={{ borderTop: "1px solid var(--bdr2)", paddingTop: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Session Settings</div>
                  <div className="inp-row cols2">
                    <div className="inp-g"><label className="inp-lbl">Auto Logout After (minutes)</label>
                      <select className="inp"><option>30</option><option>60</option><option>120</option><option>Never</option></select>
                    </div>
                    <div className="inp-g"><label className="inp-lbl">Two-Factor Authentication</label>
                      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600 }}><input type="checkbox" />Enable 2FA via OTP</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {(tab !== "users") && (
              <div style={{ marginTop: 20, display: "flex", gap: 10, borderTop: "1px solid var(--bdr2)", paddingTop: 16 }}>
                <button className="btn btn-ink" onClick={save}>Y' Save Changes</button>
                <button className="btn btn-ghost" onClick={() => setSettings({ ...db.clinicSettings })}>? Reset</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ...............................................................................
// SUPPLIER PAYMENTS
// ...............................................................................

function SuppliersPage() {
  const { db, saveDB, toast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [viewInv, setViewInv] = useState(null);
  const [form, setForm] = useState({ vendor: "", item: "", qty: "", unitPrice: "", total: "", date: todayStr(), status: "pending", notes: "" });

  if (!db.supplierPayments) db.supplierPayments = [
    { id: 1, vendor: "Pharma India", item: "Amoxicillin 250mg - 500 tabs", qty: 500, unitPrice: 7, total: 3500, date: "2026-03-01", status: "paid", notes: "Batch AMX2025C" },
    { id: 2, vendor: "BioVet", item: "Rabies Vaccine - 30 doses", qty: 30, unitPrice: 320, total: 9600, date: "2026-03-05", status: "paid", notes: "Batch RBV2026A" },
    { id: 3, vendor: "FluidCare", item: "Normal Saline 500ml - 20 bags", qty: 20, unitPrice: 50, total: 1000, date: "2026-03-10", status: "pending", notes: "" },
    { id: 4, vendor: "VetPlus", item: "Ivermectin 1% - 10 vials", qty: 10, unitPrice: 110, total: 1100, date: "2026-03-08", status: "paid", notes: "" },
  ];
  const payments = db.supplierPayments || [];
  const totalPaid = payments.filter(p => p.status === "paid").reduce((s, p) => s + p.total, 0);
  const totalPending = payments.filter(p => p.status === "pending").reduce((s, p) => s + p.total, 0);

  const addPayment = () => {
    if (!form.vendor || !form.item) { toast("Fill required fields", "error"); return; }
    db.supplierPayments = [...payments, { id: payments.length + 1, ...form, qty: parseInt(form.qty) || 1, unitPrice: parseFloat(form.unitPrice) || 0, total: parseFloat(form.total) || 0 }];
    saveDB(); toast("Supplier payment recorded!", "success"); setShowModal(false);
    setForm({ vendor: "", item: "", qty: "", unitPrice: "", total: "", date: todayStr(), status: "pending", notes: "" });
  };
  const markPaid = (id) => {
    db.supplierPayments = db.supplierPayments.map(p => p.id === id ? { ...p, status: "paid" } : p);
    saveDB(); toast("Marked as paid!", "success");
  };

  return (
    <div className="fu">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div><div className="pt">Supplier & Vendor Payments</div><div className="ps">Track all medicine, vaccine and supply purchases</div></div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => {
            const rows = ["Date,Vendor,Item,Qty,Unit Price,Total,Status,Notes", ...payments.map(p => `${p.date},${p.vendor},${p.item},${p.qty},${p.unitPrice},${p.total},${p.status},${p.notes || ""}`)].join("\n");
            const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8,"+encodeURIComponent(rows); a.download = "supplier_payments.csv"; a.click();
            toast("CSV exported!", "success");
          }}>Y"S Export CSV</button>
          <button className="btn btn-gold" onClick={() => setShowModal(true)}>+ Record Purchase</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { l: "Total Purchases", v: payments.length, i: "📦", c: "c1" },
          { l: "Total Paid", v: `,${totalPaid.toLocaleString()}`, i: "o.", c: "c3" },
          { l: "Pending Payment", v: `,${totalPending.toLocaleString()}`, i: "⏳", c: "c4" },
          { l: "Vendors", v: [...new Set(payments.map(p => p.vendor))].length, i: "Y", c: "c2" },
        ].map((s, i) => (
          <div key={i} className={`scard ${s.c}`}><div className="sico" style={{ fontSize: 22 }}>{s.i}</div><div className="sval" style={{ fontSize: 28 }}>{s.v}</div><div className="slbl">{s.l}</div></div>
        ))}
      </div>
      {payments.filter(p => p.status === "pending").map(p => (
        <div key={p.id} className="alert a-warn" style={{ marginBottom: 8 }}>
          ⏳ <strong>{p.vendor}</strong> ?" ,{p.total.toLocaleString()} pending for <em>{p.item}</em>
          <button className="btn btn-ghost btn-xs" style={{ marginLeft: 10 }} onClick={() => markPaid(p.id)}>o. Mark Paid</button>
        </div>
      ))}
      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Date</th><th>Vendor</th><th>Item / Description</th><th>Qty</th><th>Unit Price</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {[...payments].sort((a,b) => new Date(b.date)-new Date(a.date)).map(p => (
                <tr key={p.id}>
                  <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{fmt(p.date)}</td>
                  <td><div style={{ fontWeight: 700 }}>{p.vendor}</div></td>
                  <td><div style={{ fontSize: 13 }}>{p.item}</div>{p.notes && <div style={{ fontSize: 11, color: "var(--txt3)" }}>{p.notes}</div>}</td>
                  <td style={{ fontFamily: "'JetBrains Mono',monospace" }}>{p.qty}</td>
                  <td style={{ fontFamily: "'JetBrains Mono',monospace" }}>,{p.unitPrice}</td>
                  <td><span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 17 }}>,{p.total.toLocaleString()}</span></td>
                  <td><span className={`badge ${p.status === "paid" ? "b-bill" : "b-wait"}`}>{p.status === "paid" ? "o. Paid" : "⏳ Pending"}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 5 }}>
                      {p.status === "pending" && <button className="btn btn-teal btn-xs" onClick={() => markPaid(p.id)}>Mark Paid</button>}
                      <button className="btn btn-ghost btn-xs">Y-️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && <tr><td colSpan={8} style={{ textAlign: "center", padding: 24, color: "var(--txt3)" }}>No supplier payments recorded yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="ov" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="m-head"><span className="m-title">Y" Record Supplier Purchase</span><button className="btn-ico" onClick={() => setShowModal(false)} style={{ fontSize: 16 }}>o.</button></div>
            <div className="m-body">
              <div className="inp-row cols2">
                <div className="inp-g"><label className="inp-lbl">Vendor / Supplier *</label>
                  <input className="inp" list="vendors-list" value={form.vendor} onChange={e => setForm({ ...form, vendor: e.target.value })} placeholder="e.g. BioVet, Pharma India" />
                  <datalist id="vendors-list">{[...new Set(payments.map(p => p.vendor))].map(v => <option key={v} value={v} />)}</datalist>
                </div>
                <div className="inp-g"><label className="inp-lbl">Date *</label><input type="date" className="inp" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              </div>
              <div className="inp-g"><label className="inp-lbl">Item / Description *</label><input className="inp" value={form.item} onChange={e => setForm({ ...form, item: e.target.value })} placeholder="e.g. Amoxicillin 250mg - 500 tablets" /></div>
              <div className="inp-row cols3">
                <div className="inp-g"><label className="inp-lbl">Quantity</label><input type="number" className="inp" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value, total: (parseFloat(e.target.value) * parseFloat(form.unitPrice || 0)).toFixed(2) })} /></div>
                <div className="inp-g"><label className="inp-lbl">Unit Price (,)</label><input type="number" className="inp" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: e.target.value, total: (parseFloat(form.qty || 0) * parseFloat(e.target.value)).toFixed(2) })} /></div>
                <div className="inp-g"><label className="inp-lbl">Total Amount (,) *</label><input type="number" className="inp" value={form.total} onChange={e => setForm({ ...form, total: e.target.value })} /></div>
              </div>
              <div className="inp-row cols2">
                <div className="inp-g"><label className="inp-lbl">Payment Status</label>
                  <select className="inp" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="pending">Pending</option><option value="paid">Paid</option></select>
                </div>
                <div className="inp-g"><label className="inp-lbl">Notes (Batch, Invoice No.)</label><input className="inp" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
              </div>
            </div>
            <div className="m-foot"><button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-gold" onClick={addPayment}>Y" Save Purchase</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ...............................................................................
// CERTIFICATES & FORMS
// ...............................................................................

function CertificatesPage() {
  const { db, toast } = useApp();
  const [certType, setCertType] = useState("vaccination");
  const [selPet, setSelPet] = useState(db.pets[0]?.id || "");
  const [preview, setPreview] = useState(false);

  const pet = db.pets.find(p => p.id === parseInt(selPet));
  const owner = pet && db.owners.find(o => o.id === pet.ownerId);
  const petVaccs = pet ? db.vaccinations.filter(v => v.petId === pet.id) : [];

  const CERT_TYPES = [
    { id: "vaccination", label: "Vaccination Certificate", icon: "💉" },
    { id: "consent", label: "Consent Form", icon: "📝" },
    { id: "health", label: "Health Certificate", icon: "❤️" },
    { id: "travel", label: "Travel / Fitness Certificate", icon: "✈️" },
    { id: "death", label: "Death Certificate", icon: "🪦" },
    { id: "deworming", label: "Deworming Certificate", icon: "🐛" },
  ];

  const printCert = () => {
    const w = window.open("", "_blank");
    const certContent = document.getElementById("cert-preview")?.innerHTML || "";
    w.document.write(`<html><head><title>Certificate</title><style>body{font-family:Georgia,serif;padding:40px;color:#000}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ccc;padding:8px}@media print{button{display:none}}</style></head><body>${certContent}<br><button onclick="window.print()">Print</button></body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 300);
  };

  return (
    <div className="fu">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div><div className="pt">Certificates & Forms</div><div className="ps">Generate official veterinary documents</div></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20 }}>
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="card-head" style={{ padding: "12px 14px" }}><span className="card-title" style={{ fontSize: 14 }}>Certificate Type</span></div>
            <div style={{ padding: 8 }}>
              {CERT_TYPES.map(ct => (
                <div key={ct.id} onClick={() => setCertType(ct.id)} style={{ padding: "10px 12px", borderRadius: 8, cursor: "pointer", background: certType === ct.id ? "var(--gold-pale)" : "transparent", borderLeft: certType === ct.id ? "3px solid var(--gold)" : "3px solid transparent", fontWeight: certType === ct.id ? 700 : 500, fontSize: 13, color: certType === ct.id ? "var(--gold-dim)" : "var(--txt)", marginBottom: 3, transition: "all .18s" }}>
                  {ct.label}
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-head" style={{ padding: "12px 14px" }}><span className="card-title" style={{ fontSize: 14 }}>Select Pet</span></div>
            <div style={{ padding: "10px 14px" }}>
              <select className="inp" value={selPet} onChange={e => setSelPet(e.target.value)}>
                <option value="">Choose pet...</option>
                {db.pets.map(p => { const o = db.owners.find(o => o.id === p.ownerId); return <option key={p.id} value={p.id}>{p.photo} {p.name} - {o?.name}</option>; })}
              </select>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <span className="card-title">{CERT_TYPES.find(c => c.id === certType)?.label}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => toast("Download as PDF or Print? Save as PDF", "")}>Download PDF</button>
              <button className="btn btn-gold btn-sm" onClick={printCert}>Print</button>
            </div>
          </div>
          <div className="card-body" id="cert-preview">
            {/* Header */}
            <div style={{ textAlign: "center", borderBottom: "3px double var(--ink)", paddingBottom: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>Y</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, color: "var(--ink)" }}>{db.clinicSettings.name}</div>
              <div style={{ fontSize: 13, color: "var(--txt2)", marginTop: 3 }}>{db.clinicSettings.address}</div>
              <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 2 }}>Y"z {db.clinicSettings.phone} · o?️ {db.clinicSettings.email}</div>
              <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}>Reg. No: {db.clinicSettings.regNum}</div>
            </div>
            {!pet && <div style={{ textAlign: "center", padding: 40, color: "var(--txt3)" }}>Y'? Select a pet to generate the certificate</div>}
            {pet && certType === "vaccination" && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 18 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: "var(--ink)", letterSpacing: ".02em" }}>VACCINATION CERTIFICATE</div>
                  <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 4 }}>Date: {fmt(todayStr())} · Cert No: VC-{pet.id}-{new Date().getFullYear()}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18, padding: "14px 18px", background: "var(--canvas)", borderRadius: 10 }}>
                  <div><div style={{ fontSize: 11, fontWeight: 800, color: "var(--txt3)", textTransform: "uppercase", marginBottom: 6 }}>Pet Details</div>
                    <table style={{ fontSize: 13, width: "100%", border: "none" }}><tbody>
                      <tr><td style={{ border: "none", padding: "3px 0", fontWeight: 700, width: "40%" }}>Name:</td><td style={{ border: "none", padding: "3px 0" }}>{pet.name}</td></tr>
                      <tr><td style={{ border: "none", padding: "3px 0", fontWeight: 700 }}>Species:</td><td style={{ border: "none", padding: "3px 0" }}>{pet.type}</td></tr>
                      <tr><td style={{ border: "none", padding: "3px 0", fontWeight: 700 }}>Breed:</td><td style={{ border: "none", padding: "3px 0" }}>{pet.breed}</td></tr>
                      <tr><td style={{ border: "none", padding: "3px 0", fontWeight: 700 }}>DOB:</td><td style={{ border: "none", padding: "3px 0" }}>{fmt(pet.dob)}</td></tr>
                      <tr><td style={{ border: "none", padding: "3px 0", fontWeight: 700 }}>Sex:</td><td style={{ border: "none", padding: "3px 0" }}>{pet.sex}</td></tr>
                      <tr><td style={{ border: "none", padding: "3px 0", fontWeight: 700 }}>Weight:</td><td style={{ border: "none", padding: "3px 0" }}>{pet.weight} kg</td></tr>
                    </tbody></table>
                  </div>
                  <div><div style={{ fontSize: 11, fontWeight: 800, color: "var(--txt3)", textTransform: "uppercase", marginBottom: 6 }}>Owner Details</div>
                    <table style={{ fontSize: 13, width: "100%", border: "none" }}><tbody>
                      <tr><td style={{ border: "none", padding: "3px 0", fontWeight: 700, width: "40%" }}>Name:</td><td style={{ border: "none", padding: "3px 0" }}>{owner?.name}</td></tr>
                      <tr><td style={{ border: "none", padding: "3px 0", fontWeight: 700 }}>Mobile:</td><td style={{ border: "none", padding: "3px 0" }}>{owner?.mobile}</td></tr>
                      <tr><td style={{ border: "none", padding: "3px 0", fontWeight: 700 }}>Email:</td><td style={{ border: "none", padding: "3px 0" }}>{owner?.email}</td></tr>
                      <tr><td style={{ border: "none", padding: "3px 0", fontWeight: 700 }}>Address:</td><td style={{ border: "none", padding: "3px 0" }}>{owner?.address}</td></tr>
                    </tbody></table>
                  </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "var(--txt3)", textTransform: "uppercase", marginBottom: 10 }}>Vaccination History</div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead><tr style={{ background: "var(--ink)", color: "#fff" }}><th style={{ padding: "8px 12px", textAlign: "left", border: "none" }}>#</th><th style={{ padding: "8px 12px", textAlign: "left", border: "none" }}>Vaccine</th><th style={{ padding: "8px 12px", textAlign: "left", border: "none" }}>Date Given</th><th style={{ padding: "8px 12px", textAlign: "left", border: "none" }}>Next Due</th><th style={{ padding: "8px 12px", textAlign: "left", border: "none" }}>Batch No.</th><th style={{ padding: "8px 12px", textAlign: "left", border: "none" }}>Status</th></tr></thead>
                    <tbody>
                      {petVaccs.map((v, i) => (
                        <tr key={v.id} style={{ background: i % 2 === 0 ? "var(--canvas)" : "var(--white)" }}>
                          <td style={{ padding: "8px 12px", border: "none" }}>{i + 1}</td>
                          <td style={{ padding: "8px 12px", border: "none", fontWeight: 600 }}>{v.vaccine}</td>
                          <td style={{ padding: "8px 12px", border: "none" }}>{fmt(v.given)}</td>
                          <td style={{ padding: "8px 12px", border: "none" }}>{fmt(v.next)}</td>
                          <td style={{ padding: "8px 12px", border: "none", fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>{v.batch || "N/A"}</td>
                          <td style={{ padding: "8px 12px", border: "none" }}><span style={{ color: v.status === "ok" ? "var(--grn)" : v.status === "due" ? "var(--org)" : "var(--red)", fontWeight: 700 }}>{v.status === "ok" ? "✓ Current" : v.status === "due" ? "⏰ Due" : "⚠️ Overdue"}</span></td>
                        </tr>
                      ))}
                      {petVaccs.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", padding: 16, color: "var(--txt3)", border: "none" }}>No vaccination records on file</td></tr>}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 30, paddingTop: 16, borderTop: "1px solid var(--bdr)" }}>
                  <div style={{ textAlign: "center" }}><div style={{ borderTop: "2px solid var(--ink)", paddingTop: 8, fontSize: 12, color: "var(--txt2)", fontWeight: 600 }}>Authorized Signature & Stamp</div><div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 3 }}>{db.clinicSettings.signature || db.clinicSettings.doctor}</div></div>
                  <div style={{ textAlign: "center" }}><div style={{ borderTop: "2px solid var(--ink)", paddingTop: 8, fontSize: 12, color: "var(--txt2)", fontWeight: 600 }}>Pet Owner's Signature</div><div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 3 }}>{owner?.name}</div></div>
                </div>
              </div>
            )}
            {pet && certType === "consent" && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 18 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700 }}>INFORMED CONSENT FORM</div>
                  <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 4 }}>Date: {fmt(todayStr())}</div>
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.8, color: "var(--txt)", marginBottom: 18 }}>
                  <p>I, <strong>{owner?.name}</strong> (Mobile: {owner?.mobile}), hereby grant consent to <strong>{db.clinicSettings.doctor}</strong> at <strong>{db.clinicSettings.name}</strong> to examine, diagnose, and administer necessary treatment to my pet:</p>
                  <div style={{ margin: "14px 0", padding: "12px 16px", background: "var(--canvas)", borderRadius: 8, border: "1px solid var(--bdr)" }}>
                    <strong>Pet Name:</strong> {pet.name} &nbsp;|&nbsp; <strong>Species:</strong> {pet.type} &nbsp;|&nbsp; <strong>Breed:</strong> {pet.breed} &nbsp;|&nbsp; <strong>Sex:</strong> {pet.sex} &nbsp;|&nbsp; <strong>DOB:</strong> {fmt(pet.dob)}
                  </div>
                  <p>I understand that the veterinary team will exercise due care and skill, and I have disclosed all known medical history, allergies, and current medications. I acknowledge that no guarantees have been made regarding the outcome of treatment.</p>
                  <p>I agree to be responsible for all associated costs of treatment as per the clinic's fee schedule.</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 30, paddingTop: 16, borderTop: "1px solid var(--bdr)" }}>
                  <div style={{ textAlign: "center" }}><div style={{ borderTop: "2px solid var(--ink)", paddingTop: 8, fontSize: 12, color: "var(--txt2)", fontWeight: 600 }}>Veterinarian Signature</div><div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 3 }}>{db.clinicSettings.signature || db.clinicSettings.doctor}</div></div>
                  <div style={{ textAlign: "center" }}><div style={{ borderTop: "2px solid var(--ink)", paddingTop: 8, fontSize: 12, color: "var(--txt2)", fontWeight: 600 }}>Pet Owner's Signature</div><div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 3 }}>{owner?.name} · Date: ___________</div></div>
                </div>
              </div>
            )}
            {pet && certType === "health" && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 18 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700 }}>HEALTH CERTIFICATE</div>
                  <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 4 }}>Date: {fmt(todayStr())} · Cert No: HC-{pet.id}-{Date.now().toString().slice(-4)}</div>
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 14 }}>
                  This is to certify that <strong>{pet.name}</strong>, a <strong>{pet.sex} {pet.type} ({pet.breed})</strong>, owned by <strong>{owner?.name}</strong>, was examined on <strong>{fmt(todayStr())}</strong> and found to be in good health and free from any clinical signs of infectious or communicable disease at the time of examination.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "14px", background: "var(--canvas)", borderRadius: 9, marginBottom: 18, border: "1px solid var(--bdr)" }}>
                  {[["Weight", `${pet.weight} kg`], ["Temperature", "101.5°F"], ["Heart Rate", "88 bpm"], ["Resp. Rate", "20/min"], ["Body Cond.", "3/5 - Good"], ["Vaccination", petVaccs.length > 0 ? "Up to date" : "Pending"]].map(([k, v]) => (
                    <div key={k}><div style={{ fontSize: 10, fontWeight: 800, color: "var(--txt3)", textTransform: "uppercase" }}>{k}</div><div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{v}</div></div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginTop: 30, paddingTop: 16, borderTop: "1px solid var(--bdr)" }}>
                  <div style={{ textAlign: "center" }}><div style={{ borderTop: "2px solid var(--ink)", paddingTop: 8, fontSize: 12, color: "var(--txt2)", fontWeight: 600 }}>Veterinarian Signature & Stamp</div><div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 3 }}>{db.clinicSettings.signature || db.clinicSettings.doctor}</div></div>
                  <div style={{ textAlign: "center" }}><div style={{ borderTop: "2px solid var(--ink)", paddingTop: 8, fontSize: 12, color: "var(--txt2)", fontWeight: 600 }}>Date of Examination</div><div style={{ fontSize: 13, fontWeight: 700, marginTop: 3 }}>{fmt(todayStr())}</div></div>
                </div>
              </div>
            )}
            {pet && (certType === "travel" || certType === "deworming" || certType === "death") && (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{CERT_TYPES.find(c=>c.id===certType)?.icon}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{CERT_TYPES.find(c=>c.id===certType)?.label} for {pet.name}</div>
                <div style={{ fontSize: 13, color: "var(--txt2)", marginBottom: 20 }}>Pet: {pet.name} ({pet.breed}) · Owner: {owner?.name} · Date: {fmt(todayStr())}</div>
                <button className="btn btn-gold" onClick={() => toast("Certificate generated and ready to print!", "success")}>o. Generate & Print</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ...............................................................................
// SYSTEM ADMIN PAGE
// ...............................................................................

function SystemAdminPage({ initialTab = "users" }) {
  const { db, saveDB, toast } = useApp();
  const [tab, setTab] = useState(initialTab);
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "", role: "doctor", active: true });

  const ROLE_COLORS = { doctor: "var(--teal)", receptionist: "var(--gold-dim)", admin: "var(--red)", owner: "var(--txt3)" };
  const ROLE_ICONS = { doctor: "Y'?s.️", receptionist: "Y'?Y'", admin: "Y>️", owner: "Y " };

  const saveUser = () => {
    if (!form.name || !form.email) { toast("Name and email required", "error"); return; }
    if (editUser) {
      db.users = db.users.map(u => u.id === editUser.id ? { ...u, ...form } : u);
      toast("User updated!", "success");
    } else {
      if (db.users.find(u => u.email === form.email)) { toast("Email already exists", "error"); return; }
      db.users.push({ id: db.users.length + 1, ...form, avatar: form.name.slice(0,2).toUpperCase(), lastLogin: null });
      toast("User created!", "success");
    }
    saveDB(); setShowAdd(false); setEditUser(null);
    setForm({ name: "", email: "", mobile: "", password: "", role: "doctor", active: true });
  };

  const toggleActive = (id) => {
    db.users = db.users.map(u => u.id === id ? { ...u, active: !u.active } : u);
    saveDB(); toast("User status updated!", "success");
  };

  const sessions = (db.sessions || []);
  const actLog = [...(db.activityLog || [])].reverse().slice(0, 50);

  return (
    <div className="fu">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <div className="pt">System Administration</div>
          <div className="ps">Manage users, sessions, roles, and system settings</div>
        </div>
        <button className="btn btn-gold" onClick={() => { setEditUser(null); setForm({ name: "", email: "", mobile: "", password: "", role: "doctor", active: true }); setShowAdd(true); }}>+ Add User</button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { l: "Total Users", v: db.users.length, i: "Y'", c: "c1" },
          { l: "Active Sessions", v: sessions.length || 1, i: "🕒", c: "c3" },
          { l: "Doctors", v: db.users.filter(u=>u.role==="doctor").length, i: "🩺", c: "c2" },
          { l: "Pet Owners", v: db.users.filter(u=>u.role==="owner").length, i: "Y ", c: "c4" },
        ].map((s, i) => (
          <div key={i} className={`scard ${s.c}`}><div className="sico" style={{ fontSize: 22 }}>{s.i}</div><div className="sval" style={{ fontSize: 30 }}>{s.v}</div><div className="slbl">{s.l}</div></div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[["users","Users"],["sessions","Sessions"],["roles","Role Permissions"],["activity","Activity Log"]].map(([id,lbl])=>(
          <div key={id} className={`tab${tab===id?" on":""}`} onClick={()=>setTab(id)}>{lbl}</div>
        ))}
      </div>

      {/* Users Tab */}
      {tab === "users" && (
        <div className="fu">
          <div className="card">
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Mobile</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
                <tbody>
                  {db.users.map((u) => (
                    <tr key={u.id} style={{ opacity: u.active === false ? 0.5 : 1 }}>
                      <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "var(--txt3)" }}>#{u.id}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: ROLE_COLORS[u.role] || "var(--txt3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>{u.avatar}</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13 }}>{u.name}</div>
                            <div style={{ fontSize: 11, color: "var(--txt3)" }}>ID: {u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 12 }}>{u.email}</td>
                      <td style={{ fontSize: 12 }}>{u.mobile || "N/A"}</td>
                      <td><span className="badge" style={{ background: ROLE_COLORS[u.role]+"22", color: ROLE_COLORS[u.role], fontSize: 11 }}>{ROLE_ICONS[u.role]} {u.role}</span></td>
                      <td><span className={`badge ${u.active !== false ? "b-bill" : "b-emg"}`} style={{ cursor: "pointer" }} onClick={() => toggleActive(u.id)}>{u.active !== false ? "✓ Active" : "✕ Disabled"}</span></td>
                      <td style={{ fontSize: 11, color: "var(--txt3)", fontFamily: "'JetBrains Mono',monospace" }}>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString("en-IN") : "Never"}</td>
                      <td>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button className="btn btn-ghost btn-xs" onClick={() => { setEditUser(u); setForm({ name: u.name, email: u.email, mobile: u.mobile||"", password: "", role: u.role, active: u.active !== false }); setShowAdd(true); }}>o️ Edit</button>
                          <button className="btn btn-ghost btn-xs" style={{ color: "var(--red)" }} onClick={() => { if(window.confirm(`Delete user ${u.name}?`)) { db.users = db.users.filter(x=>x.id!==u.id); saveDB(); toast("User deleted",""); } }}>Y-'️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sessions Tab */}
      {tab === "sessions" && (
        <div className="fu">
          <div className="card" style={{ padding: 20 }}>
            <div className="alert a-info" style={{ marginBottom: 14 }}>Sessions are tracked per browser tab/login. JWT tokens stored in localStorage with 24-hour expiry.</div>
            <div style={{ background: "var(--canvas)", borderRadius: 10, padding: 16, border: "1px solid var(--bdr)", marginBottom: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 12 }}>Current Session</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[
                  { l: "Session Key", v: "rpc_token", mono: true },
                  { l: "Expires In", v: "24 hours", mono: false },
                  { l: "Storage", v: "localStorage", mono: true },
                ].map(({ l, v, mono }) => (
                  <div key={l} style={{ background: "var(--white)", borderRadius: 8, padding: 12, border: "1px solid var(--bdr2)" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "var(--txt3)", textTransform: "uppercase", marginBottom: 4 }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: mono ? "'JetBrains Mono',monospace" : "inherit" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 10 }}>Session Management</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: "14px 16px", background: "var(--white)", borderRadius: 10, border: "1px solid var(--bdr2)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Y" Auto-Logout Settings</div>
                <select className="inp" style={{ marginBottom: 10 }}><option>After 30 minutes idle</option><option>After 1 hour idle</option><option>After 4 hours idle</option><option>Never (manual logout)</option></select>
                <button className="btn btn-ink btn-sm" onClick={() => toast("Auto-logout settings saved!", "success")}>Save</button>
              </div>
              <div style={{ padding: "14px 16px", background: "var(--white)", borderRadius: 10, border: "1px solid var(--bdr2)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Y"' Token Management</div>
                <div style={{ fontSize: 12, color: "var(--txt2)", marginBottom: 10 }}>Invalidate all sessions and force re-login for all users.</div>
                <button className="btn btn-red btn-sm" onClick={() => { localStorage.removeItem("rpc_token"); toast("All sessions cleared!", "success"); setTimeout(() => window.location.reload(), 1000); }}>s ️ Invalidate All Sessions</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Permissions Tab */}
      {tab === "roles" && (
        <div className="fu">
          <div className="card">
            <div className="card-head"><span className="card-title">Role-Based Access Control</span></div>
            <div className="card-body">
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Permission / Feature</th>
                      <th style={{ textAlign: "center" }}>Doctor</th>
                      <th style={{ textAlign: "center" }}>Receptionist</th>
                      <th style={{ textAlign: "center" }}>Admin</th>
                      <th style={{ textAlign: "center" }}>Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Dashboard", true, true, true, false],
                      ["Patient Queue", true, true, true, false],
                      ["Appointments", true, true, true, true],
                      ["Consultation / Diagnosis", true, false, true, false],
                      ["Prescriptions", true, false, true, false],
                      ["Vaccination Records", true, true, true, true],
                      ["Billing & Invoices", true, true, true, false],
                      ["Inventory", true, true, true, false],
                      ["Supplier Payments", true, false, true, false],
                      ["Analytics & Reports", true, false, true, false],
                      ["Certificates & Forms", true, false, true, false],
                      ["Settings", false, false, true, false],
                      ["System Administration", false, false, true, false],
                      ["View Own Pets (Portal)", false, false, false, true],
                      ["View Own Prescriptions", false, false, false, true],
                    ].map(([feat, doc, rec, adm, own]) => (
                      <tr key={feat}>
                        <td style={{ fontWeight: 600, fontSize: 13 }}>{feat}</td>
                        {[doc, rec, adm, own].map((allowed, i) => (
                          <td key={i} style={{ textAlign: "center" }}>
                            <span style={{ fontSize: 16 }}>{allowed ? "✓" : "✕"}</span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log */}
      {tab === "activity" && (
        <div className="fu">
          <div className="card">
            <div className="card-head">
              <span className="card-title">Activity Log</span>
              <button className="btn btn-ghost btn-sm" onClick={() => { db.activityLog = []; saveDB(); toast("Log cleared",""); }}>Clear Log</button>
            </div>
            {actLog.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "var(--txt3)" }}>No activity recorded yet. Actions like login, save, and inventory changes will appear here.</div>
            ) : (
              <div className="tbl-wrap">
                <table>
                  <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Details</th></tr></thead>
                  <tbody>
                    {actLog.map((log, i) => (
                      <tr key={i}>
                        <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "var(--txt3)", whiteSpace: "nowrap" }}>{log.time}</td>
                        <td style={{ fontSize: 12, fontWeight: 600 }}>{log.user || "System"}</td>
                        <td><span className={`badge ${log.type === "error" ? "b-emg" : log.type === "warning" ? "b-wait" : "b-info"}`} style={{ fontSize: 10 }}>{log.action}</span></td>
                        <td style={{ fontSize: 12, color: "var(--txt2)" }}>{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {showAdd && (
        <div className="ov" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="m-head"><span className="m-title">{editUser ? "o️ Edit User" : "z. Add New User"}</span><button className="btn-ico" onClick={() => setShowAdd(false)} style={{ fontSize: 16 }}>o.</button></div>
            <div className="m-body">
              <div className="inp-row cols2">
                <div className="inp-g"><label className="inp-lbl">Full Name *</label><input className="inp" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full name" /></div>
                <div className="inp-g"><label className="inp-lbl">Mobile</label><input className="inp" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} placeholder="10-digit mobile" /></div>
              </div>
              <div className="inp-g"><label className="inp-lbl">Email Address *</label><input className="inp" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@example.com" /></div>
              <div className="inp-g"><label className="inp-lbl">{editUser ? "New Password (leave blank to keep)" : "Password *"}</label><input className="inp" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 6 characters" /></div>
              <div className="inp-g">
                <label className="inp-lbl">Role *</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[["doctor","Doctor","Y'?s.️"],["receptionist","Receptionist","Y'?Y'"],["admin","Admin","Y>️"],["owner","Pet Owner","Y "]].map(([val,lbl,ico]) => (
                    <div key={val} onClick={() => setForm({...form, role: val})} style={{ border: `2px solid ${form.role===val?"var(--gold)":"var(--bdr)"}`, background: form.role===val?"var(--gold-pale)":"var(--white)", borderRadius: 9, padding: "10px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all .15s" }}>
                      <span style={{ fontSize: 18 }}>{ico}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: form.role===val?"var(--gold-dim)":"var(--txt)" }}>{lbl}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="inp-g">
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  <input type="checkbox" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} />
                  Account Active
                </label>
              </div>
            </div>
            <div className="m-foot"><button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button><button className="btn btn-gold" onClick={saveUser}>{editUser ? "Y' Update User" : "o. Create User"}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ...............................................................................
// OWNER PORTAL
// ...............................................................................

function OwnerPortal({ page, user }) {
  const { db, saveDB, toast, createAppointment } = useApp();
  const owner = db.owners.find(o => o.mobile === user.mobile) || db.owners[0];
  const myPets = db.pets.filter(p => p.ownerId === owner?.id);
  const [selPetId, setSelPetId] = useState(myPets[0]?.id || null);
  const [showBookApt, setShowBookApt] = useState(false);
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [aptForm, setAptForm] = useState({ petId: myPets[0]?.id || "", date: "", time: "10:00", type: "New Visit", notes: "" });
  const [walkReason, setWalkReason] = useState("");
  const [walkPetId, setWalkPetId] = useState(myPets[0]?.id || "");

  // Book appointment modal
  const bookAppointment = async () => {
    if (!aptForm.petId || !aptForm.date) { toast("Select a pet and date", "error"); return; }
    const newAppointment = { id: db.appointments.length + 1, petId: parseInt(aptForm.petId), ownerId: owner.id, date: aptForm.date, time: aptForm.time, type: aptForm.type, status: "pending", notes: aptForm.notes, source: "owner-portal" };
    db.appointments.push(newAppointment);
    try {
      const created = await createAppointment(newAppointment);
      if (created?.id) {
        db.appointments = db.appointments.map((item) => item === newAppointment ? { ...newAppointment, id: created.id } : item);
      }
      saveDB();
      toast("✅ Appointment requested! Clinic will confirm shortly.", "success");
      setShowBookApt(false);
      setAptForm({ petId: myPets[0]?.id || "", date: "", time: "10:00", type: "New Visit", notes: "" });
    } catch (error) {
      db.appointments = db.appointments.filter((item) => item !== newAppointment);
      toast(error.message || "Could not submit appointment request.", "error");
    }
  };

  // Walk-in request modal
  const requestWalkIn = () => {
    if (!walkPetId || !walkReason) { toast("Select a pet and describe the issue", "error"); return; }
    const pet = db.pets.find(p => p.id === parseInt(walkPetId));
    const caseNum = genCase(db);
    db.visits.push({ id: db.visits.length + 1, petId: parseInt(walkPetId), caseNum, date: todayStr(), status: "waiting", reason: walkReason, emergency: false, temp: "", hr: "", rr: "", weight: pet?.weight || 0, diagnosis: "", notes: "", doctorId: 1, source: "owner-portal" });
    saveDB();
    toast(`✅ Walk-in registered! Case: ${caseNum}. Please come to the clinic.`, "success");
    setShowWalkIn(false);
    setWalkReason("");
  };

  // Shared modals (rendered once, available across all pages)
  const Modals = () => (
    <>
      {showBookApt && (
        <div className="ov" onClick={() => setShowBookApt(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="m-head">
              <span className="m-title">📅 Book an Appointment</span>
              <button className="btn-ico" onClick={() => setShowBookApt(false)} style={{ fontSize: 16 }}>✕</button>
            </div>
            <div className="m-body">
              <div className="alert a-info" style={{ marginBottom: 16 }}>Your appointment request will be sent to the clinic. You'll receive confirmation shortly.</div>
              <div className="inp-row cols2">
                <div className="inp-g">
                  <label className="inp-lbl">Select Pet *</label>
                  <select className="inp" value={aptForm.petId} onChange={e => setAptForm({ ...aptForm, petId: e.target.value })}>
                    <option value="">Choose your pet...</option>
                    {myPets.map(p => <option key={p.id} value={p.id}>{p.photo} {p.name} - {p.breed}</option>)}
                  </select>
                </div>
                <div className="inp-g">
                  <label className="inp-lbl">Visit Type</label>
                  <select className="inp" value={aptForm.type} onChange={e => setAptForm({ ...aptForm, type: e.target.value })}>
                    {["New Visit", "Follow-up", "Vaccination", "Deworming", "Grooming", "Check-up", "Emergency"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="inp-g">
                  <label className="inp-lbl">Preferred Date *</label>
                  <input type="date" className="inp" min={todayStr()} value={aptForm.date} onChange={e => setAptForm({ ...aptForm, date: e.target.value })} />
                </div>
                <div className="inp-g">
                  <label className="inp-lbl">Preferred Time</label>
                  <select className="inp" value={aptForm.time} onChange={e => setAptForm({ ...aptForm, time: e.target.value })}>
                    {["09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="inp-g">
                <label className="inp-lbl">Describe the issue / reason for visit</label>
                <textarea className="inp" rows={3} placeholder="e.g. Not eating for 2 days, limping, annual vaccination, etc." value={aptForm.notes} onChange={e => setAptForm({ ...aptForm, notes: e.target.value })} />
              </div>
              {/* Doctor info */}
              <div style={{ padding: "12px 16px", background: "var(--canvas)", borderRadius: 10, border: "1px solid var(--bdr2)", marginTop: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--txt3)", textTransform: "uppercase", marginBottom: 6 }}>Clinic & Doctor</div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ fontSize: 32 }}>👨‍⚕️</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{db.clinicSettings.doctor}</div>
                    <div style={{ fontSize: 12, color: "var(--txt2)" }}>{db.clinicSettings.name}</div>
                    <div style={{ fontSize: 12, color: "var(--txt3)" }}>📍 {db.clinicSettings.address}</div>
                    <div style={{ fontSize: 12, color: "var(--txt3)" }}>📞 {db.clinicSettings.phone}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="m-foot">
              <button className="btn btn-ghost" onClick={() => setShowBookApt(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={bookAppointment}>📅 Request Appointment</button>
            </div>
          </div>
        </div>
      )}

      {showWalkIn && (
        <div className="ov" onClick={() => setShowWalkIn(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="m-head">
              <span className="m-title">🚶 Walk-in Visit Request</span>
              <button className="btn-ico" onClick={() => setShowWalkIn(false)} style={{ fontSize: 16 }}>✕</button>
            </div>
            <div className="m-body">
              <div className="alert a-warn" style={{ marginBottom: 16 }}>Walk-in visits are served on a first-come, first-served basis. For emergencies, please come directly to the clinic.</div>
              <div className="inp-g">
                <label className="inp-lbl">Select Pet *</label>
                <select className="inp" value={walkPetId} onChange={e => setWalkPetId(e.target.value)}>
                  {myPets.map(p => <option key={p.id} value={p.id}>{p.photo} {p.name} - {p.breed}</option>)}
                </select>
              </div>
              <div className="inp-g">
                <label className="inp-lbl">Describe the Problem *</label>
                <textarea className="inp" rows={3} placeholder="Describe what's wrong. e.g. vomiting since morning, not eating, skin rash..." value={walkReason} onChange={e => setWalkReason(e.target.value)} />
              </div>
              <div style={{ padding: "12px 14px", background: "var(--canvas)", borderRadius: 9, fontSize: 12, color: "var(--txt2)" }}>
                📍 <strong>{db.clinicSettings.address}</strong><br />
                📞 <strong>{db.clinicSettings.phone}</strong><br />
                ⏰ <strong>Mon-Sat: 9:00 AM - 7:00 PM</strong>
              </div>
            </div>
            <div className="m-foot">
              <button className="btn btn-ghost" onClick={() => setShowWalkIn(false)}>Cancel</button>
              <button className="btn btn-ink" onClick={requestWalkIn}>🚶 Register Walk-in</button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // "?"? Page: My Pets (home) "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?

  if (page === "owner-home") {
    return (
      <div className="fu">
        <div className="pt" style={{ marginBottom: 18 }}>My Pets 🐾</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
          {myPets.map(pet => {
            const visits = db.visits.filter(v => v.petId === pet.id);
            const lastVisit = visits.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            return (
              <div key={pet.id} className="pcard" style={{ background: `linear-gradient(135deg,var(--white) 60%,${pet.color})` }}>
                <div className="pava" style={{ background: pet.color, fontSize: 36, width: 70, height: 70 }}>{pet.photo}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700 }}>{pet.name}</div>
                  <div style={{ fontSize: 13, color: "var(--txt2)", marginTop: 2 }}>{pet.breed} · {pet.type}</div>
                  <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 2 }}>{calcAge(pet.dob)} · {pet.sex} · {pet.weight}kg</div>
                  <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 6 }}>Last visit: {lastVisit ? fmt(lastVisit.date) : "No visits"}</div>
                  {pet.alerts.length > 0 && <div style={{ marginTop: 8 }}>{pet.alerts.map((a, i) => <span key={i} className="badge b-emg" style={{ fontSize: 10 }}>⚠️ {a}</span>)}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (page === "owner-records") {
    const allVisits = myPets.flatMap(p => db.visits.filter(v => v.petId === p.id).map(v => ({ ...v, pet: p }))).sort((a, b) => new Date(b.date) - new Date(a.date));
    return (
      <div className="fu">
        <div className="pt" style={{ marginBottom: 18 }}>Medical Records 📜</div>
        <div className="tl">
          {allVisits.map((v, i) => (
            <div key={v.id} className="tl-item">
              <div className="tl-dot" />
              <div className="tl-dt">{fmt(v.date)} - {v.pet.name}</div>
              <div className="tl-box">
                <div className="tl-t">🩺 {v.diagnosis || "Clinic Visit"}</div>
                <div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 2 }}>{v.reason}</div>
                {v.notes && <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 3 }}>📝 {v.notes}</div>}
                <span className="case-pill" style={{ fontSize: 10, display: "inline-block", marginTop: 6 }}>{v.caseNum}</span>
              </div>
            </div>
          ))}
          {allVisits.length === 0 && <div style={{ textAlign: "center", padding: 30, color: "var(--txt3)" }}>No visit records yet</div>}
        </div>
      </div>
    );
  }

  if (page === "owner-vaccines") {
    const myVaccs = myPets.flatMap(p => db.vaccinations.filter(v => v.petId === p.id).map(v => ({ ...v, pet: p })));
    return (
      <div className="fu">
        <div className="pt" style={{ marginBottom: 18 }}>Vaccination Card 💉</div>
        {myPets.map(pet => {
          const petVaccs = myVaccs.filter(v => v.pet.id === pet.id);
          return (
            <div key={pet.id} className="card" style={{ marginBottom: 16 }}>
              <div className="card-head" style={{ background: "linear-gradient(135deg,var(--ink),var(--ink-soft))", borderRadius: "var(--r-lg) var(--r-lg) 0 0" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ fontSize: 28 }}>{pet.photo}</div>
                  <div style={{ color: "#fff" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700 }}>{pet.name}</div>
                    <div style={{ fontSize: 12, opacity: .7 }}>{pet.breed} · {calcAge(pet.dob)}</div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {petVaccs.map(v => (
                  <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "1px solid var(--bdr3)" }}>
                    <div style={{ fontSize: 22 }}>💉</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{v.vaccine}</div>
                      <div style={{ fontSize: 12, color: "var(--txt2)" }}>Given: {fmt(v.given)} · Next: {fmt(v.next)}</div>
                    </div>
                    <span className={`badge ${v.status === "ok" ? "b-bill" : v.status === "due" ? "b-wait" : "b-emg"}`}>{v.status === "ok" ? "✅ Current" : v.status === "due" ? "⏰ Due" : "🔴 Overdue"}</span>
                  </div>
                ))}
                {petVaccs.length === 0 && <div style={{ textAlign: "center", padding: 16, color: "var(--txt3)" }}>No vaccination records for {pet.name}</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (page === "owner-appointments") {
    const myApts = myPets.flatMap(p => db.appointments.filter(a => a.petId === p.id).map(a => ({ ...a, pet: p }))).sort((a, b) => new Date(a.date) - new Date(b.date));
    return (
      <div className="fu">
        <div className="pt" style={{ marginBottom: 18 }}>My Appointments 📅</div>
        {myApts.map(a => (
          <div key={a.id} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 16px", background: "var(--white)", borderRadius: "var(--r)", border: "1px solid var(--bdr2)", marginBottom: 10 }}>
            <div style={{ fontSize: 28 }}>{a.pet.photo}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{a.pet.name} - {a.type}</div>
              <div style={{ fontSize: 13, color: "var(--txt2)", marginTop: 2 }}>{fmt(a.date)} at {a.time}</div>
              {a.notes && <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 2 }}>📝 {a.notes}</div>}
            </div>
            <span className={`badge ${a.status === "confirmed" ? "b-bill" : "b-wait"}`}>{a.status}</span>
          </div>
        ))}
        {myApts.length === 0 && <div className="card" style={{ padding: 32, textAlign: "center", color: "var(--txt3)" }}>No appointments scheduled</div>}
      </div>
    );
  }

  if (page === "owner-prescriptions") {
    const myPrescriptions = myPets.flatMap(p => {
      const petVisits = db.visits.filter(v => v.petId === p.id);
      return petVisits.flatMap(v => {
        const rx = db.prescriptions.find(r => r.visitId === v.id);
        return rx ? [{ ...rx, visit: v, pet: p }] : [];
      });
    });
    return (
      <div className="fu">
        <div className="pt" style={{ marginBottom: 18 }}>My Prescriptions 💊</div>
        {myPrescriptions.map(rx => (
          <div key={rx.id} className="card" style={{ marginBottom: 16 }}>
            <div className="card-head">
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ fontSize: 22 }}>{rx.pet.photo}</span><div><div className="card-title" style={{ fontSize: 15 }}>{rx.pet.name} - {rx.visit.diagnosis}</div><div style={{ fontSize: 12, color: "var(--txt3)" }}>{fmt(rx.visit.date)}</div></div></div>
              <span className="case-pill">{rx.visit.caseNum}</span>
            </div>
            <div className="card-body">
              {rx.medicines.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < rx.medicines.length - 1 ? "1px dashed var(--bdr)" : "none" }}>
                  <div style={{ background: "var(--ink)", color: "#fff", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 3 }}>{i + 1}</div>
                  <div><div style={{ fontWeight: 700 }}>{m.name}</div><div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 2 }}>Dose: {m.dose} · Duration: {m.duration} · {m.instruction}</div></div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {myPrescriptions.length === 0 && <div className="card" style={{ padding: 32, textAlign: "center", color: "var(--txt3)" }}>No prescriptions on file</div>}
      </div>
    );
  }

  return null;
}

// ...............................................................................
// MAIN APP
// ...............................................................................

export default function App() {
  const [authView, setAuthView] = useState("login"); // login | register
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [db, setDB] = useState(initDB);
  const [toasts, setToasts] = useState([]);
  const [consultVisit, setConsultVisit] = useState(null);
  const [vaccinationPrefill, setVaccinationPrefill] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const [sessionTimer, setSessionTimer] = useState(null);
  const [idleWarning, setIdleWarning] = useState(false);
  const idleRef = useRef(null);
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const loadSessions = useCallback((u, token) => {
    try {
      const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "[]");
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      const exists = stored.find((s) => s.userId === u.id);
      const updated = exists
        ? stored.map((s) => s.userId === u.id ? { ...s, token, loginTime: timeStr, name: u.name, role: u.role, avatar: u.avatar } : s)
        : [...stored, { userId: u.id, name: u.name, role: u.role, avatar: u.avatar, loginTime: timeStr, token }];
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      setActiveSessions(updated);
    } catch {}
  }, []);

  const hydrateSession = useCallback(async (session, options = {}) => {
    const token = session?.token || getStoredToken();
    if (!token) throw new Error("Missing session token");
    const [freshUser, bootstrap] = await Promise.all([
      apiRequest("/me", {}, token),
      apiRequest("/bootstrap", {}, token),
    ]);
    const nextDb = normalizeDbSnapshot(bootstrap);
    localStorage.setItem(DB_KEY, JSON.stringify(nextDb));
    setStoredToken(token);
    setDB(nextDb);
    setUser(freshUser);
    setPage(options.page || (freshUser.role === "owner" ? "owner-home" : "dashboard"));
    loadSessions(freshUser, token);
    return { user: freshUser, db: nextDb };
  }, [loadSessions]);

  const syncDbToServer = useCallback(async (snapshot) => {
    if (!user || user.role === "owner") return;
    const token = getStoredToken();
    if (!token) return;
    const resources = toServerResourceMap(snapshot);
    const tables = MUTABLE_TABLES_BY_ROLE[user.role] || [];

    await Promise.all(tables.map(async (table) => {
      const rows = resources[table];
      if (!rows) return;
      await apiRequest(`/${table}`, {
        method: "PUT",
        body: JSON.stringify(rows),
      }, token);
    }));
  }, [user]);

  // "?"? Restore session on mount "?"?
  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;
    hydrateSession({ token }).catch(() => {
      clearStoredToken();
      setUser(null);
    });
  }, [hydrateSession]);

  // "?"? Activity tracking + idle timer "?"?
  useEffect(() => {
    if (!user) return;
    const resetIdle = () => {
      setIdleWarning(false);
      clearTimeout(idleRef.current);
      idleRef.current = setTimeout(() => {
        setIdleWarning(true);
        clearTimeout(idleRef.current);
        idleRef.current = setTimeout(() => {
          logout(true); // auto-logout
        }, 60000); // 1 min warning then logout
      }, SESSION_TIMEOUT);
    };
    const events = ["mousedown","keydown","touchstart","scroll"];
    events.forEach(e => window.addEventListener(e, resetIdle));
    resetIdle();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdle));
      clearTimeout(idleRef.current);
    };
  }, [user]);

  const saveDB = useCallback((nextDb = db) => {
    const snapshot = { ...nextDb };
    localStorage.setItem(DB_KEY, JSON.stringify(snapshot));
    setDB(snapshot);
    void syncDbToServer(snapshot).catch((error) => {
      console.error("Background sync failed", error);
    });
  }, [db, syncDbToServer]);

  const toast = useCallback((msg, type = "") => {
    const id = Date.now();
    const icons = { success: "✅", error: "⚠️", warning: "⚡", "": "ℹ️" };
    setToasts(prev => [...prev, { id, msg, type, icon: icons[type] }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  // Activity log writer
  const logActivity = useCallback((action, details, type = "") => {
    const now = new Date();
    const entry = {
      time: now.toLocaleString("en-IN"),
      user: user?.name || "System",
      action,
      details,
      type
    };
    db.activityLog = db.activityLog || [];
    db.activityLog.push(entry);
    if (db.activityLog.length > 200) db.activityLog = db.activityLog.slice(-200);
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }, [user, db]);

  const doLogin = async (session) => {
    const result = await hydrateSession(session);
    toast(`Welcome back, ${result.user.name.split(" ")[0]}! 👋`, "success");
  };

  const logout = (auto = false) => {
    if (user) {
      logActivity("LOGOUT", auto ? "Session auto-expired (idle timeout)" : "User signed out manually", auto ? "warning" : "");
    }
    clearStoredToken();
    // Remove from sessions
    try {
      const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "[]");
      const updated = stored.filter((s) => s.userId !== user?.id);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      setActiveSessions(updated);
    } catch {}
    setUser(null);
    setPage("dashboard");
    setAuthView("login");
    setIdleWarning(false);
    if (auto) toast("Session expired - please sign in again.", "warning");
  };

  const switchUser = async (targetUserId) => {
    if (targetUserId === null) {
      // Add new account ?" show login screen without clearing current session
      setUser(null);
      setAuthView("login");
    } else {
      // Switch to existing session
      const sessions = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "[]");
      const target = sessions.find(s => s.userId === targetUserId);
      if (!target) return;
      try {
        const result = await hydrateSession(target);
        toast(`Switched to ${result.user.name}`, "success");
      } catch (error) {
        toast(error.message || "Could not switch session.", "error");
      }
    }
  };

  const createAppointment = useCallback(async (appointment) => {
    const payload = {
      petId: Number(appointment.petId),
      ownerId: appointment.ownerId ? Number(appointment.ownerId) : undefined,
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes,
      source: appointment.source,
    };
    return apiRequest("/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }, []);

  const setPageWithDB = (p) => setPage(p);
  const openVaccinationForPet = (petId) => {
    setVaccinationPrefill({ petId, ts: Date.now() });
    setPage("vaccination");
  };
  const clearVaccinationPrefill = () => setVaccinationPrefill(null);

  // "?"? Role-based page guards "?"?
  const ROLE_PAGES = {
    admin: ["dashboard","queue","planner","appointments","patients","consultation","vaccination","timeline","certificates","billing","inventory","suppliers","analytics","reminders","system-admin","settings","admin-users","admin-sessions","admin-activity"],
    doctor: ["dashboard","queue","planner","appointments","patients","consultation","vaccination","timeline","certificates","billing","inventory","suppliers","analytics","reminders","settings"],
    receptionist: ["dashboard","queue","planner","appointments","patients","consultation","vaccination","timeline","certificates"],
    owner: ["owner-home","owner-petinfo","owner-book-apt","owner-records","owner-vaccines","owner-appointments","owner-prescriptions"],
  };

  const canAccess = (pg) => {
    if (!user) return false;
    const allowed = ROLE_PAGES[user.role] || [];
    return allowed.includes(pg);
  };

  if (!user) {
    if (authView === "register") return (
      <>
        <GlobalStyles />
        <RegisterPage onBack={() => setAuthView("login")} onSuccess={() => { toast("Account created! Please sign in.","success"); setAuthView("login"); }} />
        <ToastContainer toasts={toasts} />
      </>
    );
    return (
      <>
        <GlobalStyles />
        <LoginPage onLogin={doLogin} goRegister={() => setAuthView("register")} activeSessions={activeSessions} onSwitchUser={switchUser} />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  const isOwner = user.role === "owner";
  const renderPage = () => {
    if (isOwner) return <OwnerPortal page={page} user={user} />;
    // Protected route check
    if (!canAccess(page)) {
      return (
        <div className="fu" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64 }}>🔒</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, margin: "16px 0 8px" }}>Access Restricted</div>
            <div style={{ fontSize: 14, color: "var(--txt2)", marginBottom: 20 }}>Your role ({user.role}) doesn't have access to this page.</div>
            <button className="btn btn-gold" onClick={() => setPage("dashboard")}>← Back to Dashboard</button>
          </div>
        </div>
      );
    }
    switch (page) {
      case "dashboard": return <Dashboard user={user} setPage={setPageWithDB} />;
      case "queue": return <QueuePage setPage={setPageWithDB} setConsultVisit={setConsultVisit} />;
      case "planner": return <PlannerPage />;
      case "appointments": return <AppointmentsPage />;
      case "patients": return <PatientsPage setPage={setPageWithDB} setConsultVisit={setConsultVisit} onAddVaccine={openVaccinationForPet} />;
      case "consultation": return <ConsultationPage consultVisit={consultVisit} />;
      case "vaccination": return <VaccinationPage prefill={vaccinationPrefill} clearPrefill={clearVaccinationPrefill} />;
      case "timeline": return <TimelinePage />;
      case "certificates": return <CertificatesPage />;
      case "billing": return <BillingPage />;
      case "inventory": return <InventoryPage />;
      case "suppliers": return <SuppliersPage />;
      case "analytics": return <AnalyticsPage />;
      case "reminders": return <RemindersPage />;
      case "system-admin":
      case "admin-users":
      case "admin-sessions":
      case "admin-activity":
        return <SystemAdminPage initialTab={page === "admin-users" ? "users" : page === "admin-sessions" ? "sessions" : page === "admin-activity" ? "activity" : "users"} />;
      case "settings": return <SettingsPage />;
      default: return <Dashboard user={user} setPage={setPageWithDB} />;
    }
  };

  const ctx = { db, saveDB, toast, logActivity, user, createAppointment };

  return (
    <AppCtx.Provider value={ctx}>
      <GlobalStyles />
      {/* Idle timeout warning banner */}
      {idleWarning && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9998, background: "#e67e22", color: "#fff", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14, fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,.2)" }}>
          <span>⏰ Your session is about to expire due to inactivity. Click anywhere to stay logged in.</span>
          <button onClick={() => setIdleWarning(false)} style={{ background: "rgba(255,255,255,.2)", border: "none", color: "#fff", padding: "4px 14px", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}>Dismiss</button>
        </div>
      )}
      <div className="shell" style={{ marginTop: idleWarning ? 40 : 0 }}>
        <Sidebar page={page} setPage={setPageWithDB} user={user} collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="main">
          <Topbar page={page} setPage={setPageWithDB} user={user} onLogout={logout} onSwitchUser={switchUser} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} activeSessions={activeSessions} />
          <div className="content">{renderPage()}</div>
        </div>
      </div>
      <ToastContainer toasts={toasts} />
    </AppCtx.Provider>
  );
}












