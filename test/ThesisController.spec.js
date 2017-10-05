import test from 'ava';
import sinon from 'sinon';
//import knex from 'knex';
const knex = require('../connection');

const controller = require('../src/controllers/ThesisController');
const dao = require('../src/dao/ThesisDao');
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

test.serial('getThesisById calls output.send() and dao.thesisById()', t => {
    const stubDao = sinon.stub(dao, "getThesisById");
    stubDao.withArgs(req.params.id).returns("ok");

    const resMock = sinon.mock(resAPI);
    const expectation1 = resMock.expects("status").once().withArgs(200).returns(200);

    controller.getThesisById(req, resAPI)
    .then(() => {
        t.truthy(sendStub.calledWith(req.query.outputType, 200, "ok"));
        resMock.verify();
    });
});

test.serial('getAllTheses calls output.send() and dao.getAllTheses()', t => {
    const stubDao = sinon.stub(dao, "getAllTheses");
    stubDao.withArgs(req.params.id).returns("ok");

    const resMock = sinon.mock(resAPI);
    const expectation1 = resMock.expects("status").once().withArgs(200).returns(200);
    controller.getAllTheses(req, resAPI)
        .then(() => {
            t.truthy(sendStub.calledWith(req.query.outputType, 200, "ok"));
            resMock.verify();
        });
    
});