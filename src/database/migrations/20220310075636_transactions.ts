import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (t) => {
    t.increments('id');
    t.integer('account_id');
    t.string('operation');
    t.string('reference');
    t.decimal('balance_before', 20, 4).unsigned();
    t.decimal('balance_after', 20, 4).unsigned();
    t.timestamp('createdAt').defaultTo(knex.fn.now());
    t.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transactions');
}
