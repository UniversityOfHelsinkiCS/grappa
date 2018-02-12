import test from 'ava';
import { reducerTest } from 'redux-ava';

import reducer from './councilmeetingReducer';

const councilmeeting = { councilmeetingId: 1, instructorDeadlineDays: 8, studentDeadlineDays: 8, date: 'date' };
const councilmeetingEdited = { councilmeetingId: 1, instructorDeadlineDays: 10, studentDeadlineDays: 10, date: 'date' };
const councilmeeting2 = { councilmeetingId: 2, instructorDeadlineDays: 8, studentDeadlineDays: 8, date: 'date2' };

const councilmeetings = [councilmeeting, councilmeeting2];

const stateWithACouncilmeeting = [councilmeeting];
const stateWithCouncilmeetings = councilmeetings;
const stateWithEditedCouncilmeeting = [councilmeetingEdited];

test('get all success changes state correctly', reducerTest(
    reducer,
    [],
    {
        type: 'COUNCILMEETING_GET_ALL_SUCCESS',
        response: councilmeetings
    },
    stateWithCouncilmeetings,
));

test('save success changes state correctly', reducerTest(
    reducer,
    [],
    {
        type: 'COUNCILMEETING_SAVE_ONE_SUCCESS',
        response: councilmeeting
    },
    stateWithACouncilmeeting,
));


test('update success changes state correctly', reducerTest(
    reducer,
    [councilmeeting],
    {
        type: 'COUNCILMEETING_UPDATE_ONE_SUCCESS',
        response: councilmeetingEdited
    },
    stateWithEditedCouncilmeeting,
));

test('delete success changes state correctly', reducerTest(
    reducer,
    stateWithACouncilmeeting,
    {
        type: 'COUNCILMEETING_DELETE_ONE_SUCCESS',
        response: { councilmeetingId: councilmeeting.councilmeetingId }
    },
    []
));
