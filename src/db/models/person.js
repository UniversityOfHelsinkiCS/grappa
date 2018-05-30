const bookshelf = require('../bookshelf')
require('./person_with_role')

const Person = bookshelf.Model.extend({
    tableName: 'person',
    idAttribute: 'personId',
    roles() {
        return this.hasMany('PersonWithRole', 'personId', 'personId')
    }
})
module.exports = bookshelf.model('Person', Person)
