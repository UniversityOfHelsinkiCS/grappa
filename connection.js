var config = require('./knexfile.js');
var env = 'development';
if (process.env.NODE_ENV === 'test') {
    env = 'test';
}
//console.log(process.env);
console.log("ENVIRONMENT IS ", env);
var knex = require('knex')(config[env]);
module.exports = knex;

if (process.env.NODE_ENV !== 'test') {
    knex.migrate.latest([config]);
}  
