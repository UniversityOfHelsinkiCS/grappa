import test from 'ava';
import sinon from 'sinon';
import router from '../src/routes/contracts.js';

const reqres = require('reqres');

let req;
let res;
let contractController;
let service;

test.beforeEach(async t => {
    req = reqres.req();
    res = reqres.res();
    service = require('../src/services/ContractService');
    contractController = require('../src/controllers/ContractController');
});

test.afterEach(async t => {
});

test('getContractById calls service.contractById() once', t => {
    const stub = sinon.stub(service, "getContractById");
    contractController.service = service;
    contractController.getContractById(req, res);
    t.is(stub.calledOnce, true, "contractById is called once");
    service.getContractById.restore();
});

test('getContractById calls service.contractById() with correct id', t => {
    const stub = sinon.stub(service, "getContractById");
    req.params.id = 123;
    stub.returns("ok");
    contractController.service = service;
    contractController.getContractById(req, res);
    t.is(stub.calledWith(req.params.id), true, "contractById is called with correct id");
    service.getContractById.restore();
});

test.cb('getContractById returns correct information', t => {
    const stub = sinon.stub(service, "getContractById");
    req.params.id = 123;
    stub.returns({ test: "xoxo" });
    stub.withArgs(req.params.id).returns({ test: "ok" });
    contractController.service = service;
    contractController.getContractById(req, res)
        .then(() => {
            t.is(res.json.calledWith({ test: "ok" }), true, "contractById returns correct information");
            t.end();
        });
    service.getContractById.restore();
});

test.cb('getContractById returns status 200', t => {
    const stub = sinon.stub(service, "getContractById");
    req.params.id = 123;
    stub.returns({ test: "xoxo" });
    stub.withArgs(req.params.id).returns({ test: "ok" });
    contractController.service = service;
    contractController.getContractById(req, res)
        .then(() => {
            t.is(res.status.calledWith(200), true, "contractById returns status 200");
            t.end();
        });
    service.getContractById.restore();
});

test.cb('getContractById does not return incorrect information', t => {
    const stub = sinon.stub(service, "getContractById");
    req.params.id = 123;
    stub.returns({ test: "nok" });
    contractController.service = service;
    contractController.getContractById(req, res)
        .then(() => {
            t.not(res.json.calledWith({ test: "xoxo" }), true, "contractById does not return incorrect information");
            t.end();
        });
    service.getContractById.restore();
});

test('saveContract calls service.saveNewContract() once', t => {
    const stub = sinon.stub(service, "saveNewContract");
    contractController.service = service;
    contractController.saveContract(req, res);
    t.is(stub.calledOnce, true, "saveNewContract is called once");
    service.saveNewContract.restore();
});

test.cb('saveContract returns 200 for new agreement', t => {
    const stub = sinon.stub(service, "saveNewContract");
    contractController.service = service;
    contractController.saveContract(req, res)
        .then(() => {
            t.is(res.status.calledWith(200), true, "saveContract returns status 200 for new agreement");
            t.end();
        });
    service.saveNewContract.restore();
});

test.cb('saveContract returns 500 for error with new agreement', t => {
    const stub = sinon.stub(service, "saveNewContract");
    stub.throws();
    contractController.service = service;
    contractController.saveContract(req, res)
        .then(() => {
            t.is(res.status.calledWith(500), true, "saveContract returns status 500 for error with new agreement");
            t.end();
        });
    service.saveNewContract.restore();
});

test('saveContract calls service.updateContract() once', t => {
    const stub = sinon.stub(service, "updateContract");
    contractController.service = service;
    req.body.contractId = 34;
    contractController.saveContract(req, res);
    t.is(stub.calledOnce, true, "updateContract is called once");
    service.updateContract.restore();
});

test.cb('saveContract returns 200 for update', t => {
    const stub = sinon.stub(service, "updateContract");
    contractController.service = service;
    req.body.contractId = 34;
    contractController.saveContract(req, res)
        .then(() => {
            t.is(res.status.calledWith(200), true, "saveContract returns status 200 for update");
            t.end();
        });
    service.updateContract.restore();
});

test.cb('saveContract returns 500 for error with update', t => {
    const stub = sinon.stub(service, "updateContract");
    stub.throws();
    contractController.service = service;
    req.body.contractId = 34;
    contractController.saveContract(req, res)
        .then(() => {
            t.is(res.status.calledWith(500), true, "saveContract returns status 500 for error with update");
            t.end();
        });
    service.updateContract.restore();
});
