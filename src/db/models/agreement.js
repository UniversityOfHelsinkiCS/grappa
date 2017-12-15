'use strict';
const bookshelf = require('../bookshelf');
const Agreement = bookshelf.Model.extend({
    validations: {
        studentWorkTime: 'isRequired',
        error: 'You must spesify how much work you intend to put in.',
      },
    tableName: 'agreement',
    idAttribute: 'agreementId',
});
module.exports = Agreement;