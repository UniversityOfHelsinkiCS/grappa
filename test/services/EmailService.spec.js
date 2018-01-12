import test from 'ava';
import sinon from 'sinon';
import knex from '../../src/db/connection';

const emailService = require('../../src/services/EmailService');
const mailer = require('../../src/util/mailer');

test.before(async t => {
    await knex.migrate.latest();
    await knex.seed.run();
});

test('Resp prof get notification when thesis is added to grappa', async t => {
    t.plan(2);

    sinon.stub(mailer, 'sendEmail').callsFake((email, title) => {
        t.is(title, 'Thesis added to Grappa');
        t.is(email, 'venla@vastuuproffa.com');
    });

    await emailService.newThesisAddedNotifyRespProf(2);
});
