import test from 'ava';
import sinon from 'sinon';
import router from '../../src/routes/persons.js';

const reqres = require('reqres');

let req;
let res;
let personService;
let personController;

test.beforeEach(async t => {
    req = reqres.req();
    res = reqres.res();
    personService = require('../../src/services/PersonService');
    personController = require('../../src/controllers/PersonController');
});

test.afterEach(async t => {
});



test.cb('getPersonById', t => {
    const stub = sinon.stub(personService, "getPersonById");
    req.params.id = 123;
    stub.returns({ test: "xoxo" });
    stub.withArgs(req.params.id).returns({ test: "ok" });
    personController.personService = personService;
    personController.getPersonById(req, res)
        .then(() => {
            t.is(stub.calledOnce, true, "personById is called once");
            t.is(stub.calledWith(req.params.id), true, "personById is called with correct id");
            t.is(res.status.calledWith(200), true, "personById returns status 200");
            t.is(res.json.calledWith({ test: "ok" }), true, "personById returns correct information");
            t.end();
        });
        personService.getPersonById.restore();
});