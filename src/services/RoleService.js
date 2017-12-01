const knex = require('../db/connection');

export async function getRoles() {
    return knex.select().from('role');
}

export async function getPersonRoles(personId) {
    return knex.select().from('personWithRole').where('personId', personId);
}