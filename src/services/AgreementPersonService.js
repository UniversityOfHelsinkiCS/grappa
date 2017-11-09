const knex = require('../../connection');

export const getAgreementPersonsByAgreementId = (id) => {
    return knex.select().from('agreementPerson')
        .join('role', 'agreementPerson.roleId', '=', 'role.roleId')
        .where('agreementId', id)
        .then(persons => {
            return persons;
        });
}
