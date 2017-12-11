const config = require('./knexfile.js');
let env = 'development';
if (process.env.NODE_ENV === 'test') {
    env = 'test';
}
console.log("ENVIRONMENT IS", env);
const knex = require('knex')(config[env]);

knex.migrate.latest(config[env]).then((msg) => {
    if (env !== "test") {
        console.log("KNEX MIGRATE SUCCESS", msg);
    }
}).catch((err) => {
    if (env !== "test") {
        console.log("KNEX MIGRATE FAILURE", err);
    }
});

module.exports = knex;