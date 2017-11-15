import test from 'ava';
import sinon from 'sinon';
import router from '../src/routes/agreements.js';

const reqres = require('reqres');

let req;
let res;
let agreementController;
let agreementService;
let personService;

test.beforeEach(async t => {
    req = reqres.req();
    res = reqres.res();
    agreementService = require('../src/services/AgreementService');
    personService = require('../src/services/PersonService');
    agreementController = require('../src/controllers/AgreementController');
});

test.afterEach(async t => {
});

test.cb('getAllAgreements', t => {
    const stub = sinon.stub(agreementService, "getAllAgreements");
    stub.returns({ test: "xoxo" });
    agreementController.service = agreementService;
    agreementController.getAllAgreements(req, res)
    .then(() => {
        t.is(stub.calledOnce, true, "getAllAgreements is called once");
        t.is(res.status.calledWith(200), true, "getAllAgreements returns status 200");
        t.end();
    });
    agreementService.getAllAgreements.restore();
});

/*
test.cb('getAgreementById', t => {
    const agreementStub = sinon.stub(agreementService, "getAgreementById");
    const personStub = sinon.stub(personService, "getAgreementPersonsByAgreementId");
    req.params.id = 123;
    agreementStub.returns({ test: "xoxo" });
    agreementStub.withArgs(req.params.id).returns({ test: "ok" });
    //personStub.withArgs(req.params.id).returns({ person: "ok" });
    agreementController.agreementService = agreementService;
    agreementController.getAgreementById(req, res)
        .then(() => {
            t.is(agreementStub.calledOnce, true, "agreementById is called once");
            t.is(agreementStub.calledWith(req.params.id), true, "agreementById is called with correct id");
            t.is(res.status.calledWith(200), true, "agreementById returns status 200");
            t.is(personStub.calledOnce, true, "getAgreementPersonsByAgreementId is called once")
            t.is(res.json.calledWith({ test: "ok", person: "ok" }), true, "agreementById returns correct information");
            t.end();
        });
    agreementService.getAgreementById.restore();
});
*/
test.cb('getPreviousAgreementById', t => {
    const stub = sinon.stub(agreementService, "getPreviousAgreementById");
    req.params.id = 123;
    stub.returns({ test: "xoxo" });
    stub.withArgs(req.params.id).returns({ test: "ok" });
    agreementController.service = agreementService;
    agreementController.getPreviousAgreementById(req, res)
        .then(() => {
            t.is(stub.calledOnce, true, "previousAgreementById is called once");
            t.is(stub.calledWith(req.params.id), true, "previousAgreementById is called with correct id");
            t.is(res.status.calledWith(200), true, "previousAgreementById returns status 200");
            t.is(res.json.calledWith({ test: "ok" }), true, "previousAgreementById returns correct information");
            t.end();
        });
    agreementService.getPreviousAgreementById.restore();
});
/*
test.cb('getAgreementById does not return incorrect information', t => {
    const stub = sinon.stub(agreementService, "getAgreementById");
    req.params.id = 123;
    stub.returns({ test: "nok" });
    agreementController.service = agreementService;
    agreementController.getAgreementById(req, res)
        .then(() => {
            t.not(res.json.calledWith({ test: "xoxo" }), true, "agreementById does not return incorrect information");
            t.end();
        });
    agreementService.getAgreementById.restore();
});
*/
// test.cb('saveAgreement', t => {
//     req.body.personId = 1;
//     const stub = sinon.stub(agreementService, "saveNewAgreement");
//     agreementController.service = agreementService;
//     agreementController.saveAgreement(req, res)
//         .then(() => {
//             t.is(res.status.calledWith(200), true, "saveAgreement returns status 200 for new agreement");
//             t.end();
//         });
//     agreementService.saveNewAgreement.restore();
// });

/*test.cb('saveAgreement returns 500 for error with new agreement', t => {
    const stub = sinon.stub(personService, "updatePerson");
    stub.throws();
    agreementController.personService = personService;
    agreementController.saveAgreement(req,res)
        .then(() => {
            t.is(res.status.calledWith(200), true, 'saveSupervisor returns error 500');
            t.end();
        });
    personService.updatePerson.restore();
}); */

test.cb('updateAgreement returns 500 for error', t => {
    const stub = sinon.stub(personService, "updatePerson");
    stub.throws();
    agreementController.personService = personService;
    agreementController.updateAgreement(req,res)
        .then(() => {
            t.is(res.status.calledWith(500), true, 'updateAgreement returns error 500');
            t.end();
        });
    personService.updatePerson.restore();
});

test.cb('updateAgreement returns 500 if no id param is provided', t => {
    req.params.id = null;
    agreementController.updateAgreement(req,res)
    .then(() => {
        t.is(res.status.calledWith(500), true, 'updateAgreement returns error 500');
        t.end();
    });
});

// test.cb('saveAgreement update', t => {
//     const stub = sinon.stub(service, "updateAgreement");
//     agreementController.service = service;
//     req.body.agreementId = 34;
//     agreementController.saveAgreement(req, res)
//         .then(() => {
//             t.is(stub.calledOnce, true, "updateAgreement is called once");
//             t.is(res.status.calledWith(200), true, "saveAgreement returns status 200 for update");
//             t.end();
//         });
//     service.updateAgreement.restore();
// });

// test.cb('saveAgreement returns 500 for error with update', t => {
//     const stub = sinon.stub(service, "updateAgreement");
//     stub.throws();
//     agreementController.service = service;
//     req.body.agreementId = 34;
//     agreementController.saveAgreement(req, res)
//         .then(() => {
//             t.is(res.status.calledWith(500), true, "saveAgreement returns status 500 for error with update");
//             t.end();
//         });
//     service.updateAgreement.restore();
// });

test.cb('savePrevious', t => {
    const stub = sinon.stub(agreementService, "savePrevious");
    agreementController.service = agreementService;
    agreementController.savePrevious(req, res)
        .then(() => {
            t.is(stub.calledOnce, true, "savePrevious is called once");
            t.is(res.status.calledWith(200), true, "savePrevious returns status 200 for success");
            t.end();
        });
    agreementService.savePrevious.restore();
});
