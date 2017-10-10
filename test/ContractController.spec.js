import test from 'ava';
import sinon from 'sinon';
import router from '../src/routes/contracts.js';

const reqres = require('reqres');

let req;
let res;
let contractController;
let dao;

test.beforeEach(async t => {
    req = reqres.req();
    res = reqres.res();
    dao = require('../src/dao/ContractDao');
    contractController = require('../src/controllers/ContractController');
});

test.afterEach(async t => {
});

test('getContractById calls dao.contractById() once', t => {
    const stub = sinon.stub(dao, "getContractById");
    contractController.dao = dao;
    contractController.getContractById(req, res);
    t.is(stub.calledOnce, true, "contractById is called once");
    dao.getContractById.restore();
});

test('getContractById calls dao.contractById() with correct id', t => {
    const stub = sinon.stub(dao, "getContractById");
    req.params.id = 123;
    stub.returns("ok");
    contractController.dao = dao;
    contractController.getContractById(req, res);
    t.is(stub.calledWith(req.params.id), true, "contractById is called with correct id");
    dao.getContractById.restore();
});

test.cb('getContractById returns correct information', t => {
    const stub = sinon.stub(dao, "getContractById");
    req.params.id = 123;
    stub.returns({ test: "xoxo" });
    stub.withArgs(req.params.id).returns({ test: "ok" });
    contractController.dao = dao;
    contractController.getContractById(req, res)
        .then(() => {
            t.is(res.json.calledWith({ test: "ok" }), true, "contractById returns correct information");
            t.end();
        });
    dao.getContractById.restore();
});

test.cb('getContractById returns status 200', t => {
    const stub = sinon.stub(dao, "getContractById");
    req.params.id = 123;
    stub.returns({ test: "xoxo" });
    stub.withArgs(req.params.id).returns({ test: "ok" });
    contractController.dao = dao;
    contractController.getContractById(req, res)
        .then(() => {
            t.is(res.status.calledWith(200), true, "contractById returns status 200");
            t.end();
        });
    dao.getContractById.restore();
});

test.cb('getContractById does not return incorrect information', t => {
    const stub = sinon.stub(dao, "getContractById");
    req.params.id = 123;
    stub.returns({ test: "nok" });
    contractController.dao = dao;
    contractController.getContractById(req, res)
        .then(() => {
            t.not(res.json.calledWith({ test: "xoxo" }), true, "contractById does not return incorrect information");
            t.end();
        });
    dao.getContractById.restore();
});

test('saveContract calls dao.saveNewContract() once', t => {
    const stub = sinon.stub(dao, "saveNewContract");
    contractController.dao = dao;
    contractController.saveContract(req, res);
    t.is(stub.calledOnce, true, "saveNewContract is called once");
    dao.saveNewContract.restore();
});

test.cb('saveContract returns 200 for new agreement', t => {
    const stub = sinon.stub(dao, "saveNewContract");
    contractController.dao = dao;
    contractController.saveContract(req, res)
        .then(() => {
            t.is(res.status.calledWith(200), true, "saveContract returns status 200 for new agreement");
            t.end();
        });
    dao.saveNewContract.restore();
});

test.cb('saveContract returns 500 for error with new agreement', t => {
    const stub = sinon.stub(dao, "saveNewContract");
    stub.throws();
    contractController.dao = dao;
    contractController.saveContract(req, res)
        .then(() => {
            t.is(res.status.calledWith(500), true, "saveContract returns status 500 for error with new agreement");
            t.end();
        });
    dao.saveNewContract.restore();
});

test('saveContract calls dao.updateContract() once', t => {
    const stub = sinon.stub(dao, "updateContract");
    contractController.dao = dao;
    req.body.contractId = 34;
    contractController.saveContract(req, res);
    t.is(stub.calledOnce, true, "updateContract is called once");
    dao.updateContract.restore();
});

test.cb('saveContract returns 200 for update', t => {
    const stub = sinon.stub(dao, "updateContract");
    contractController.dao = dao;
    req.body.contractId = 34;
    contractController.saveContract(req, res)
        .then(() => {
            t.is(res.status.calledWith(200), true, "saveContract returns status 200 for update");
            t.end();
        });
    dao.updateContract.restore();
});

test.cb('saveContract returns 500 for error with update', t => {
    const stub = sinon.stub(dao, "updateContract");
    stub.throws();
    contractController.dao = dao;
    req.body.contractId = 34;
    contractController.saveContract(req, res)
        .then(() => {
            t.is(res.status.calledWith(500), true, "saveContract returns status 500 for error with update");
            t.end();
        });
    dao.updateContract.restore();
});
