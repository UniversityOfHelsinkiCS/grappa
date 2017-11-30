const knex = require('../db/connection');

export async function getPersonRoles(personId) {
    const roleToId = await knex.select().from('role');
    const studyfieldToId = await knex.select().from('studyfield');
    const roles = await knex.select().from('personWithRole').where('personId', personId);
    const personRoles = roles.map(role => {
        return {
            studyfield: studyfieldToId.find(stoid => stoid.studyfieldId === role.studyfieldId).name,
            role: roleToId.find(rtoid => rtoid.roleId === role.roleId).name
        }
    })
    return personRoles;
}