'use strict';
const bookshelf = require('../bookshelf');
const Agreement = bookshelf.Model.extend({
    validations: {
        studentWorkTime: {
          isRequired: true,
          isLength: [1, 100] // will call validator.isLength(value, 2, 32) 
        }},
    tableName: 'agreement',
    idAttribute: 'agreementId',
});
module.exports = Agreement;