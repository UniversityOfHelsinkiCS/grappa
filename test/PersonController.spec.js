import test from 'ava';
import sinon from 'sinon';
import router from '../src/routes/persons.js';

const reqres = require('reqres');

let req;
let res;
let personService;
let personController;

test.beforeEach(async t => {
    req = reqres.req();
    res = reqres.res();
    personService = require('../src/services/PersonService');
    personController = require('../src/controllers/PersonController');
});

test.afterEach(async t => {
});

test.cb('updatePerson', t => {
    const stub = sinon.stub(personService, "updatePerson");
    stub.returns({ test: "xoxo" });
    personController.personService = personService;
    personController.updatePerson(req, res)
    .then(() => {
        t.is(stub.calledOnce, true, "updatePerson is called once");
        t.is(res.status.calledWith(200), true, "updatePerson returns status 200");
        t.end();
    });
    personService.updatePerson.restore();
});

test.cb('updatePerson returns error 500', t => {
    const stub = sinon.stub(personService, "updatePerson");
    stub.throws();
    personController.personService = personService;
    personController.updatePerson(req, res)
    .then(() => {
        t.is(res.status.calledWith(500), true, "updatePerson returns status 500");
        t.end();
    });
    personService.updatePerson.restore();
});
