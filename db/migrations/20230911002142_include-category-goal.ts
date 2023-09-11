import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('goals', (table) => {
    table.string('category').notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('goals', (table) => {
    table.dropColumn('category')
  })
}
