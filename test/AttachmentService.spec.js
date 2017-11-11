import test from 'ava';
import sinon from 'sinon';
import knex from '../connection';

const attachmentService = require('../src/services/AttachmentService');
const mockAttachments = require('../src/mockdata/MockAttachments');

test.before(async t => {
    await knex.schema.createTable('attachment', function (table) {
        table.increments('attachmentId').primary();
        table.integer('agreementId').unsigned(); //author
        table.foreign('agreementId').references('agreement.agreementId');
        table.string('filename');
        table.string('type');
        table.boolean('savedOnDisk');
    })
});

test.beforeEach(async t => {
    await knex('attachment').del();
    await knex('attachment').insert(mockAttachments);
});

test.serial('saveAttachment returns correct ID', async t => {
    const newAttachment = {
        agreementId: 2,
        filename: 'NewAttachment',
        type: 'pdf',
        savedOnDisk: false
    }
    const newId = mockAttachments.length + 1;
    let response = await attachmentService.saveAttachment(newAttachment);
    t.deepEqual(response, newId);
});

test.serial('updateAttachment', async t => {
    const updatedAttachment = {
        attachmentId: 1,
        filename: 'UpdatedFilename'
    }
    let response = await attachmentService.updateAttachment(updatedAttachment);
    t.deepEqual(response, undefined);
});
