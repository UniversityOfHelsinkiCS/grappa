const bookshelf = require('../bookshelf')

const Thesis = bookshelf.Model.extend({
    tableName: 'thesis',
    idAttribute: 'thesisId'
})

module.exports = bookshelf.model('Thesis', Thesis)
