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
    await connection('meetingProgramme').del(),
    await connection('previousagreements').del(),
    await connection('agreementDraftPerson').del(),
    await connection('agreementDraft').del(),
    await connection('notification').del(),
    await connection('emailDraft').del(),
    await connection('attachment').del(),
    await connection('agreementPerson').del(),
    await connection('emailInvite').del(),
    await connection('agreement').del(),
    await connection('thesis').del(),
    await connection('personWithRole').del(),
    await connection('person').del(),
    await connection('role').del(),
    await connection('councilmeeting').del(),
    await connection('studyfield').del(),
    await connection('programme').del(),
    await connection('faculty').del(),

    await connection.raw('alter sequence "agreementDraft_agreementDraftId_seq" restart with 4'),
    await connection.raw('alter sequence "agreement_agreementId_seq" restart with 4'),
    await connection.raw('alter sequence "attachment_attachmentId_seq" restart with 2'),
    await connection.raw('alter sequence "councilmeeting_councilmeetingId_seq" restart with 2'),
    await connection.raw('alter sequence "notification_notificationId_seq" restart with 2'),
    await connection.raw('alter sequence "personWithRole_personRoleId_seq" restart with 17'),
    await connection.raw('alter sequence "person_personId_seq" restart with 20'),
    await connection.raw('alter sequence "programme_programmeId_seq" restart with 9'),
    await connection.raw('alter sequence "studyfield_studyfieldId_seq" restart with 8'),
    await connection.raw('alter sequence "thesis_thesisId_seq" restart with 5')
}

export async function initDb() {
    const schema = process.env.DB_SCHEMA;
    const connection = knex.getKnex();

    await connection.raw(`drop schema if not exists ${schema} cascade`);
    await connection.raw(`create schema ${schema}`);
    await connection.migrate.latest();
    await deleteFromDb(connection);
    await connection.seed.run();
}
