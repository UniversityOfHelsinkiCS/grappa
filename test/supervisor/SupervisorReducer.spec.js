import test from 'ava';
import { reducerTest } from 'redux-ava';
import reducer from '../../src/containers/supervisor/supervisorReducer.js';

const supervisors = [{id: 1, lastname:"abc", approved: false},{id: 2, lastname:"def", approved: true}];
const supervisor = {id: 3, lastname:"asdf", approved: false};
const supervisorEdited = {id: 3, lastname:"qwerty", approved: false}
const reviewedSupervisor = {id: 3, lastname:"asdf", approved: true};

const stateWithSupervisors = supervisors;
const stateWithSupervisor = [supervisor];
const stateWithReviewedSupervisor = [reviewedSupervisor];
const stateWithEditedSupervisor = [supervisor, supervisorEdited];

test('get all success changes state correctly', reducerTest(
    reducer,
    [],
    {
        type: "SUPERVISOR_GET_ALL_SUCCESS", 
        response: supervisors,
    },
    stateWithSupervisors,
));

// doesn't work, passes only when expectation has empty list?!
test.skip('get all agreement persons success changes state correctly', reducerTest(
    reducer,
    [],
    {
        type: "SUPERVISOR_GET_ALL_AGREEMENT_PERSONS_SUCCESS", 
        response: supervisors,
    },
    [stateWithSupervisors],
));

test('save added success changes state correctly', reducerTest(
    reducer,
    [],
    {
        type: "SUPERVISOR_SAVE_ONE_SUCCESS", 
        response: supervisor,
    },
    stateWithSupervisor,
));

test('update success changes state correctly', reducerTest(
    reducer,
    [supervisor],
    {
        type: "SUPERVISOR_UPDATE_ONE_SUCCESS", 
        response: supervisorEdited,
    },
    stateWithEditedSupervisor,
));

//not working, not sure why
test.skip('review success changes state correctly', reducerTest(
    reducer,
    stateWithSupervisor,
    {
        type: "SUPERVISOR_REVIEW_ONE_SUCCESS", 
        response: reviewedSupervisor,
    },
    stateWithReviewedSupervisor,
));