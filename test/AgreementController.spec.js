import test from 'ava';
import sinon from 'sinon';
import router from '../src/routes/agreements.js';

const reqres = require('reqres');

let req;
let res;
let agreementController;
let dao;

test.beforeEach(async t => {
    req = reqres.req();
    res = reqres.res();
    dao = require('../src/dao/AgreementDao');
    agreementController = require('../src/controllers/AgreementController');
});

test.afterEach(async t => {
});

test.cb('getAllAgreements', t => {
    const stub = sinon.stub(dao, "getAllAgreements");
    stub.returns({ test: "xoxo" });
    agreementController.dao = dao;
    agreementController.getAllAgreements(req, res)
    .then(() => {
        t.is(stub.calledOnce, true, "getAllAgreements is called once");
        t.is(res.status.calledWith(200), true, "getAllAgreements returns status 200");
        t.end();
    });
    dao.getAllAgreements.restore();
});

test.cb('getAgreementById', t => {
    const stub = sinon.stub(dao, "getAgreementById");
    req.params.id = 123;
    stub.returns({ test: "xoxo" });
    stub.withArgs(req.params.id).returns({ test: "ok" });
    agreementController.dao = dao;
    agreementController.getAgreementById(req, res)
        .then(() => {
            t.is(stub.calledOnce, true, "agreementById is called once");
            t.is(stub.calledWith(req.params.id), true, "agreementById is called with correct id");
            t.is(res.status.calledWith(200), true, "agreementById returns status 200");
            t.is(res.json.calledWith({ test: "ok" }), true, "agreementById returns correct information");
            t.end();
        });
    dao.getAgreementById.restore();
});

test.cb('getAgreementById does not return incorrect information', t => {
    const stub = sinon.stub(dao, "getAgreementById");
    req.params.id = 123;
    stub.returns({ test: "nok" });
    agreementController.dao = dao;
    agreementController.getAgreementById(req, res)
        .then(() => {
            t.not(res.json.calledWith({ test: "xoxo" }), true, "agreementById does not return incorrect information");
            t.end();
        });
    dao.getAgreementById.restore();
});

test.cb('saveAgreement', t => {
    const stub = sinon.stub(dao, "saveNewAgreement");
    agreementController.dao = dao;
    agreementController.saveAgreement(req, res)
        .then(() => {
            t.is(stub.calledOnce, true, "saveNewAgreement is called once");
            t.is(res.status.calledWith(200), true, "saveAgreement returns status 200 for new agreement");
            t.end();
        });
    dao.saveNewAgreement.restore();
});

test.cb('saveAgreement returns 500 for error with new agreement', t => {
    const stub = sinon.stub(dao, "saveNewAgreement");
    stub.throws();
    agreementController.dao = dao;
    agreementController.saveAgreement(req, res)
        .then(() => {
            t.is(res.status.calledWith(500), true, "saveAgreement returns status 500 for error with new agreement");
            t.end();
        });
    dao.saveNewAgreement.restore();
});

test.cb('saveAgreement update', t => {
    const stub = sinon.stub(dao, "updateAgreement");
    agreementController.dao = dao;
    req.body.agreementId = 34;
    agreementController.saveAgreement(req, res)
        .then(() => {
            t.is(stub.calledOnce, true, "updateAgreement is called once");
            t.is(res.status.calledWith(200), true, "saveAgreement returns status 200 for update");
            t.end();
        });
    dao.updateAgreement.restore();
});

test.cb('saveAgreement returns 500 for error with update', t => {
    const stub = sinon.stub(dao, "updateAgreement");
    stub.throws();
    agreementController.dao = dao;
    req.body.agreementId = 34;
    agreementController.saveAgreement(req, res)
        .then(() => {
            t.is(res.status.calledWith(500), true, "saveAgreement returns status 500 for error with update");
            t.end();
        });
    dao.updateAgreement.restore();
});
