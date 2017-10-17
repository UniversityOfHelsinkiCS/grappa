import test from 'ava';
import sinon from 'sinon';
import router from '../src/routes/agreements.js';

const reqres = require('reqres');

let req;
let res;
let agreementController;
let service;

test.beforeEach(async t => {
    req = reqres.req();
    res = reqres.res();
    service = require('../src/services/AgreementService');
    agreementController = require('../src/controllers/AgreementController');
});

test.afterEach(async t => {
});

test.cb('getAllAgreements', t => {
    const stub = sinon.stub(service, "getAllAgreements");
    stub.returns({ test: "xoxo" });
    agreementController.service = service;
    agreementController.getAllAgreements(req, res)
    .then(() => {
        t.is(stub.calledOnce, true, "getAllAgreements is called once");
        t.is(res.status.calledWith(200), true, "getAllAgreements returns status 200");
        t.end();
    });
    service.getAllAgreements.restore();
});

test.cb('getAgreementById', t => {
    const stub = sinon.stub(service, "getAgreementById");
    req.params.id = 123;
    stub.returns({ test: "xoxo" });
    stub.withArgs(req.params.id).returns({ test: "ok" });
    agreementController.service = service;
    agreementController.getAgreementById(req, res)
        .then(() => {
            t.is(stub.calledOnce, true, "agreementById is called once");
            t.is(stub.calledWith(req.params.id), true, "agreementById is called with correct id");
            t.is(res.status.calledWith(200), true, "agreementById returns status 200");
            t.is(res.json.calledWith({ test: "ok" }), true, "agreementById returns correct information");
            t.end();
        });
    service.getAgreementById.restore();
});

test.cb('getAgreementById does not return incorrect information', t => {
    const stub = sinon.stub(service, "getAgreementById");
    req.params.id = 123;
    stub.returns({ test: "nok" });
    agreementController.service = service;
    agreementController.getAgreementById(req, res)
        .then(() => {
            t.not(res.json.calledWith({ test: "xoxo" }), true, "agreementById does not return incorrect information");
            t.end();
        });
    service.getAgreementById.restore();
});

test.cb('saveAgreement', t => {
    const stub = sinon.stub(service, "saveNewAgreement");
    agreementController.service = service;
    agreementController.saveAgreement(req, res)
        .then(() => {
            t.is(stub.calledOnce, true, "saveNewAgreement is called once");
            t.is(res.status.calledWith(200), true, "saveAgreement returns status 200 for new agreement");
            t.end();
        });
    service.saveNewAgreement.restore();
});

test.cb('saveAgreement returns 500 for error with new agreement', t => {
    const stub = sinon.stub(service, "saveNewAgreement");
    stub.throws();
    agreementController.service = service;
    agreementController.saveAgreement(req, res)
        .then(() => {
            t.is(res.status.calledWith(500), true, "saveAgreement returns status 500 for error with new agreement");
            t.end();
        });
    service.saveNewAgreement.restore();
});

test.cb('saveAgreement update', t => {
    const stub = sinon.stub(service, "updateAgreement");
    agreementController.service = service;
    req.body.agreementId = 34;
    agreementController.saveAgreement(req, res)
        .then(() => {
            t.is(stub.calledOnce, true, "updateAgreement is called once");
            t.is(res.status.calledWith(200), true, "saveAgreement returns status 200 for update");
            t.end();
        });
    service.updateAgreement.restore();
});

test.cb('saveAgreement returns 500 for error with update', t => {
    const stub = sinon.stub(service, "updateAgreement");
    stub.throws();
    agreementController.service = service;
    req.body.agreementId = 34;
    agreementController.saveAgreement(req, res)
        .then(() => {
            t.is(res.status.calledWith(500), true, "saveAgreement returns status 500 for error with update");
            t.end();
        });
    service.updateAgreement.restore();
});
