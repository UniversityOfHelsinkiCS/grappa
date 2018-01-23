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

export async function deleteFromDb() {
    await knex('previousagreements').del();
    await knex('agreementDraftPerson').del();
    await knex('agreementDraft').del();
    await knex('notification').del();
    await knex('emailDraft').del();
    await knex('attachment').del();
    await knex('agreementPerson').del();
    await knex('emailInvite').del();
    await knex('agreement').del();
    await knex('thesis').del();
    await knex('personWithRole').del();
    await knex('person').del();
    await knex('role').del();
    await knex('councilmeeting').del();
    await knex('studyfield').del();
    await knex('programme').del();
    await knex('faculty').del();

    await knex.raw('alter sequence "agreementDraft_agreementDraftId_seq" restart with 4');
    await knex.raw('alter sequence "personWithRole_personRoleId_seq" restart with 17');
    await knex.raw('alter sequence "personWithRole_personRoleId_seq" restart with 17');
    await knex.raw('alter sequence "programme_programmeId_seq" restart with 9');
    await knex.raw('alter sequence "studyfield_studyfieldId_seq" restart with 8');
}
