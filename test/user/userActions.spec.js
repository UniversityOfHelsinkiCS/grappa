import test from 'ava';
import sinon from 'sinon';
import { actionTest } from 'redux-ava';
import 'babel-polyfill';

import * as API from '../../src/util/apiConnection';

import {
    changeAttempt,
    changeFailure,
    changeSuccess,
    CHANGE_ROLE_ATTEMPT,
    CHANGE_ROLE_SUCCESS,
    CHANGE_ROLE_FAILURE,
} from '../../src/components/user/UserActions';

const userTestData = { some: 'data' };
const userTestDataError = { response: { some: 'error' } };

test ('test test', t => {
    t.truthy(true);
});

test('changeSuccess returns correct type', actionTest(
    changeSuccess,
    { data: "some data" },
    userTestData,
    { type: CHANGE_ROLE_SUCCESS, text: 'User role changed', data: { data: "some data" } },
));

test('changeAttemt returns correct type', actionTest(
    changeAttempt,
    { data: "some data" },
    userTestData,
    { type: CHANGE_ROLE_ATTEMPT, text: 'Changing user role...', data: { data: "some data" } },
));

test('changeFailure returns correct type', actionTest(
    changeFailure,
    { error: "some error" },
    userTestDataError,
    { type: CHANGE_ROLE_FAILURE, text: 'Couldn\'t change user role', error: { error: "some error" } },
));