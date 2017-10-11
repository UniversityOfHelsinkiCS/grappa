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

test('getAgreementById calls dao.agreementById() once', t => {
    const stub = sinon.stub(dao, "getAgreementById");
    agreementController.dao = dao;
    agreementController.getAgreementById(req, res);
    t.is(stub.calledOnce, true, "agreementById is called once");
    dao.getAgreementById.restore();
});

test('getAgreementById calls dao.agreementById() with correct id', t => {
    const stub = sinon.stub(dao, "getAgreementById");
    req.params.id = 123;
    stub.returns("ok");
    agreementController.dao = dao;
    agreementController.getAgreementById(req, res);
    t.is(stub.calledWith(req.params.id), true, "agreementById is called with correct id");
    dao.getAgreementById.restore();
});

test.cb('getAgreementById returns correct information', t => {
    const stub = sinon.stub(dao, "getAgreementById");
    req.params.id = 123;
    stub.returns({ test: "xoxo" });
    stub.withArgs(req.params.id).returns({ test: "ok" });
    agreementController.dao = dao;
    agreementController.getAgreementById(req, res)
        .then(() => {
            t.is(res.json.calledWith({ test: "ok" }), true, "agreementById returns correct information");
            t.end();
        });
    dao.getAgreementById.restore();
});

test.cb('getAgreementById returns status 200', t => {
    const stub = sinon.stub(dao, "getAgreementById");
    req.params.id = 123;
    stub.returns({ test: "xoxo" });
    stub.withArgs(req.params.id).returns({ test: "ok" });
    agreementController.dao = dao;
    agreementController.getAgreementById(req, res)
        .then(() => {
            t.is(res.status.calledWith(200), true, "agreementById returns status 200");
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

test('saveAgreement calls dao.saveNewAgreement() once', t => {
    const stub = sinon.stub(dao, "saveNewAgreement");
    agreementController.dao = dao;
    agreementController.saveAgreement(req, res);
    t.is(stub.calledOnce, true, "saveNewAgreement is called once");
    dao.saveNewAgreement.restore();
});

test.cb('saveAgreement returns 200 for new agreement', t => {
    const stub = sinon.stub(dao, "saveNewAgreement");
    agreementController.dao = dao;
    agreementController.saveAgreement(req, res)
        .then(() => {
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

test('saveAgreement calls dao.updateAgreement() once', t => {
    const stub = sinon.stub(dao, "updateAgreement");
    agreementController.dao = dao;
    req.body.agreementId = 34;
    agreementController.saveAgreement(req, res);
    t.is(stub.calledOnce, true, "updateAgreement is called once");
    dao.updateAgreement.restore();
});

test.cb('saveAgreement returns 200 for update', t => {
    const stub = sinon.stub(dao, "updateAgreement");
    agreementController.dao = dao;
    req.body.agreementId = 34;
    agreementController.saveAgreement(req, res)
        .then(() => {
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
