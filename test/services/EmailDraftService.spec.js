import test from 'ava';
const knex = require('../../src/db/connection');

const emailDraftService = require('../../src/services/EmailDraftService');

test.before(async t => {
    await knex.migrate.latest();
    await knex('emailDraft').del();
});

test('can get email drafts', async t => {
    await knex.insert({ type: 'getAllTest', title: 'foo', body: 'bar' }).into('emailDraft');
    const drafts = await emailDraftService.getEmailDrafts();

    t.true(drafts.length > 0);
});

test('can update email draft', async t => {
    const emailDraft = await knex.insert({ type: 'updateTest', title: 'foo', body: 'bar' })
        .into('emailDraft')
        .returning('emailDraftId');
    const draftId = emailDraft[0];

    await emailDraftService.updateEmailDraft(draftId, {
        title: 'new title',
        body: 'new body'
    });

    const updatedDraft = await knex.select().from('emailDraft').where('emailDraftId', draftId).first();
    t.is(updatedDraft.title, 'new title');
    t.is(updatedDraft.body, 'new body');
});

test('can save new email draft', async t => {
    const emailDraft = { type: 'newTest', title: 'new mail', body: 'new mail' };
    const draftId = await emailDraftService.saveEmailDraft(emailDraft);
    const draft = await knex.select().from('emailDraft').where('emailDraftId', draftId).first();
    t.is(draft.title, emailDraft.title);
    t.is(draft.body, emailDraft.body);
});

test('can delete email draft', async t => {
    const emailDraft = await knex.insert({ type: 'deleteTest', title: 'foo', body: 'bar' })
        .into('emailDraft')
        .returning('emailDraftId');
    const draftId = emailDraft[0];

    await emailDraftService.deleteEmailDraft(draftId);
    const drafts = await emailDraftService.getEmailDrafts();

    t.true(drafts.filter(draft => draft.emailDraftId === draftId).length === 0);
});

test('get email draft for type and studyfield', async t => {
    const email1 = { type: 'studyfieldTest1', title: 'foo', body: 'bar', studyfield: 1 };
    const email2 = { type: 'studyfieldTest1', title: 'studyfield2', body: 'bar', studyfield: 2 };
    await knex('emailDraft').insert(email1);
    await knex('emailDraft').insert(email2);

    const draft = await emailDraftService.getEmailDraft('studyfieldTest1', 2);
    t.is(draft.title, 'studyfield2');
});

test('get default email draft if studyfield mail is not specified', async t => {
    const email1 = { type: 'studyfieldTest2', title: 'foo', body: 'bar', studyfield: 1 };
    const email2 = { type: 'studyfieldTest2', title: 'default mail', body: 'bar' };
    await knex('emailDraft').insert(email1);
    await knex('emailDraft').insert(email2);

    const draft = await emailDraftService.getEmailDraft('studyfieldTest2', 2);
    t.is(draft.title, 'default mail');
});
