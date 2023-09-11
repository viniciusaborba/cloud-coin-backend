import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("goals", (table) => {
    table.timestamp("initial_date").defaultTo(knex.fn.now()).alter();
    table.timestamp("end_date").defaultTo(knex.fn.now()).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("goals", (table) => {
    table.string("initial_date").alter();
    table.string("end_date").alter();
  });
}
