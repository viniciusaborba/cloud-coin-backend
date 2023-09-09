import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary()
    table.string('title').notNullable()
    table.string('description').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.string('user_id').references('id').inTable('users')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
}
