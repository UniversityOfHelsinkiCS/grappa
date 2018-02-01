import Promise from 'bluebird';

const knex = require('../src/db/connection');

export async function createPerson(email) {
    const insert = await knex.getKnex()('person')
        .returning('personId')
        .insert({
            email,
            firstname: 'Olli O',
            lastname: 'Opiskelija'
        });

    return insert[0];
}

export async function deleteFromDb(connection) {
    return Promise.all([
        connection('meetingProgramme').del(),
        connection('previousagreements').del(),
        connection('agreementDraftPerson').del(),
        connection('agreementDraft').del(),
        connection('notification').del(),
        connection('emailDraft').del(),
        connection('attachment').del(),
        connection('agreementPerson').del(),
        connection('emailInvite').del(),
        connection('agreement').del(),
        connection('thesis').del(),
        connection('personWithRole').del(),
        connection('person').del(),
        connection('role').del(),
        connection('councilmeeting').del(),
        connection('studyfield').del(),
        connection('programme').del(),
        connection('faculty').del(),

        connection.raw('alter sequence "agreementDraft_agreementDraftId_seq" restart with 4'),
        connection.raw('alter sequence "agreement_agreementId_seq" restart with 4'),
        connection.raw('alter sequence "attachment_attachmentId_seq" restart with 2'),
        connection.raw('alter sequence "councilmeeting_councilmeetingId_seq" restart with 2'),
        connection.raw('alter sequence "notification_notificationId_seq" restart with 2'),
        connection.raw('alter sequence "personWithRole_personRoleId_seq" restart with 17'),
        connection.raw('alter sequence "person_personId_seq" restart with 20'),
        connection.raw('alter sequence "programme_programmeId_seq" restart with 9'),
        connection.raw('alter sequence "studyfield_studyfieldId_seq" restart with 8'),
        connection.raw('alter sequence "thesis_thesisId_seq" restart with 5')
    ]);
}

export async function initDb() {
    const schema = process.env.DB_SCHEMA;
    const connection = knex.getKnex();

    await connection.raw(`drop schema if exists ${schema} cascade`);
    await connection.raw(`create schema ${schema}`);
    await connection.migrate.latest();
    await deleteFromDb(connection);
    await connection.seed.run();
}
