
const bookshelf = require('../bookshelf');

const Agreement = bookshelf.Model.extend({
    tableName: 'agreement',
    idAttribute: 'agreementId'
});
module.exports = Agreement;
