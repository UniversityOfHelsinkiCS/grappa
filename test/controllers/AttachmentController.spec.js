import test from 'ava';
import sinon from 'sinon';

const reqres = require('reqres');

let req;
let res;
let attachmentService;
let attachmentController;

test.beforeEach(async t => {
    req = reqres.req();
    res = reqres.res();
    attachmentService = require('../../src/services/AttachmentService');
    attachmentController = require('../../src/controllers/AttachmentController');
});

test.cb.skip('saveAttachment returns 500 when service throws error', t => {
    req.params.id = 1;
    const stub = sinon.stub(attachmentService, "saveAttachment");
    attachmentController.attachmentService = attachmentService;
    stub.throws();
    attachmentController.saveAttachments(req, res)
        .then(() => {
            t.is(res.status.calledWith(500), true, "saveAttachment returns status 500");
            t.end();
        })
});

test.cb.skip('saveAttachment returns 500 with invalid parameter', t => {
    req.params.id = null;
    attachmentController.saveAttachments(req, res)
        .then(() => {
            t.is(res.status.calledWith(500), true, "saveAttachment returns status 500");
            t.end();
        })
});
