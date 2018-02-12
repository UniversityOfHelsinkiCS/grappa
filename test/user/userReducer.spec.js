import test from 'ava';
import { reducerTest } from 'redux-ava';

import reducer from '../../src/component/User/userReducer';
import { userRoles } from '../../src/util/rolePermissions';

test('login changes state correctly', reducerTest(
    reducer,
    {},
    {
        type: 'USER_LOGIN_SUCCESS',
        response: userRoles[0]
    },
    userRoles[0]
));

test('logout changes state correctly', reducerTest(
    reducer,
    userRoles[0],
    {
        type: 'USER_LOGOUT_SUCCESS'
    },
    {},
));
