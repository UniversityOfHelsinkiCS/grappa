import test from 'ava';
import sinon from 'sinon';

const contractController = require('../src/controllers/ContractController');
const dao = require('../src/dao/ContractDao');
const output = require('../src/output');
const req = {
    query: { outputType: "json" },
    params: { id: 124 }
};
const resAPI = { status: a => { return a } };
const sendStub = sinon.stub(output, "send");

test.afterEach(async t => {
    sendStub.reset();
});

test.serial('getContractById calls output.send() and dao.contractById()', t => {
    const stubDao = sinon.stub(dao, "getContractById");
    stubDao.withArgs(req.params.id).returns("ok");

    const resMock = sinon.mock(resAPI);
    const expectation1 = resMock.expects("status").once().withArgs(200).returns(200);
    
    contractController.getContractById(req, resAPI)
        .then(()=>{
            t.truthy(sendStub.calledWith([req.query.outputType, 200, "ok"]));
            resMock.verify();
        });
    
});

test.serial('saveContract calls output.send() and dao.saveContract()', t => {
    const stubDaoSave = sinon.stub(dao, "saveContract");
    stubDaoSave.withArgs(req).returns("ok");

    const resMock = sinon.mock(resAPI);
    const expectation1 = resMock.expects("status").once().withArgs(200).returns(200);
    contractController.getContractById(req, resAPI)
        .then(() => {
            t.truthy(sendStub.calledWith(req.query.outputType, 200, "ok"));
            resMock.verify();
        });
});