import test from 'ava';
import sinon from 'sinon';
//import knex from 'knex';
const knex = require('../connection');

const contractDao = require('../src/dao/ContractDao');
const mockContracts = require('../src/mockdata/MockContracts');

test.before(async t => {
    //knex.schema.dropTableIfExists('contract');
    //let temp = knex.raw('SELECT * FROM contract');

    await knex.schema.createTable('contract', function (table) {
        table.increments('contractId').primary();
        table.string('studentName');
        table.string('studentNumber');
        table.string('studentAddress');
        table.string('studentPhone');
        table.string('studentEmail');
        table.string('studentMajor');
        table.string('thesisTitle');
        table.string('thesisStartDate');
        table.string('thesisCompletionEta');
        table.string('thesisPerformancePlace');
        table.string('thesisSupervisorMain');
        table.string('thesisSupervisorSecond');
        table.string('thesisSupervisorOther');
        table.string('thesisWorkStudentTime');
        table.string('thesisWorkSupervisorTime');
        table.string('thesisWorkIntermediateGoal');
        table.string('thesisWorkMeetingAgreement');
        table.string('thesisWorkOther');
        table.string('studentGradeGoal');
        table.timestamps();
    })

});

test.beforeEach(async t => {
    //console.log(knex);
    //let temp = await knex.raw('SELECT name FROM sqlite_master WHERE type="table"');
    await knex('contract').del();
    await knex('contract').insert(mockContracts);
    //let temp = await knex.raw('SELECT * FROM contract');
    //console.log(temp);
});


test.serial('ContractDao returns a contract by id correctly', async t => {

    let id = '1';
    let contract = await contractDao.getContractById(id);
    let mockContract;
    for(let i = 0; i < mockContracts.length; i++) {
        if (mockContracts[i].contractId.toString() === id) {
            mockContract = mockContracts[i];
        }
    }
    t.is(contract.length, 1);
    t.deepEqual(contract[0], mockContract);
});

test.serial('saveNewContract call returns contractId = 3', async t => {
    const testData = {
        studentName: 'Firstname2 Lastname2',
        studentNumber: "01234568",
        studentAddress: "Mäkelänkatu 1",
        studentPhone: "05012345679",
        studentEmail: "firstname.lastname@hotmail.com",
        studentMajor: "Kemia",

        thesisTitle: "Annan gradu kemiasta",
        thesisStartDate: "01.01.2005",
        thesisCompletionEta: "01.01.2006",
        thesisPerformancePlace: "Helsinki",

        thesisSupervisorMain: "Supervisior 1",
        thesisSupervisorSecond: "Supervisior 2",
        thesisSupervisorOther: "Supervisior 3",

        thesisWorkStudentTime: "Student time",
        thesisWorkSupervisorTime: "Supervisior time",
        thesisWorkIntermediateGoal: "Intermediate goal",
        thesisWorkMeetingAgreement: "Meeting agreement",
        thesisWorkOther: "Other",

        studentGradeGoal: "3"
      };

    
    var temp = await contractDao.saveNewContract(testData);
    //console.log(temp);
    t.truthy(temp==3);
    /*
    await knex('contract')
    .returning('contractId')
    .insert(testData)
    .then((contractId) => {
        console.log( {text: 'New contract saved to backend', contractId: contractId[0]});
        t.truthy(contractId[0]==3)
      });
      */

});