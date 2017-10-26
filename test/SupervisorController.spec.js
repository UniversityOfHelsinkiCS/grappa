import test from 'ava';
import sinon from 'sinon';
import router from '../src/routes/supervisors.js';

const reqres = require('reqres');

let req;
let res;
let supervisorController;
let supervisorService;
let personService;

test.beforeEach(async t => {
    req = reqres.req();
    res = reqres.res();
    supervisorService = require('../src/services/SupervisorService');
    personService = require('../src/services/PersonService');
    supervisorController = require('../src/controllers/SupervisorController');
});

test.afterEach(async t => {
});

test.cb('getAllSupervisors', t => {
    const stub = sinon.stub(supervisorService, "getAllSupervisors");
    stub.returns({ test: "xoxo" });
    supervisorController.supervisorService = supervisorService;
    supervisorController.getAllSupervisors(req, res)
    .then(() => {
        t.is(stub.calledOnce, true, "getAllSupervisors is called once");
        t.is(res.status.calledWith(200), true, "getAllSupervisors returns status 200");
        t.end();
    });
    supervisorService.getAllSupervisors.restore();
});

test.cb('saveSupervisor', t => {
    // TO DO
    supervisorController.saveSupervisor(req, res)
        .then(() => {
            // t.is(res.status.calledWith(200), true, "saveSupervisor returns status 200 for new supervisor");
            t.end();
        });
});

test.cb('saveSupervisor returns 500 for error with new supervisor', t => {
    const stub = sinon.stub(personService, "savePerson");
    stub.throws();
    supervisorController.personService = personService;
    supervisorController.saveSupervisor(req, res)
        .then(() => {
            t.is(res.status.calledWith(500), true, "saveSupervisor returns status 500 for error with new supervisor");
            t.end();
        });
    personService.savePerson.restore();
});

test.cb('saveSupervisor returns error 500 with existing personId', t => {
    req.body.personId = 2;
    supervisorController.saveSupervisor(req, res)
        .then(() => {
            t.is(res.status.calledWith(500), true, 'wrokokrs');
            t.end();
        });
});