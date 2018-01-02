import test from 'ava';
const knex = require('../../src/db/connection');

const emailDraftService = require('../../src/services/EmailDraftService');

test.before(async t => {
    await knex.migrate.latest();
});

test.beforeEach(async t => {
    await knex('emailDraft').del();
});

test('can get email drafts', async t => {
    await knex.insert({ title: 'foo', body: 'bar' }).into('emailDraft');
    const drafts = await emailDraftService.getEmailDrafts();

    t.true(drafts.length > 0);
});

test('can update email draft', async t => {
    const emailDraft = await knex.insert({ title: 'foo', body: 'bar' })
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
    const emailDraft = { title: 'new mail', body: 'new mail' };
    const draftId = await emailDraftService.saveEmailDraft(emailDraft);
    const draft = await knex.select().from('emailDraft').where('emailDraftId', draftId).first();
    t.is(draft.title, emailDraft.title);
    t.is(draft.body, emailDraft.body);
});

test('can delete email draft', async t => {
    const emailDraft = await knex.insert({ title: 'foo', body: 'bar' })
        .into('emailDraft')
        .returning('emailDraftId');
    const draftId = emailDraft[0];

    await emailDraftService.deleteEmailDraft(draftId);
    const drafts = await emailDraftService.getEmailDrafts();

    t.true(drafts.filter(draft => draft.emailDraftId === draftId).length === 0);
});
