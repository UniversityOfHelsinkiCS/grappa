
const bookshelf = require('../bookshelf')

const Attachment = bookshelf.Model.extend({
    tableName: 'attachment',
    idAttribute: 'attachmentId'
})
module.exports = bookshelf.model('Attachment', Attachment)
