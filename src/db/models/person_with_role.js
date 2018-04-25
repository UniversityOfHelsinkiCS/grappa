const bookshelf = require('../bookshelf')
const Person = require('./person')
const Programme = require('./programme')
const Role = require('./role')

const PersonWithRole = bookshelf.Model.extend({
    tableName: 'personWithRole',
    idAttribute: 'personRoleId',
    person() {
        return this.belongsTo(Person, 'personId', 'personId')
    },
    programme() {
        return this.belongsTo(Programme, 'programmeId', 'programmeId')
    },
    role() {
        return this.belongsTo(Role, 'roleId', 'roleId')
    }
})
module.exports = PersonWithRole
