exports.up = knex => Promise.all([
    knex.schema.createTable('notification', (table) => {
        table.increments('notificationId').primary()
        table.text('type').notNullable()
        table.integer('userId')
        table.foreign('userId').references('person.personId').onDelete('SET NULL')
        table.timestamp('timestamp').defaultTo(knex.fn.now())
        table.integer('programmeId')
        table.foreign('programmeId').references('programme.programmeId').onDelete('SET NULL')
    })
])

exports.down = async (knex) => {
    knex.schema.dropTable('notification')
}
