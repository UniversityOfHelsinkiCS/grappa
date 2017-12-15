'use strict';
const knex = require('./connection')
const bookshelf = require('bookshelf')(knex);
bookshelf.plugin('bookshelf-validate',{
  validator: require('validator'), // node-validator
  validateOnSave: true // Automatically validate when Bookshelf emits 'saving' event
});

module.exports = bookshelf;