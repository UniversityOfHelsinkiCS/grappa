import test from 'ava';
import { deleteFromDb } from '../utils';

const knex = require('../../src/db/connection');
const supervisorService = require('../../src/services/SupervisorService');

test.before(async () => {
    await knex.migrate.latest();
});

test.beforeEach(async () => {
    await deleteFromDb();
    await knex.seed.run();
});

test.serial('getAllSupervisors returns list of right length', async (t) => {
    const listOfSupervisors = await supervisorService.getAllSupervisors();
    t.deepEqual(listOfSupervisors.length, 4);
});

test.serial('saveAgreementPerson returns agreementId', async (t) => {
    const mockAgreementPerson = {
        agreementId: 2,
        personRoleId: 2,
        roleId: 1,
        approved: false,
        statement: ''
    };
    const returnValue = await supervisorService.saveAgreementPerson(mockAgreementPerson);
    t.truthy(returnValue, mockAgreementPerson.agreementId);
});


test.serial('updateAgreementPerson returns correct ID', async (t) => {
    const mockAgreementPerson = {
        agreementId: 2,
        personRoleId: 2,
        approved: true,
        approverId: 1,
        statement: 'I approve this supervisor'
    };
    const returnValue = await supervisorService.updateAgreementPerson(mockAgreementPerson);
    t.deepEqual(returnValue, 2);
});
