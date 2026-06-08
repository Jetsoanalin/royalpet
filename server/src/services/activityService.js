const db = require("../db/knex");

const logActivity = async (userId, action, resourceType, resourceId, details = {}, type = "info") => {
  try {
    await db("activity_log").insert({
      user: userId,
      action,
      type,
      details: JSON.stringify({
        resourceType,
        resourceId,
        ...details,
      }),
      time: new Date(),
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};

const getActivityLog = async (filters = {}) => {
  let query = db("activity_log");
  
  if (filters.user) query.where("user", filters.user);
  if (filters.action) query.where("action", filters.action);
  if (filters.type) query.where("type", filters.type);
  if (filters.startDate) query.where("time", ">=", filters.startDate);
  if (filters.endDate) query.where("time", "<=", filters.endDate);
  
  return query.orderBy("time", "desc").limit(filters.limit || 1000);
};

const getActivityStats = async (days = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  if (db.isAppwrite) {
    const rows = await db("activity_log").where("time", ">=", startDate);
    const grouped = new Map();
    rows.forEach((row) => {
      const key = `${row.action}::${row.type}`;
      grouped.set(key, (grouped.get(key) || 0) + 1);
    });
    return Array.from(grouped.entries()).map(([key, total]) => {
      const [action, type] = key.split("::");
      return { total: String(total), action, type };
    });
  }

  const logs = await db("activity_log")
    .where("time", ">=", startDate)
    .select(db.raw("COUNT(*) as total"), db.raw("action"), db.raw("type"))
    .groupBy("action", "type");

  return logs;
};

module.exports = {
  logActivity,
  getActivityLog,
  getActivityStats,
};
