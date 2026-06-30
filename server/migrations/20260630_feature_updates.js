exports.up = async function up(knex) {
  const hasPetAge = await knex.schema.hasColumn("pets", "age");
  if (!hasPetAge) {
    await knex.schema.table("pets", (table) => {
      table.string("age");
    });
  }

  const hasVisitImaging = await knex.schema.hasColumn("visits", "imaging");
  if (!hasVisitImaging) {
    await knex.schema.table("visits", (table) => {
      table.json("imaging");
    });
  }

  const hasRolePermissions = await knex.schema.hasTable("role_permissions");
  if (!hasRolePermissions) {
    await knex.schema.createTable("role_permissions", (table) => {
      table.increments("id").primary();
      table.string("feature").notNullable();
      table.string("role").notNullable();
      table.boolean("allowed").defaultTo(false);
      table.unique(["feature", "role"]);
      table.timestamps(true, true);
    });
  }

  const hasReminders = await knex.schema.hasTable("reminders");
  if (!hasReminders) {
    await knex.schema.createTable("reminders", (table) => {
      table.increments("id").primary();
      table.string("type").notNullable();
      table.integer("refId");
      table.string("title").notNullable();
      table.text("message");
      table.date("dueDate");
      table.string("status").defaultTo("pending");
      table.timestamps(true, true);
    });
  }
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("reminders");
  await knex.schema.dropTableIfExists("role_permissions");
  const hasVisitImaging = await knex.schema.hasColumn("visits", "imaging");
  if (hasVisitImaging) {
    await knex.schema.table("visits", (table) => {
      table.dropColumn("imaging");
    });
  }
  const hasPetAge = await knex.schema.hasColumn("pets", "age");
  if (hasPetAge) {
    await knex.schema.table("pets", (table) => {
      table.dropColumn("age");
    });
  }
};
