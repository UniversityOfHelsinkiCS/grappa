'use strict';
const bookshelf = require('../db/bookshelf');
const Thesis = bookshelf.Model.extend({
    tableName: 'thesis',
    idAttribute: 'thesisId',
});
module.exports = Thesis;