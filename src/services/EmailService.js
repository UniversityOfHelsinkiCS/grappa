const knex = require('../db/connection');
const mailer = require('../util/mailer');
const templates = require('../util/emailTemplates');

export const agreementCreated = (data) => {
    let body = templates.getEmailTemplate('createAgreement', data);
    getEmailAddressByPersonRoleId(data.responsibleSupervisorId).then(address => {
        return mailer.sendEmail(address, 'New Agreement created by ' + data.firstname + ' ' + data.lastname, body);
    });
}

export const agreementUpdated = (data) => {
    let body = templates.getEmailTemplate('updateAgreement', data);
    getEmailAddressByAgreementAndRole(data).then(address => {
        mailer.sendEmail(address, 'Agreement updated by ' + data.firstname + ' ' + data.lastname, body);
    });
}

const getEmailAddressByPersonRoleId = (id) => {
    return knex.select('person.email').from('personWithRole')
        .join('person', 'personWithRole.personId', '=', 'person.personId')
        .where('personWithRole.personId', id)
        .then(to => to[0].email);
}

const getEmailAddressByAgreementAndRole = (data) => {
    if (data.whoNext === 'supervisor') {
        return knex.select('person.email').from('personWithRole')
            .join('person', 'personWithRole.personId', '=', 'person.personId')
            .where('personWithRole.personRoleId', data.responsibleSupervisorId)
            .then(to => to);
    } else if (data.whoNext === 'student') {
        return knex.select('person.email').from('agreement')
            .join('person', 'agreement.authorId', '=', 'person.personId')
            .where('authorId', data.authorId)
            .then(to => to);
    }
}
