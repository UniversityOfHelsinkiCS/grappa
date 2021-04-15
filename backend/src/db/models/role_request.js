const bookshelf = require('../bookshelf')
require('./person')
require('./programme')
require('./role')

const RoleRequest = bookshelf.Model.extend({
    tableName: 'roleRequest',
    idAttribute: 'roleRequestId',
    person() {
        return this.belongsTo('Person', 'personId', 'personId')
    },
    programme() {
        return this.belongsTo('Programme', 'programmeId', 'programmeId')
    },
    role() {
        return this.belongsTo('Role', 'roleId', 'roleId')
    },
    granter() {
        return this.belongsTo('Person', 'granterId', 'personId')
    }
})

module.exports = bookshelf.model('RoleRequest', RoleRequest)
