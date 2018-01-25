import test from 'ava';
import sinon from 'sinon';

const knex = require('../../src/db/connection');

const notificationService = require('../../src/services/NotificationService');

test.before(async (t) => {
    await knex.migrate.latest();
});

test.beforeEach(async (t) => {
    await knex('notification').del();
});

test.serial('notification is saved', async (t) => {
    await notificationService.saveNotification('TEST', 1);
    const notifications = await notificationService.getAllNotifications();

    t.true(notifications.length > 0);
});
