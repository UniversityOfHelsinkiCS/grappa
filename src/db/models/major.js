const bookshelf = require('../bookshelf')

const Major = bookshelf.Model.extend({
    tableName: 'major',
    idAttribute: 'majorId'
})

module.exports = Major
