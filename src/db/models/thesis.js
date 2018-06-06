const bookshelf = require('../bookshelf')
require('./agreement')
require('./person')

const Thesis = bookshelf.Model.extend({
    tableName: 'thesis',
    idAttribute: 'thesisId',
    authors() {
        return this.belongsToMany('Person', 'agreement', 'thesisId', 'authorId', 'thesisId', 'personId')
    },
    agreements() {
        return this.hasMany('Agreement', 'thesisId', 'thesisId')
    }
})

module.exports = bookshelf.model('Thesis', Thesis)
