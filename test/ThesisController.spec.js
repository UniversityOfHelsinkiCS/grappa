import test from 'ava';
import sinon from 'sinon';

const controller = require('../src/controllers/ThesisController');
const dao = require('../src/dao/ThesisDao');
const output = require('../src/output');
const req = {
    query: { outputType: "json" },
    params: { id: 124 }
};
const resAPI = { status: a => { return a } };
const sendStub = sinon.stub(output, "send");

test('getThesisById calls output.send() and dao.contractById()', t => {
    const stubDao = sinon.stub(dao, "getThesisById");
    stubDao.withArgs(req.params.id).returns("ok");

    const resMock = sinon.mock(resAPI);
    const expectation1 = resMock.expects("status").once().withArgs(200).returns(200);
    controller.getThesisById(req, resAPI);

    t.truthy(sendStub.calledWith(req.query.outputType, 200, "ok"));
    resMock.verify();
});

test('getAllTheses calls output.send() and dao.getAllTheses()', t => {
    const stubDao = sinon.stub(dao, "getAllTheses");
    stubDao.withArgs(req.params.id).returns("ok");

    const resMock = sinon.mock(resAPI);
    const expectation1 = resMock.expects("status").once().withArgs(200).returns(200);
    controller.getAllTheses(req, resAPI);

    t.truthy(sendStub.calledWith(req.query.outputType, 200, "ok"));
    resMock.verify();
});
