const bookshelf = require('../bookshelf')
require('./major')

const Studyfield = bookshelf.Model.extend({
    tableName: 'studyfield',
    idAttribute: 'studyfieldId',
    major() {
        return this.belongsTo('Major', 'majorId', 'majorId')
    }
})

module.exports = bookshelf.model('Studyfield', Studyfield)
