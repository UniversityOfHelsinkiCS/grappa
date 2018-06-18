const bookshelf = require('../bookshelf')
require('./person_with_role')
require('./agreement')
require('./thesis')

const Person = bookshelf.Model.extend({
    tableName: 'person',
    idAttribute: 'personId',
    roles() {
        return this.hasMany('PersonWithRole', 'personId', 'personId')
    },
    // agreement() {
    //     return this.hasMany('Agreement', 'authorId', 'personId')
    // },
    theses() {
        return this.belongsToMany('Thesis', 'agreement', 'authorId', 'thesisId', 'personId', 'thesisId')
    }
})
module.exports = bookshelf.model('Person', Person)
