// external modules
import test from 'ava'
import { reducerTest } from 'redux-ava'

// internal modules
import reducer from './agreementReducer'

const agreement = { id: 1, title: 'test' } // Other fields as well
const agreement2 = { id: 2, title: 'test2' } // Other fields as well
const agreementEdited = { id: 1, title: 'totally different' } // Other fields as well

const stateWithAgreement = [agreement]
const stateWithAgreements = [agreement, agreement2]
const stateWithEditedAgreement = [agreementEdited]

test('get one success changes state correctly', reducerTest(
    reducer,
    stateWithAgreement,
    {
        type: 'AGREEMENT_GET_ONE_SUCCESS',
        response: agreement2
    },
    stateWithAgreements,
))

test('update one success changes state correctly', reducerTest(
    reducer,
    stateWithAgreement,
    {
        type: 'AGREEMENT_UPDATE_ONE_SUCCESS',
        response: agreementEdited
    },
    stateWithEditedAgreement,
))

test('save one success changes state correctly', reducerTest(
    reducer,
    [],
    {
        type: 'AGREEMENT_SAVE_ONE_SUCCESS',
        response: agreement
    },
    stateWithAgreement,
))

test('delete one success changes state correctly', reducerTest(
    reducer,
    stateWithAgreements,
    {
        type: 'AGREEMENT_DELETE_ONE_SUCCESS',
        response: 2
    },
    stateWithAgreement,
))
