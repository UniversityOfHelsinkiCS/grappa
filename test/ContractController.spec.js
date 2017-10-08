import test from 'ava';
import sinon from 'sinon';
import router from '../src/routes/contracts.js';

const reqres = require('reqres');

//const req = {
//    query: { outputType: "json" },
//    params: { id: 124 }
//};

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


test.todo('saveContract');

//test.serial('saveContract calls output.send() and dao.saveContract()', t => {
//    const stubDaoSave = sinon.stub(dao, "saveContract");
//    stubDaoSave.withArgs(req).returns("ok");

//    const resMock = sinon.mock(resAPI);
//    const expectation1 = resMock.expects("status").once().withArgs(200).returns(200);
//    contractController.getContractById(req, resAPI)
//        .then(() => {
//            t.truthy(sendStub.calledWith(req.query.outputType, 200, "ok"));
//            resMock.verify();
//        });
//});
