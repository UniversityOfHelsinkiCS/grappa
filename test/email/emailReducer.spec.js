import test from 'ava';
import sinon from 'sinon';
import { reducerTest } from 'redux-ava';

import reducer from '../../src/containers/email/emailReducer';

const email = { id: 1, title: "Otsikko", body: "Sisältö" }
const emailEdited = { id: 1, title: "Title", body: "Body" }
const email2 = { id: 2, title: "Otsikko2", body: "Sisältö2" }

const emails = [email, email2]

const stateWithAEmail = [email];
const stateWithEmails = emails;
const stateWithEditedEmail = [email2];

test('get all success changes state correctly', reducerTest(
    reducer,
    [],
    {
        type: "EMAILDRAFT_GET_ALL_SUCCESS",
        response: emails,
    },
    stateWithEmails,
));

test('save success changes state correctly', reducerTest(
    reducer,
    [],
    {
        type: "EMAILDRAFT_SAVE_ONE_SUCCESS",
        response: email,
    },
    stateWithAEmail,
));


test('update success changes state correctly', reducerTest(
    reducer,
    [email],
    {
        type: "EMAILDRAFT_UPDATE_ONE_SUCCESS",
        response: email2,
    },
    stateWithEditedEmail,
));

test('delete success changes state correctly', reducerTest(
    reducer,
    stateWithAEmail,
    {
        type: "EMAILDRAFT_DELETE_ONE_SUCCESS",
        response: email.id,
    },
    []
));