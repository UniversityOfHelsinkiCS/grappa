'use strict';
const bookshelf = require('../db/bookshelf');
const Agreement = bookshelf.Model.extend({
    tableName: 'agreement',
    idAttribute: 'agreementId',
});
module.exports = Agreement;