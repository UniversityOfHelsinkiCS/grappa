const knex = require('./connection').getKnex()
const bookshelf = require('bookshelf')(knex)

module.exports = bookshelf
