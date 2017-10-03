import test from 'ava';
import sinon from 'sinon';
//import knex from 'knex';
const knex = require('../connection');

const contractDao = require('../src/dao/ContractDao');
const mockContracts = require('../src/mockdata/MockContracts');

//process.env.NODE_ENV = 'test';

test.beforeEach(async t => {
    //console.log(knex);
    let temp = knex.raw('SELECT name FROM sqlite_master WHERE type="table"');
    //console.log(temp);
    knex.schema.createTable('contract', function (table) {
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
    
    knex('contract').insert([
        {
          contractId: 1,
          studentName: 'Anni Puurunen',
          studentNumber: "01234567",
          studentAddress: "Helsinginkatu 1",
          studentPhone: "05012345678",
          studentEmail: "anni.puurunen@hotmail.com",
          studentMajor: "Käpistely",

          thesisTitle: "Annin hieno gradu",
          thesisStartDate: "01.01.2010",
          thesisCompletionEta: "01.01.2011",
          thesisPerformancePlace: "Helsinki",

          thesisSupervisorMain: "Supervisior 1",
          thesisSupervisorSecond: "Supervisior 2",
          thesisSupervisorOther: "Supervisior 3",

          thesisWorkStudentTime: "Student time",
          thesisWorkSupervisorTime: "Supervisior time",
          thesisWorkIntermediateGoal: "Intermediate goal",
          thesisWorkMeetingAgreement: "Meeting agreement",
          thesisWorkOther: "Other",

          studentGradeGoal: "5"
        },
        {
          contractId: 2,
          studentName: 'Firstname Lastname',
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
        }
      ]);
      
});
test.afterEach(async t => {
    knex.schema.dropTable('contract');
    //console.log(knex.select().from('contract').where('contractId', 1));
});

test.serial('ContractDao returns a contract by id correctly', t => {
    let id = '1';
    let contract = contractDao.getContractById(id);
    let mockContract;
    for(let i = 0; i < mockContracts.length; i++) {
        if (mockContracts[i].id.toString() === id) {
            mockContract = mockContracts[i];
        }
    }
    t.deepEqual(contract, mockContract);
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
    t.truthy(temp==3)
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

/*
export const getContractById = (id) => {
    return knex.select().from('contract').where('contractId', id)
        .then(contract => {
            return contract;
        });
}

export const saveNewContract  = (data) => {
    return knex('contract')
        .returning('contractId')
        .insert(data)
        .then(contractId => contractId[0])
        .catch(err => err);
}

export const updateContract = (data) => {
    return knex('contract')
        .returning('contractId')
        .where('contractId', '=', data.contractId)
        .update(data)
        .then(contractId => contractId[0])
        .catch(err => err);
}

*/