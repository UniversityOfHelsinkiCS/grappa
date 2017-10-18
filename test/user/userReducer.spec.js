import test from 'ava';
import sinon from 'sinon';
import { reducerTest } from 'redux-ava';

import changeUserRole from '../../src/components/user/UserReducer';
import { changeAttempt, changeSuccess, changeFailure } from '../../src/components/user/UserActions';

const testData = { some: 'data' };

const initialState = [];
// I wonder if actually the role should be visible here and not undefined...
const stateWithSuccessChange = [{ id: 'CHANGE_ROLE_SUCCESS', text: 'User role changed', role: undefined, formClass: "success", completed: true }];
const stateWithFailedChange = [{ id: 'CHANGE_ROLE_FAILURE', text: 'Couldn\'t change user role', formClass: "error", completed: true}];
const stateWithAttemptedChange = [{ id: 'CHANGE_ROLE_FAILURE', text: 'Changing user role...', formClass: "", completed: false }];

test('saveSuccess changes state correctly', reducerTest(
    changeUserRole,
    initialState,
    changeSuccess(),
    stateWithSuccessChange,
));

test('saveFailure changes state correctly', reducerTest(
    changeUserRole,
    initialState,
    changeFailure(),
    stateWithFailedChange,
));