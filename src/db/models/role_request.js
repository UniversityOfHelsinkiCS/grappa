const bookshelf = require('../bookshelf')
const Person = require('./person')
const Programme = require('./programme')
const Role = require('./role')

const RoleRequest = bookshelf.Model.extend({
    tableName: 'roleRequest',
    idAttribute: 'roleRequestId',
    person() {
        return this.belongsTo(Person, 'personId', 'personId')
    },
    programme() {
        return this.belongsTo(Programme, 'programmeId', 'programmeId')
    },
    role() {
        return this.belongsTo(Role, 'roleId', 'roleId')
    },
    granter() {
        return this.belongsTo(Person, 'granterId', 'personId')
    }
})

module.exports = RoleRequest
