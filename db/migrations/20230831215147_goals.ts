import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('goals', (table) => {
    table.uuid('id').primary()
    table.string('title').notNullable()
    table.string('description').notNullable()
    table.string('user_id').references('id').inTable('users')
    table.float('current_amount').notNullable()
    table.float('wished_amount').notNullable()
    table.string('initial_date')
    table.string('end_date')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('goals')
}

