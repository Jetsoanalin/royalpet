#!/usr/bin/env python3
from pathlib import Path
p = Path("src/pages/RoyalPetClinicApp.jsx")
t = p.read_text(encoding="utf-8")

def rep(old, new, label):
    global t
    if old not in t:
        print(f"SKIP: {label}")
        return
    t = t.replace(old, new, 1)
    print(f"OK: {label}")

# Patients breed/age
rep(
  '  const [form, setForm] = useState({ ownerName: "", mobile: "", email: "", address: "", petName: "", type: "Dog", breed: "", dob: "", sex: "Male", weight: "" });',
  '  const [form, setForm] = useState({ ownerName: "", mobile: "", email: "", address: "", petName: "", type: "Dog", breed: "", dob: "", age: "", useAge: false, sex: "Male", weight: "" });\n  const breedOptions = BREEDS_BY_TYPE[form.type] || BREEDS_BY_TYPE.Other;',
  'patients-form')

rep(
  '''  const registerPet = () => {
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
  };''',
  '''  const registerPet = () => {
    const { ownerName, mobile, petName, type, breed, dob, age, useAge, sex, weight } = form;
    if (!ownerName || !mobile || !petName) { toast("Fill all required fields", "error"); return; }
    let owner = db.owners.find(o => o.mobile === mobile);
    if (!owner) {
      owner = { id: db.owners.length + 1, name: ownerName, mobile, email: form.email, address: form.address };
      db.owners.push(owner);
    }
    const resolvedDob = useAge && age ? dobFromAge(age) : (dob || "");
    db.pets.push({ id: db.pets.length + 1, name: petName, type, breed, dob: resolvedDob || "2023-01-01", age: useAge ? age : "", sex, weight: parseFloat(weight) || 0, ownerId: owner.id, photo: type === "Dog" ? "🐕" : type === "Cat" ? "🐱" : type === "Bird" ? "🦜" : type === "Rabbit" ? "🐇" : type === "Cattle" ? "🐄" : type === "Horse" ? "🐎" : type === "Reptile" ? "🦎" : type === "Fish" ? "🐟" : "🐾", alerts: [], color: "#f5f0e8" });
    saveDB();
    toast(`${petName} registered successfully!`, "success");
    setShowModal(false);
    setForm({ ownerName: "", mobile: "", email: "", address: "", petName: "", type: "Dog", breed: "", dob: "", age: "", useAge: false, sex: "Male", weight: "" });
  };''',
  'register-pet')

rep(
  '''                  <div className="inp-g" style={{ marginBottom: 10 }}><label className="inp-lbl">Animal Type</label><select className="inp" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{["Dog", "Cat", "Bird", "Rabbit", "Cattle", "Horse", "Reptile", "Fish", "Hamster", "Guinea Pig", "Other"].map(t => <option key={t}>{t}</option>)}</select></div>
                  <div className="inp-g" style={{ marginBottom: 10 }}><label className="inp-lbl">Breed</label><input className="inp" placeholder="Breed" value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })} /></div>
                  <div className="inp-g" style={{ marginBottom: 0 }}><label className="inp-lbl">Date of Birth</label><input type="date" className="inp" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} /></div>''',
  '''                  <div className="inp-g" style={{ marginBottom: 10 }}><label className="inp-lbl">Animal Type</label><select className="inp" value={form.type} onChange={e => setForm({ ...form, type: e.target.value, breed: "" })}>{["Dog", "Cat", "Bird", "Rabbit", "Cattle", "Horse", "Reptile", "Fish", "Hamster", "Guinea Pig", "Other"].map(t => <option key={t}>{t}</option>)}</select></div>
                  <div className="inp-g" style={{ marginBottom: 10 }}><label className="inp-lbl">Breed</label><select className="inp" value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })}><option value="">Select breed...</option>{breedOptions.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                  <div className="inp-g" style={{ marginBottom: 10 }}><label style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, fontWeight:600, marginBottom:6 }}><input type="checkbox" checked={form.useAge} onChange={e => setForm({ ...form, useAge: e.target.checked })} />Use age instead of DOB</label>{form.useAge ? <input className="inp" type="number" step="0.1" placeholder="Age in years" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} /> : <input type="date" className="inp" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />}</div>''',
  'breed-ui')

# Helpers before SectionBox
helpers = '''
function ImagingGallery({ imaging = [] }) {
  if (!imaging?.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
      {imaging.map((img, i) => (
        <a key={i} href={img.data || img.path} target="_blank" rel="noreferrer">
          <img src={img.data || img.path} alt={img.name || "scan"} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "1px solid var(--bdr)", cursor: "pointer" }} />
        </a>
      ))}
    </div>
  );
}

function VitalSelect({ vitalKey, label, unit, norm, value, onChange }) {
  const opts = VITAL_OPTIONS[vitalKey] || [];
  const showCustom = value && !opts.includes(value);
  return (
    <div className="vbox">
      <select style={{ border:"none", background:"transparent", textAlign:"center", fontFamily:"'JetBrains Mono',monospace", fontSize:20, fontWeight:500, color:"var(--ink)", width:"100%", outline:"none" }}
        value={showCustom ? "Custom" : (value || "—")} onChange={e => { if (e.target.value === "Custom") onChange(""); else onChange(e.target.value === "—" ? "" : e.target.value); }}>
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {(showCustom || !value) && <input style={{ border:"1px solid var(--bdr)", borderRadius:6, textAlign:"center", fontSize:12, marginTop:4, width:"100%", padding:"4px" }} value={value} onChange={e => onChange(e.target.value)} placeholder="Custom" />}
      <div className="vunit">{unit}</div>
      <div className="vlbl">{label}</div>
      {norm && <div style={{fontSize:9,color:"var(--txt4)",marginTop:2}}>Normal: {norm}</div>}
    </div>
  );
}

'''
rep('function SectionBox({ title, icon, children }) {', helpers + 'function SectionBox({ title, icon, children }) {', 'helpers')

# Billing
rep('function BillingPage() {', 'function BillingPage({ setPage }) {', 'billing-fn')

# Inventory expiry default
rep('expiry: "", price: "", vendor: "" });', 'expiry: todayStr(), price: "", vendor: "" });', 'inv-expiry')

# Owner apt date default  
rep('const [aptForm, setAptForm] = useState({ petId: myPets[0]?.id || "", date: "", time: "10:00", type: "New Visit", notes: "" });',
    'const [aptForm, setAptForm] = useState({ petId: myPets[0]?.id || "", date: todayStr(), time: "10:00", type: "New Visit", notes: "" });', 'apt-date')

p.write_text(t, encoding="utf-8")
print("Done part 3")
