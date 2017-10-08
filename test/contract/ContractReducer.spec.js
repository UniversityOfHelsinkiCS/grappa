// external modules
import test from 'ava';
import { reducerTest } from 'redux-ava';

// internal modules
import contractSave from '../../src/components/contract/ContractReducer';
import { saveAttempt, saveSuccess, saveFailure } from '../../src/components/contract/ContractActions';

const testData = { some: 'data' };

const initialState = [];
const stateWithSuccessSave = [{ id: 'CONTRACT_SAVE_SUCCESS', text: 'Sopimus talletettu onnistuneesti', formClass: "success", completed: true }];
const stateWithFailedSave = [{ id: 'CONTRACT_SAVE_FAILURE', text: 'Sopimuksen talletus epäonnistui', formClass: "error", completed: true}];
const stateWithAttemptedSave = [{ id: 'CONTRACT_SAVE_ATTEMPT', text: 'Sopimuksen talletus käynnistetty', formClass: "", completed: false }];


test('saveSuccess changes state correctly', reducerTest(
    contractSave,
    initialState,
    saveSuccess(),
    stateWithSuccessSave,
));
test('saveFailure changes state correctly', reducerTest(
    contractSave,
    initialState,
    saveFailure(),
    stateWithFailedSave,
));
test('saveAttempt changes state correctly', reducerTest(
    contractSave,
    initialState,
    saveAttempt(),
    stateWithAttemptedSave,
));


/*
CONTRACT_SAVE_ATTEMPT
CONTRACT_SAVE_SUCCESS
CONTRACT_SAVE_FAILURE
*/
