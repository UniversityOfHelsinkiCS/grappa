import test from 'ava';
const knex = require('../../src/db/connection');

const emailDraftService = require('../../src/services/EmailDraftService');

test.before(async t => {
    await knex.migrate.latest();
});

test('can get email drafts', async t => {
    await knex.insert({ title: 'foo', body: 'bar' }).into('emailDraft');
    const drafts = await emailDraftService.getEmailDrafts();

    t.is(drafts.length, 1);
});
