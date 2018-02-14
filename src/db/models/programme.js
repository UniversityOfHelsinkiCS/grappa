const bookshelf = require('../bookshelf')

const Programme = bookshelf.Model.extend({
    tableName: 'programme',
    idAttribute: 'programmeId'
})

module.exports = Programme
