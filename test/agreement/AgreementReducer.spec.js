// external modules
import test from 'ava';
import { reducerTest } from 'redux-ava';

// internal modules
import agreementSave from '../../src/containers/agreement/agreementReducer';
import { saveAttempt, saveSuccess, saveFailure } from '../../src/containers/agreement/agreementActions';

const testData = { some: 'data' };

const initialState = [];
const stateWithSuccessSave = [{ id: 'AGREEMENT_SAVE_SUCCESS', text: 'Sopimus talletettu onnistuneesti', formClass: "success", completed: true }];
const stateWithFailedSave = [{ id: 'AGREEMENT_SAVE_FAILURE', text: 'Sopimuksen talletus epäonnistui', formClass: "error", completed: true}];
const stateWithAttemptedSave = [{ id: 'AGREEMENT_SAVE_ATTEMPT', text: 'Sopimuksen talletus käynnistetty', formClass: "", completed: false }];


test('saveSuccess changes state correctly', reducerTest(
    agreementSave,
    initialState,
    saveSuccess(),
    stateWithSuccessSave,
));
test('saveFailure changes state correctly', reducerTest(
    agreementSave,
    initialState,
    saveFailure(),
    stateWithFailedSave,
));
test('saveAttempt changes state correctly', reducerTest(
    agreementSave,
    initialState,
    saveAttempt(),
    stateWithAttemptedSave,
));


/*
AGREEMENT_SAVE_ATTEMPT
AGREEMENT_SAVE_SUCCESS
AGREEMENT_SAVE_FAILURE
*/
