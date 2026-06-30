const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
export const TOKEN_KEY = "rpc_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const apiRequest = async (path, options = {}, tokenOverride) => {
  const token = tokenOverride ?? getToken();
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  let payload = {};
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    payload = await res.json().catch(() => ({}));
  } else if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text?.slice(0, 120) || `Server error (${res.status})`);
  }

  if (!res.ok) {
    const message = payload?.error?.message || payload?.error || payload?.message || `Request failed (${res.status})`;
    throw new Error(typeof message === "string" ? message : "Request failed");
  }

  return payload?.data ?? payload;
};

export const fetchBootstrap = () => apiRequest("/bootstrap");
export const fetchMe = () => apiRequest("/me");

export const fetchUsers = () => apiRequest("/users");
export const createUser = (body) => apiRequest("/users", { method: "POST", body: JSON.stringify(body) });
export const updateUser = (id, body) => apiRequest(`/users/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteUser = (id) => apiRequest(`/users/${id}`, { method: "DELETE" });

export const updatePet = (id, body) => apiRequest(`/pets/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const createTreatment = (body) => apiRequest("/treatments", { method: "POST", body: JSON.stringify(body) });
export const createAppointment = (body) => apiRequest("/appointments", { method: "POST", body: JSON.stringify(body) });
export const deductInventory = (visitId, medicines) =>
  apiRequest(`/treatments/${visitId}/deduct-inventory`, { method: "POST", body: JSON.stringify({ medicines }) });

export const fetchReminders = () => apiRequest("/reminders");
export const syncReminders = () => apiRequest("/reminders/sync", { method: "POST" });
export const sendReminder = (body) => apiRequest("/reminders/send", { method: "POST", body: JSON.stringify(body) });
export const sendAllReminders = (reminderIds) =>
  apiRequest("/reminders/send", { method: "POST", body: JSON.stringify({ reminderIds }) });

export const fetchActivityLogs = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiRequest(`/activity-logs${qs ? `?${qs}` : ""}`);
};
export const clearActivityLogs = () => apiRequest("/activity-logs", { method: "DELETE" });

export const fetchBackups = () => apiRequest("/admin/backups");
export const createBackup = (label) => apiRequest("/admin/backups", { method: "POST", body: JSON.stringify({ label }) });
export const restoreBackup = (id) => apiRequest(`/admin/backups/${id}/restore`, { method: "POST" });
export const restoreBackupUpload = (file) => {
  const form = new FormData();
  form.append("file", file);
  return apiRequest("/admin/backups/restore-upload", { method: "POST", body: form });
};

export const downloadBackupExport = async (backupId) => {
  const token = getToken();
  const qs = backupId ? `?id=${encodeURIComponent(backupId)}` : "";
  const res = await fetch(`${API_BASE_URL}/admin/backups/download${qs}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    const message = payload?.error?.message || payload?.message || `Download failed (${res.status})`;
    throw new Error(typeof message === "string" ? message : "Download failed");
  }
  const blob = await res.blob();
  const disposition = res.headers.get("content-disposition") || "";
  const match = disposition.match(/filename="([^"]+)"/);
  const filename = match?.[1] || `royalpet-backup-${new Date().toISOString().split("T")[0]}.json`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const downloadImportTemplate = (type) => apiRequest(`/import/template/${type}`);
export const importCsv = (type, file) => {
  const form = new FormData();
  form.append("file", file);
  return apiRequest(`/import/${type}`, { method: "POST", body: form });
};

export const uploadFile = (file) => {
  const form = new FormData();
  form.append("file", file);
  return apiRequest("/uploads", { method: "POST", body: form });
};

export const changePassword = (currentPassword, newPassword) =>
  apiRequest("/me/password", { method: "PATCH", body: JSON.stringify({ currentPassword, newPassword }) });
