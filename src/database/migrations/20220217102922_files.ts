import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('files', (t) => {
    t.increments('id');
    t.integer('user_id');
    t.string('url');
    t.boolean('safe').defaultTo(true);
    t.integer('safe_count').defaultTo(0);
    t.timestamp('createdAt').defaultTo(knex.fn.now());
    t.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('files');
}
