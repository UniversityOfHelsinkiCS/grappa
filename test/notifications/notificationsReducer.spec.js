import test from 'ava';
import { reducerTest } from 'redux-ava';

import reducer from '../../src/component/Notification/notificationsReducer';

const notifications = [{ type: 'TEST', userId: 1, timestamp: '' }]

test('get all notifications correctly', reducerTest(
    reducer,
    [],
    {
        type: 'NOTIFICATIONS_GET_ALL_SUCCESS',
        response: notifications
    },
    notifications
));