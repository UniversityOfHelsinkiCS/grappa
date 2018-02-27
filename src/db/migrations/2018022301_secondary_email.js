exports.up = knex => Promise.all([
    knex.schema.table('person', t => t.string('secondaryEmail')),
    knex.schema.table('person', t => t.bool('useSecondaryEmail').defaultTo(false))
])

exports.down = knex => Promise.all([
    knex.schema.table('person', t => t.dropColumn('secondaryEmail')),
    knex.schema.table('person', t => t.dropColumn('useSecondaryEmail'))
])
