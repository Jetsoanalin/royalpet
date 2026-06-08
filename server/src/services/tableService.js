const db = require("../db/knex");

const CLIENT = db.isAppwrite
  ? "appwrite"
  : (db.client && db.client.config && db.client.config.client);
const TABLE_COLUMNS = new Map();

const getTableColumns = async (table) => {
  if (TABLE_COLUMNS.has(table)) return TABLE_COLUMNS.get(table);
  try {
    const info = await db(table).columnInfo();
    const cols = Object.keys(info || {});
    TABLE_COLUMNS.set(table, cols);
    return cols;
  } catch {
    TABLE_COLUMNS.set(table, []);
    return [];
  }
};

const sanitizePayload = async (table, payload) => {
  if (!payload || typeof payload !== "object") return payload;
  const cols = await getTableColumns(table);
  if (!cols.length) return payload;
  const clean = {};
  Object.keys(payload).forEach((k) => {
    if (cols.includes(k)) clean[k] = payload[k];
  });
  return clean;
};

const getInsertId = (result) => (Array.isArray(result) ? result[0] : result);

const insertWithId = async (table, payload, trx) => {
  const runner = trx || db;
  if (CLIENT === "appwrite") {
    const result = await runner(table).insert(payload);
    return Number(result);
  }
  if (CLIENT === "pg") {
    const [row] = await runner(table).insert(payload).returning("id");
    return row && row.id ? row.id : row;
  }
  const result = await runner(table).insert(payload);
  return getInsertId(result);
};

const buildListQuery = (table, cols, queryParams) => {
  let query = db(table).select();

  const reserved = new Set(["page", "limit", "sort", "order", "q"]);
  Object.keys(queryParams || {}).forEach((key) => {
    if (reserved.has(key)) return;
    if (cols.includes(key)) query = query.where(key, queryParams[key]);
  });

  const q = String(queryParams.q || "").trim();
  if (q) {
    const likeCols = ["name", "email", "mobile", "phone"].filter((c) => cols.includes(c));
    if (likeCols.length) {
      query = query.where((builder) => {
        likeCols.forEach((c) => builder.orWhere(c, "like", `%${q}%`));
      });
    }
  }

  const sort = cols.includes(String(queryParams.sort)) ? queryParams.sort : (cols.includes("id") ? "id" : cols[0]);
  const order = String(queryParams.order || "asc").toLowerCase() === "desc" ? "desc" : "asc";
  if (sort) query = query.orderBy(sort, order);

  return query;
};

const paginate = async (query, page = 1, limit = 20) => {
  // Ensure page and limit are valid integers with explicit bounds
  const pageNum = Math.max(1, Math.min(Number(page) || 1, Number.MAX_SAFE_INTEGER));
  const limitNum = Math.max(1, Math.min(Number(limit) || 20, 500));

  const countRow = await query.clone().clearSelect().count({ count: "*" }).first();
  const total = Number(countRow?.count || 0);
  const data = await query.offset((pageNum - 1) * limitNum).limit(limitNum);

  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
};

module.exports = {
  getTableColumns,
  sanitizePayload,
  insertWithId,
  buildListQuery,
  paginate,
};
