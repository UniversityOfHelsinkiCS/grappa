import test from 'ava';
const knex = require('../../src/db/connection');

const mockPersons = require('../../src/mockdata/MockPersons');
const roleServie = require('../../src/services/RoleService');

test.before(async t => {
    await knex.migrate.latest();
});

test.beforeEach(async t => {
    await knex('person').del();
    await knex('person').insert(mockPersons);
    await knex('personWithRole').del();
});

test('visitor roles can be updated', async t => {
    await knex('personWithRole').insert({ personId: 1, roleId: 7, programmeId: 1 });
    await roleServie.updateVisitorRoleStudyfields(1, [2, 3]);
    const roles = await knex('personWithRole')
        .select()
        .where('personId', 1)
        .where('roleId', 7);

    t.is(roles.length, 2);
    t.deepEqual(roles.map(role => role.programmeId), [2, 3]);
});
