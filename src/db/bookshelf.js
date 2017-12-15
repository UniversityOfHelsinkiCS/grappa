'use strict';
const knex = require('./connection')
const bookshelf = require('bookshelf')(knex);
bookshelf.plugin('bookshelf-validate', {
    validator: validator
  });

module.exports = bookshelf;