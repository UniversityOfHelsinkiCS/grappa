const bookshelf = require('../bookshelf')
require('./person')
require('./programme')
require('./role')

const PersonWithRole = bookshelf.Model.extend({
    tableName: 'personWithRole',
    idAttribute: 'personRoleId',
    person() {
        return this.belongsTo('Person', 'personId', 'personId')
    },
    programme() {
        return this.belongsTo('Programme', 'programmeId', 'programmeId')
    },
    role() {
        return this.belongsTo('Role', 'roleId', 'roleId')
    }
})
module.exports = bookshelf.model('PersonWithRole', PersonWithRole)
