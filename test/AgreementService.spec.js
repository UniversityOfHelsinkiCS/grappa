import test from 'ava';
import sinon from 'sinon';
//import knex from 'knex';
const knex = require('../connection');

const agreementService = require('../src/services/AgreementService');
const mockAgreements = require('../src/mockdata/MockAgreements');

test.before(async t => {
    //knex.schema.dropTableIfExists('agreement');
    //let temp = knex.raw('SELECT * FROM agreement');
    await knex.schema.createTable('agreement', function (table) {
        table.increments('agreementId').primary();
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
    //knex.schema.dropTableIfExists('agreement');
    //let temp = knex.raw('SELECT * FROM agreement');
    await knex('agreement').del();
    await knex('agreement').insert(mockAgreements);
});

test.beforeEach(async t => {
});    


test.serial('getAllAgreements returns list of right length ', async t => {
    let listOfAgreements = await agreementService.getAllAgreements();
    t.deepEqual(listOfAgreements.length, mockAgreements.length);
});

test.serial('AgreementDao returns a agreement by id correctly', async t => {

    let id = '1';
    let agreement = await agreementService.getAgreementById(id);
    let mockAgreement;
    for(let i = 0; i < mockAgreements.length; i++) {
        if (mockAgreements[i].agreementId.toString() === id) {
            mockAgreement = mockAgreements[i];
        }
    }
    t.is(agreement.length, 1);
    t.deepEqual(agreement[0], mockAgreement);
});

test.serial('saveNewAgreement call returns agreementId = 3', async t => {
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

    
    var temp = await agreementService.saveNewAgreement(testData);
    //console.log(temp);
    t.truthy(temp==3);
    /*
    await knex('agreement')
    .returning('agreementId')
    .insert(testData)
    .then((agreementId) => {
        console.log( {text: 'New agreement saved to backend', agreementId: agreementId[0]});
        t.truthy(agreementId[0]==3)
      });
      */

});