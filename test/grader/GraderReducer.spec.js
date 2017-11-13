import test from 'ava';
import { reducerTest } from 'redux-ava';

import reducer from '../../src/components/grader/GraderReducer';

const councilmeeting = { id: 1, instructorDeadlineDays: 8, studentDeadlineDays: 8, date: "date"}
const councilmeetingEdited = { id: 1, instructorDeadlineDays: 10, studentDeadlineDays: 10, date: "date"}
const councilmeeting2 = { id: 2, instructorDeadlineDays: 8, studentDeadlineDays: 8, date: "date2"}

const councilmeetings = [ councilmeeting, councilmeeting2 ]

const stateWithACouncilmeeting = [ councilmeeting ];
const stateWithCouncilmeetings = councilmeetings;
const stateWithEditedCouncilmeeting = [ councilmeeting2 ];

test.skip('get all success changes state correctly', reducerTest(
    reducer,
    [],
    {
        type: "GRADER_GET_ALL_SUCCESS", 
        response: "test",
    },
    ["test"],
));


/*import test from 'ava';
import { reducerTest } from 'redux-ava';

import graderSave from '../../src/components/grader/GraderReducer';
import reducer from '../../src/components/grader/GraderReducer';
import { saveAddedSuccess,
    saveAddedFailure,
    saveAddedAttempt,
    saveUpdatedAttempt,
    saveUpdatedSuccess,
    saveUpdatedFailure,
    getGradersAttempt,
    getGradersSuccess,
    getGradersFailure } from '../../src/components/grader/GraderActions';

const initialState = [];
const stateWithSaveSuccess = [{ id: 'ADD_GRADER_SAVE_SUCCESS', text: 'Grader/supervisor added', formClass: "success", completed: true }];
const stateWithSaveFailure = [{ id: 'ADD_GRADER_SAVE_FAILURE', text: 'Couldn\'t save a grader/supervisor', formClass: "error", completed: true}];
const stateWithSaveAttempt = [{ id: 'ADD_GRADER_SAVE_ATTEMPT', text: 'Trying to save a grader/supervisor', formClass: "", completed: false }];
const stateWithUpdateSuccess = [{ id: 'UPDATE_GRADER_SAVE_SUCCESS', text: 'Grader/supervisor updated', formClass: "success", completed: true }];
const stateWithUpdateFailure = [{ id: 'UPDATE_GRADER_SAVE_FAILURE', text: 'Couldn\'t update a grader/supervisor', formClass: "error", completed: true}];
const stateWithUpdateAttempt = [{ id: 'UPDATE_GRADER_SAVE_ATTEMPT', text: 'Trying to update a grader/supervisor', formClass: "", completed: false }];
const stateWithGetSuccess = [{ id: 'GET_GRADERS_SUCCESS', text: 'Managed to get graders/supervisors', formClass: "success", completed: true }];
const stateWithGetFailure = [{ id: 'GET_GRADERS_FAILURE', text: 'Couldn\'t get graders/supervisors', formClass: "error", completed: true}];
const stateWithGetAttempt = [{ id: 'GET_GRADERS_ATTEMPT', text: 'Trying to get graders/supervisors', formClass: "", completed: false }];

test('saveSuccess changes state correctly', reducerTest(
    graderSave,
    initialState,
    saveAddedSuccess(),
    stateWithSaveSuccess,
));

test('saveFailure changes state correctly', reducerTest(
    graderSave,
    initialState,
    saveAddedFailure(),
    stateWithSaveFailure,
));

test('saveAttempt changes state correctly', reducerTest(
    graderSave,
    initialState,
    saveAddedAttempt(),
    stateWithSaveAttempt,
));

test('updateSuccess changes state correctly', reducerTest(
    graderSave,
    initialState,
    saveUpdatedSuccess(),
    stateWithUpdateSuccess,
));

test('updateFailure changes state correctly', reducerTest(
    graderSave,
    initialState,
    saveUpdatedFailure(),
    stateWithUpdateFailure,
));

test('updateAttempt changes state correctly', reducerTest(
    graderSave,
    initialState,
    saveUpdatedAttempt(),
    stateWithUpdateAttempt,
));

test('getSuccess changes state correctly', reducerTest(
    graderSave,
    initialState,
    getGradersSuccess(),
    stateWithGetSuccess,
));

test('getFailure changes state correctly', reducerTest(
    graderSave,
    initialState,
    getGradersFailure(),
    stateWithGetFailure,
));

test('getAttempt changes state correctly', reducerTest(
    graderSave,
    initialState,
    getGradersAttempt(),
    stateWithGetAttempt,
));
*/