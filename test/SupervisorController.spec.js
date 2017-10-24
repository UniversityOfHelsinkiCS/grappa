import test from 'ava';
import sinon from 'sinon';
import router from '../src/routes/supervisors.js';

const reqres = require('reqres');

let req;
let res;
let supervisorController;
let service;

test.beforeEach(async t => {
    req = reqres.req();
    res = reqres.res();
    service = require('../src/services/SupervisorService');
    supervisorController = require('../src/controllers/SupervisorController');
});

test.afterEach(async t => {
});

test.cb('getAllSupervisors', t => {
    const stub = sinon.stub(service, "getAllSupervisors");
    stub.returns({ test: "xoxo" });
    supervisorController.service = service;
    supervisorController.getAllSupervisors(req, res)
    .then(() => {
        t.is(stub.calledOnce, true, "getAllSupervisors is called once");
        t.is(res.status.calledWith(200), true, "getAllSupervisors returns status 200");
        t.end();
    });
    service.getAllSupervisors.restore();
});

test.cb('saveSupervisor', t => {
    const stub = sinon.stub(service, "saveNewSupervisor");
    supervisorController.service = service;
    supervisorController.saveSupervisor(req, res)
        .then(() => {
            t.is(stub.calledOnce, true, "saveNewSupervisor is called once");
            t.is(res.status.calledWith(200), true, "saveNewSupervisor returns status 200 for new supervisor");
            t.end();
        });
    service.saveNewSupervisor.restore();
});

test.cb('saveSupervisor returns 500 for error with new supervisor', t => {
    const stub = sinon.stub(service, "saveNewSupervisor");
    stub.throws();
    supervisorController.service = service;
    supervisorController.saveSupervisor(req, res)
        .then(() => {
            t.is(res.status.calledWith(500), true, "saveSupervisor returns status 500 for error with new supervisor");
            t.end();
        });
    service.saveNewSupervisor.restore();
});