import test from 'ava';
import sinon from 'sinon';
import router from '../../src/routes/persons.js';

const reqres = require('reqres');

let req;
let res;
let attachmentService;
let attachmentController;
let fileService;

test.beforeEach(async t => {
    req = reqres.req();
    res = reqres.res();
    attachmentService = require('../../src/services/AttachmentService');
    attachmentController = require('../../src/controllers/AttachmentController');
    fileService = require('../../src/services/FileService');
});

test.afterEach(async t => {
});

test.cb('saveAttachment returns 500 when service throws error', t => {
    req.params.id = 1;
    const stub = sinon.stub(attachmentService, "saveAttachment");
    attachmentController.attachmentService = attachmentService;
    stub.throws();
    attachmentController.saveAttachment(req, res)
        .then(() => {
            t.is(res.status.calledWith(500), true, "saveAttachment returns status 500");
            t.end();
        })
});

test.cb('saveAttachment returns 500 with invalid parameter', t => {
    req.params.id = null;
    attachmentController.saveAttachment(req, res)
        .then(() => {
            t.is(res.status.calledWith(500), true, "saveAttachment returns status 500");
            t.end();
        })
});
