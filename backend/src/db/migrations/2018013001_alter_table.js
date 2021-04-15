exports.up = knex => Promise.all([
    knex.schema.alterTable('agreement', (table) => {
        table
            .date('startDate')
            .defaultTo(knex.fn.now())
            .alter()
    })
])

exports.down = async () => {

}
