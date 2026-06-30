/**
 * Royal Pet Clinic table/collection schemas.
 * Used by the Appwrite adapter for column validation and metadata.
 */

const TABLE_COLUMNS = {
  users: ["id", "name", "email", "password", "role", "mobile", "avatar", "active", "lastLogin", "ownerId", "createdAt", "updatedAt"],
  owners: ["id", "name", "mobile", "email", "address", "createdAt", "updatedAt"],
  pets: ["id", "name", "type", "breed", "dob", "age", "sex", "weight", "ownerId", "photo", "alerts", "color", "createdAt", "updatedAt"],
  visits: ["id", "petId", "caseNum", "date", "status", "reason", "temp", "hr", "rr", "weight", "diagnosis", "notes", "doctorId", "emergency", "inventoryDeducted", "imaging", "source", "createdAt", "updatedAt"],
  prescriptions: ["id", "visitId", "medicines", "createdAt", "updatedAt"],
  appointments: ["id", "petId", "ownerId", "date", "time", "type", "status", "notes", "source", "createdAt", "updatedAt"],
  vaccinations: ["id", "petId", "vaccine", "given", "next", "batch", "status", "createdAt", "updatedAt"],
  inventory: ["id", "name", "category", "stock", "unit", "minStock", "batch", "expiry", "price", "vendor", "createdAt", "updatedAt"],
  invoices: ["id", "visitId", "petId", "ownerId", "date", "items", "total", "status", "method", "createdAt", "updatedAt"],
  activity_log: ["id", "time", "user", "action", "details", "type"],
  clinic_settings: ["id", "name", "doctor", "phone", "email", "address", "regNum", "consultFee", "currency", "createdAt", "updatedAt"],
  backup_logs: ["id", "label", "trigger", "createdBy", "rowCount", "snapshot", "createdAt"],
  reminders: ["id", "type", "refId", "title", "message", "dueDate", "status", "createdAt", "updatedAt"],
  role_permissions: ["id", "feature", "role", "allowed", "createdAt", "updatedAt"],
  supplier_payments: ["id", "vendor", "item", "qty", "unitPrice", "total", "date", "status", "notes", "createdAt", "updatedAt"],
  planner_tasks: ["id", "userId", "date", "time", "title", "notes", "done", "createdAt", "updatedAt"],
};

const JSON_FIELDS = {
  pets: ["alerts"],
  prescriptions: ["medicines"],
  invoices: ["items"],
  backup_logs: ["snapshot"],
  visits: ["imaging"],
};

const TABLE_LIST = Object.keys(TABLE_COLUMNS);

const getTableColumns = (table) => TABLE_COLUMNS[table] || [];

const hasColumn = (table, column) => getTableColumns(table).includes(column);

module.exports = {
  TABLE_COLUMNS,
  TABLE_LIST,
  JSON_FIELDS,
  getTableColumns,
  hasColumn,
};
