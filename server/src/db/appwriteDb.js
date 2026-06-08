const { getDatabases, ID, Query } = require("./appwriteClient");
const { getTableColumns, JSON_FIELDS } = require("./schema");
const env = require("../config/env");

const PAGE_SIZE = 100;

const parseJsonField = (table, row) => {
  const fields = JSON_FIELDS[table] || [];
  const out = { ...row };
  fields.forEach((field) => {
    if (out[field] === undefined || out[field] === null) return;
    if (typeof out[field] === "string") {
      try {
        out[field] = JSON.parse(out[field]);
      } catch {
        /* keep string */
      }
    }
  });
  return out;
};

const serializePayload = (table, payload) => {
  const fields = JSON_FIELDS[table] || [];
  const out = { ...payload };
  fields.forEach((field) => {
    if (out[field] !== undefined && out[field] !== null && typeof out[field] !== "string") {
      out[field] = JSON.stringify(out[field]);
    }
  });
  Object.keys(out).forEach((key) => {
    if (out[key] instanceof Date) out[key] = out[key].toISOString();
  });
  return out;
};

const docToRow = (doc, table) => {
  const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...rest } = doc;
  const row = parseJsonField(table, { ...rest, _docId: $id });
  if (row.id !== undefined) row.id = Number(row.id);
  return row;
};

const listAllRows = async (table, queries = []) => {
  const db = getDatabases();
  const rows = [];
  let offset = 0;

  while (true) {
    const page = await db.listDocuments(env.APPWRITE_DATABASE_ID, table, [
      ...queries,
      Query.limit(PAGE_SIZE),
      Query.offset(offset),
    ]);
    rows.push(...page.documents.map((doc) => docToRow(doc, table)));
    if (page.documents.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return rows;
};

const getNextId = async (table) => {
  const rows = await listAllRows(table, [Query.orderDesc("id"), Query.limit(1)]);
  return rows.length ? Number(rows[0].id) + 1 : 1;
};

class WhereBuilder {
  constructor(parent) {
    this.parent = parent;
    this.groups = [];
    this.current = [];
  }

  where(keyOrObj, op, value) {
    if (typeof keyOrObj === "function") {
      const nested = new WhereBuilder(this.parent);
      keyOrObj(nested);
      this.current.push({ type: "group", group: nested, join: "and" });
      return this;
    }
    if (typeof keyOrObj === "object") {
      Object.entries(keyOrObj).forEach(([k, v]) => this.current.push({ type: "eq", field: k, value: v, join: "and" }));
      return this;
    }
    if (arguments.length === 2) {
      this.current.push({ type: "eq", field: normalizeField(keyOrObj), value: op, join: "and" });
      return this;
    }
    if (op === "like") {
      this.current.push({ type: "like", field: normalizeField(keyOrObj), value, join: "and" });
      return this;
    }
    if (op === ">=" || op === "<=" || op === ">" || op === "<") {
      this.current.push({ type: op, field: normalizeField(keyOrObj), value, join: "and" });
      return this;
    }
    this.current.push({ type: "eq", field: normalizeField(keyOrObj), value: op, join: "and" });
    return this;
  }

  orWhere(field, op, value) {
    if (op === "like") {
      this.current.push({ type: "like", field, value, join: "or" });
      return this;
    }
    this.current.push({ type: "eq", field, value: op, join: "or" });
    return this;
  }

  andWhereNot(conditions) {
    Object.entries(conditions).forEach(([field, value]) => {
      this.current.push({ type: "neq", field, value, join: "and" });
    });
    return this;
  }

  whereRaw(_sql, _bindings) {
    this.current.push({ type: "raw", sql: _sql, bindings: _bindings || [], join: "and" });
    return this;
  }

  whereIn(field, values) {
    this.current.push({ type: "in", field, values: values || [], join: "and" });
    return this;
  }

  getClauses() {
    return this.current;
  }
}

const normalizeField = (field) => String(field || "").replace(/^[^.]+\./, "");

const matchLike = (value, pattern) => {
  const escaped = String(pattern).replace(/[%_]/g, "\\$&").replace(/\\%/g, ".*").replace(/\\_/g, ".");
  const regex = new RegExp(`^${escaped.replace(/^\%/, "").replace(/\%$/, "")}$`, "i");
  const plain = String(pattern).replace(/^%/, "").replace(/%$/, "");
  if (String(pattern).startsWith("%") && String(pattern).endsWith("%")) {
    return String(value || "").toLowerCase().includes(plain.toLowerCase());
  }
  return regex.test(String(value || ""));
};

const rowMatchesClause = (row, clause, joinTableRows = {}) => {
  const field = normalizeField(clause.field);
  const merged = { ...row, ...joinTableRows };

  switch (clause.type) {
    case "eq":
      return String(merged[field]) === String(clause.value) || Number(merged[field]) === Number(clause.value);
    case "neq":
      return String(merged[field]) !== String(clause.value) && Number(merged[field]) !== Number(clause.value);
    case "in":
      return (clause.values || []).map(Number).includes(Number(merged[field]));
    case ">=":
      return new Date(merged[field]) >= new Date(clause.value);
    case "<=":
      return new Date(merged[field]) <= new Date(clause.value);
    case ">":
      return Number(merged[field]) > Number(clause.value);
    case "<":
      return Number(merged[field]) < Number(clause.value);
    case "like":
      return matchLike(merged[field], clause.value);
    case "raw": {
      const sql = clause.sql || "";
      const val = clause.bindings?.[0];
      if (sql.includes("LOWER(name) = ?") && val) {
        return String(merged.name || "").toLowerCase() === String(val).toLowerCase();
      }
      if (sql.includes("LIKE ?") && val) {
        const targetField = sql.split(".")[1]?.split(" ")[0] || "name";
        return matchLike(merged[targetField], val);
      }
      return true;
    }
    default:
      return true;
  }
};

const applyClauses = (rows, clauses, joinRowsById = null, joinField = null) => {
  if (!clauses.length) return rows;
  return rows.filter((row) => {
    const joinData = joinRowsById && joinField && row[joinField]
      ? joinRowsById.get(Number(row[joinField])) || {}
      : {};

    let result = null;
    clauses.forEach((clause) => {
      if (clause.type === "group") {
        const nestedRows = applyClauses([row], clause.group.getClauses(), joinRowsById, joinField);
        const ok = nestedRows.length > 0;
        result = result === null ? ok : (clause.group.current?.[0]?.join === "or" ? result || ok : result && ok);
        return;
      }
      const ok = rowMatchesClause(row, clause, joinData);
      if (result === null) {
        result = ok;
      } else if (clause.join === "or") {
        result = result || ok;
      } else {
        result = result && ok;
      }
    });
    return !!result;
  });
};

class AppwriteQuery {
  constructor(table, trxContext = null) {
    this.table = table;
    this.trxContext = trxContext;
    this.selectCols = null;
    this.filters = new WhereBuilder(this);
    this._order = null;
    this._limit = null;
    this._offset = null;
    this._join = null;
    this._operation = "select";
    this._insertPayload = null;
    this._updatePayload = null;
    this._countMode = false;
    this._returning = null;
    this._whereInSubqueries = [];
  }

  select(...cols) {
    const columns = cols.length === 1 && Array.isArray(cols[0]) ? cols[0] : cols;
    if (columns.length === 1 && columns[0] === "*") {
      this.selectCols = null;
    } else if (columns.length) {
      this.selectCols = columns;
    }
    return this;
  }

  where(...args) {
    this.filters.where(...args);
    return this;
  }

  whereIn(field, valuesOrQuery) {
    if (valuesOrQuery && typeof valuesOrQuery.then === "function") {
      this._whereInSubqueries.push({ field, query: valuesOrQuery });
      return this;
    }
    this.filters.whereIn(field, valuesOrQuery);
    return this;
  }

  whereRaw(sql, bindings) {
    this.filters.whereRaw(sql, bindings);
    return this;
  }

  andWhereNot(conditions) {
    this.filters.andWhereNot(conditions);
    return this;
  }

  leftJoin(otherTable, leftKey, rightKey) {
    const leftField = String(leftKey).split(".")[1] || leftKey;
    const rightField = String(rightKey).split(".")[1] || rightKey;
    this._join = { otherTable, leftField, rightField };
    return this;
  }

  orderBy(field, direction = "asc") {
    this._order = { field: normalizeField(field), direction };
    return this;
  }

  limit(n) {
    this._limit = Number(n);
    return this;
  }

  offset(n) {
    this._offset = Number(n);
    return this;
  }

  clone() {
    const copy = new AppwriteQuery(this.table, this.trxContext);
    copy.selectCols = this.selectCols ? [...this.selectCols] : null;
    copy.filters = this.filters;
    copy._order = this._order;
    copy._limit = this._limit;
    copy._offset = this._offset;
    copy._join = this._join;
    copy._countMode = this._countMode;
    return copy;
  }

  clearSelect() {
    this.selectCols = null;
    this._countMode = true;
    return this;
  }

  count() {
    this._countMode = true;
    return this;
  }

  insert(payload) {
    this._operation = "insert";
    this._insertPayload = payload;
    return this;
  }

  update(payload) {
    this._operation = "update";
    this._updatePayload = payload;
    return this;
  }

  delete() {
    this._operation = "delete";
    return this;
  }

  del() {
    return this.delete();
  }

  returning(column) {
    this._returning = column;
    return this;
  }

  async columnInfo() {
    const cols = getTableColumns(this.table);
    const info = {};
    cols.forEach((col) => {
      info[col] = { type: "string" };
    });
    return info;
  }

  async _fetchRows() {
    for (const sub of this._whereInSubqueries) {
      const subRows = await sub.query;
      const values = (subRows || []).map((row) => row.id ?? row[sub.field]);
      this.filters.whereIn(normalizeField(sub.field), values);
    }

    let rows = await listAllRows(this.table);

    if (this._join) {
      const joinRows = await listAllRows(this._join.otherTable);
      const joinMap = new Map(joinRows.map((r) => [Number(r.id), r]));
      rows = rows.map((row) => {
        const joined = joinMap.get(Number(row[this._join.leftField])) || {};
        const prefix = this._join.otherTable === "owners" ? "owner" : "joined";
        return {
          ...row,
          ownerName: joined.name,
          ownerMobile: joined.mobile,
          ownerEmail: joined.email,
          [`${prefix}Name`]: joined.name,
          [`${prefix}Mobile`]: joined.mobile,
          [`${prefix}Email`]: joined.email,
        };
      });
    }

    const clauses = this.filters.getClauses();
    if (clauses.length) {
      const joinMap = this._join
        ? new Map((await listAllRows(this._join.otherTable)).map((r) => [Number(r.id), r]))
        : null;
      rows = applyClauses(rows, clauses, joinMap, this._join?.leftField);
    }

    if (this._order) {
      const { field, direction } = this._order;
      rows.sort((a, b) => {
        const av = a[field];
        const bv = b[field];
        if (av === bv) return 0;
        if (av === undefined || av === null) return 1;
        if (bv === undefined || bv === null) return -1;
        return direction === "desc" ? (av < bv ? 1 : -1) : (av > bv ? 1 : -1);
      });
    }

    return rows;
  }

  async _executeInsert() {
    const db = getDatabases();
    const rows = Array.isArray(this._insertPayload) ? this._insertPayload : [this._insertPayload];
    const insertedIds = [];

    for (const raw of rows) {
      const payload = serializePayload(this.table, { ...raw });
      if (payload.id === undefined || payload.id === null) {
        payload.id = await getNextId(this.table);
      }
      payload.id = Number(payload.id);
      if (!payload.createdAt) payload.createdAt = new Date().toISOString();
      if (getTableColumns(this.table).includes("updatedAt") && !payload.updatedAt) {
        payload.updatedAt = new Date().toISOString();
      }

      const doc = await db.createDocument(
        env.APPWRITE_DATABASE_ID,
        this.table,
        ID.unique(),
        payload
      );
      insertedIds.push(Number(payload.id));
      if (this.trxContext) this.trxContext.pending.push({ type: "create", table: this.table, docId: doc.$id });
    }

    if (this._returning) {
      return insertedIds.map((id) => ({ [this._returning]: id }));
    }

    return insertedIds.length === 1 ? insertedIds[0] : insertedIds;
  }

  async _executeUpdate() {
    const rows = await this._fetchRows();
    const db = getDatabases();
    let count = 0;
    const payload = serializePayload(this.table, { ...this._updatePayload });

    for (const row of rows) {
      await db.updateDocument(
        env.APPWRITE_DATABASE_ID,
        this.table,
        row._docId,
        payload
      );
      count += 1;
    }
    return count;
  }

  async _executeDelete() {
    const rows = await this._fetchRows();
    const db = getDatabases();
    let count = 0;
    for (const row of rows) {
      await db.deleteDocument(env.APPWRITE_DATABASE_ID, this.table, row._docId);
      count += 1;
    }
    return count;
  }

  async first() {
    const rows = await this.limit(1)._executeSelect();
    return rows[0];
  }

  _project(row) {
    if (!this.selectCols || !this.selectCols.length) return row;
    const out = {};
    this.selectCols.forEach((col) => {
      const key = col.includes(" as ") ? col.split(" as ").pop().trim() : col.split(".").pop();
      const source = col.includes(".") ? col.split(".").pop() : col;
      out[key] = row[source] ?? row[col] ?? row[key];
    });
    return out;
  }

  async _executeSelect() {
    if (this._countMode) {
      const rows = await this._fetchRows();
      return [{ count: String(rows.length) }];
    }

    let rows = await this._fetchRows();
    if (this._offset) rows = rows.slice(this._offset);
    if (this._limit !== null && this._limit !== undefined) rows = rows.slice(0, this._limit);
    if (this.selectCols) rows = rows.map((row) => this._project(row));
    return rows;
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }

  async execute() {
    switch (this._operation) {
      case "insert":
        return this._executeInsert();
      case "update":
        return this._executeUpdate();
      case "delete":
        return this._executeDelete();
      default:
        return this._executeSelect();
    }
  }
}

const createTrx = () => {
  const ctx = { pending: [] };
  const trx = (table) => new AppwriteQuery(table, ctx);
  trx.raw = () => Promise.resolve();
  trx.commit = async () => {};
  trx.rollback = async () => {};
  return trx;
};

const db = (table) => new AppwriteQuery(table);

db.transaction = async (handler) => {
  const trx = createTrx();
  await handler(trx);
};

db.schema = {
  hasColumn: async (table, column) => getTableColumns(table).includes(column),
  hasTable: async (table) => getTableColumns(table).length > 0,
};

db.client = { config: { client: "appwrite" } };
db.isAppwrite = true;
db.raw = (sql) => ({ toString: () => sql });

module.exports = db;
