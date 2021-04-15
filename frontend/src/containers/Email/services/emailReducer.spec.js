import test from 'ava'
import { reducerTest } from 'redux-ava'

import reducer from './emailReducer'

const email = { emailDraftId: 1, title: 'Otsikko', body: 'Sisältö' }
const email2 = { emailDraftId: 2, title: 'Otsikko2', body: 'Sisältö2' }

const emails = [email, email2]

const stateWithAEmail = [email]
const stateWithEmails = emails
const stateWithEditedEmail = [email]

test('get all success changes state correctly', reducerTest(
    reducer,
    [],
    {
        type: 'EMAILDRAFT_GET_ALL_SUCCESS',
        response: emails
    },
    stateWithEmails,
))

test('save success changes state correctly', reducerTest(
    reducer,
    [],
    {
        type: 'EMAILDRAFT_SAVE_ONE_SUCCESS',
        response: email
    },
    stateWithAEmail,
))


test('update success changes state correctly', reducerTest(
    reducer,
    [email],
    {
        type: 'EMAILDRAFT_UPDATE_ONE_SUCCESS',
        response: email
    },
    stateWithEditedEmail,
))

test('delete success changes state correctly', reducerTest(
    reducer,
    stateWithAEmail,
    {
        type: 'EMAILDRAFT_DELETE_ONE_SUCCESS',
        response: email.emailDraftId
    },
    []
))
