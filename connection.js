var config = require('./knexfile.js');  
var env = 'development';  
console.log(process.env)
var knex = require('knex')(config[env]);
module.exports = knex;

knex.migrate.latest([config]);
