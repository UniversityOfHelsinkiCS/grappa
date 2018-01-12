const knex = require('../src/db/connection');

export async function createPerson(email) {
    const insert = await knex('person')
        .returning('personId')
        .insert({
            email,
            firstname: 'Olli O',
            lastname: 'Opiskelija'
        });

    return insert[0];
}
