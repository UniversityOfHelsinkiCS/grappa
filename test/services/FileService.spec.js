import test from 'ava';
import sinon from 'sinon';

const fileService = require('../../src/services/FileService');
const fs = require('fs');

test.serial('savePdfFile', async t => {
    var fd = fs.openSync('testfile', 'w');
    let attachmentId = 20;
    let response = await fileService.savePdfFile(fd, attachmentId);
    // TODO: fix type error
    t.deepEqual(response, true);
});