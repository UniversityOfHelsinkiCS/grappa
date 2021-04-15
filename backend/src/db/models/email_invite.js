const bookshelf = require('../bookshelf')

const EmailInvite = bookshelf.Model.extend({
    tableName: 'emailInvite',
    idAttribute: 'emailInviteId'
})
module.exports = bookshelf.model('EmailInvite', EmailInvite)
