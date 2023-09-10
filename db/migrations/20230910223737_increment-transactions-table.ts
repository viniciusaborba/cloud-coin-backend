import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.string('receiver').notNullable()
    table.string('category').notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.dropColumn('receiver')
    table.dropColumn('category')
  })
}
