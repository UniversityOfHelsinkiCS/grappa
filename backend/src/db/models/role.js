const bookshelf = require('../bookshelf')
require('./person_with_role')

const Role = bookshelf.Model.extend({
    tableName: 'role',
    idAttribute: 'roleId',
    persons() {
        return this.hasMany('PersonWithRole', 'roleId', 'roleId')
    }
})
module.exports = bookshelf.model('Role', Role)
