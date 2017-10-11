import test from 'ava';
import sinon from 'sinon';

import router from '../src/routes/theses.js';

const reqres = require('reqres');

let req;
let res;
let thesisController;
let dao;

test.beforeEach(async t => {
    req = reqres.req();
    res = reqres.res();
    dao = require('../src/dao/ThesisDao');
    thesisController = require('../src/controllers/ThesisController');
});

test('getThesisById calls dao.thesisById() once', t => {
    const stub = sinon.stub(dao, "getThesisById");
    thesisController.dao = dao;
    thesisController.getThesisById(req, res);
    t.is(stub.calledOnce, true, "thesisById is called once");
    dao.getThesisById.restore();
});

test('getThesisById calls dao.thesisById() with correct id', t => {
    const stub = sinon.stub(dao, "getThesisById");
    req.params.id = 123;
    stub.returns("ok");
    thesisController.dao = dao;
    thesisController.getThesisById(req, res);
    t.is(stub.calledWith(req.params.id), true, "thesisById is called with correct id");
    dao.getThesisById.restore();
});

test.cb('getThesisById returns correct information', t => {
    const stub = sinon.stub(dao, "getThesisById");
    req.params.id = 123;
    stub.returns({ test: "xoxo" });
    stub.withArgs(req.params.id).returns({ test: "ok" });
    thesisController.dao = dao;
    thesisController.getThesisById(req, res)
        .then(() => {
            t.is(res.json.calledWith({ test: "ok" }), true, "thesisById returns correct information");
            t.end();
        });
    dao.getThesisById.restore();
});

test.cb('getThesisById returns status 200', t => {
    const stub = sinon.stub(dao, "getThesisById");
    req.params.id = 123;
    stub.returns({ test: "xoxo" });
    stub.withArgs(req.params.id).returns({ test: "ok" });
    thesisController.dao = dao;
    thesisController.getThesisById(req, res)
        .then(() => {
            t.is(res.status.calledWith(200), true, "thesisById returns status 200");
            t.end();
        });
    dao.getThesisById.restore();
});

test('getAllTheses calls dao.getAllTheses() once', t => {
    const stub = sinon.stub(dao, "getAllTheses");
    thesisController.dao = dao;
    thesisController.getAllTheses(req, res);
    t.is(stub.calledOnce, true, "getAllTheses is called once");
    dao.getAllTheses.restore();
});

test.cb('getAllTheses returns correct information', t => {
    const stub = sinon.stub(dao, "getAllTheses");
    stub.returns({ test: "xoxo" });
    thesisController.dao = dao;
    thesisController.getAllTheses(req, res)
        .then(() => {
            t.is(res.json.calledWith({ test: "xoxo" }), true, "getAllTheses returns correct information");
            t.end();
        });
    dao.getAllTheses.restore();
});

test.cb('getAllTheses returns status 200', t => {
    const stub = sinon.stub(dao, "getAllTheses");
    stub.returns({ test: "xoxo" });
    stub.withArgs(req.params.id).returns({ test: "ok" });
    thesisController.dao = dao;
    thesisController.getAllTheses(req, res)
        .then(() => {
            t.is(res.status.calledWith(200), true, "getAllTheses returns status 200");
            t.end();
        });
    dao.getAllTheses.restore();
});
