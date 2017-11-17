import test from 'ava';
import sinon from 'sinon';
import { reducerTest } from 'redux-ava';

import reducer from '../../src/containers/councilmeeting/councilmeetingReducer';

const councilmeeting = { id: 1, instructorDeadlineDays: 8, studentDeadlineDays: 8, date: "date" }
const councilmeetingEdited = { id: 1, instructorDeadlineDays: 10, studentDeadlineDays: 10, date: "date" }
const councilmeeting2 = { id: 2, instructorDeadlineDays: 8, studentDeadlineDays: 8, date: "date2" }

const councilmeetings = [councilmeeting, councilmeeting2]

const stateWithACouncilmeeting = [councilmeeting];
const stateWithCouncilmeetings = councilmeetings;
const stateWithEditedCouncilmeeting = [councilmeeting2];

test('get all success changes state correctly', reducerTest(
    reducer,
    [],
    {
        type: "COUNCILMEETING_GET_ALL_SUCCESS",
        response: councilmeetings,
    },
    stateWithCouncilmeetings,
));

test('save success changes state correctly', reducerTest(
    reducer,
    [],
    {
        type: "COUNCILMEETING_SAVE_ONE_SUCCESS",
        response: councilmeeting,
    },
    stateWithACouncilmeeting,
));


test('update success changes state correctly', reducerTest(
    reducer,
    [councilmeeting],
    {
        type: "COUNCILMEETING_UPDATE_ONE_SUCCESS",
        response: councilmeeting2,
    },
    stateWithEditedCouncilmeeting,
));

test('delete success changes state correctly', reducerTest(
    reducer,
    stateWithACouncilmeeting,
    {
        type: "COUNCILMEETING_DELETE_ONE_SUCCESS",
        response: councilmeeting.id,
    },
    []
));