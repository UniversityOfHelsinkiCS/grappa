const bookshelf = require('../bookshelf')

const Person = bookshelf.Model.extend({
    tableName: 'person',
    idAttribute: 'personId'
})
module.exports = Person
