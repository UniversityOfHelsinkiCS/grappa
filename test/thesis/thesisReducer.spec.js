import test from 'ava';
import sinon from 'sinon';
import { reducerTest } from 'redux-ava';

import reducer from '../../src/containers/thesis/thesisReducer';

const thesis = { id: 1, title: "Testien jännittävyys", authorFirstname: "Testaaja" }
const thesisEdited = { id: 1, title: "Testien vaikeus", authorFirstname: "Testaaja" }
const thesis2 = { id: 2, title: "Koodin rikkominen", authorFirstname: "Hakkeri" }

const theses = [thesis, thesis2]
const thesesUpdated = [thesis2, thesisEdited] //Not sorted

test('get all changes state correctly', reducerTest(
    reducer,
    [],
    {
        type: "THESIS_GET_ALL_SUCCESS",
        response: theses,
    },
    theses
));

test('save one changes state correctly', reducerTest(
    reducer,
    [thesis],
    {
        type: "THESIS_SAVE_ONE_SUCCESS",
        response: thesis2,
    },
    theses
));

test('update one changes state correctly', reducerTest(
    reducer,
    theses,
    {
        type: "THESIS_UPDATE_ONE_SUCCESS",
        response: thesisEdited,
    },
    thesesUpdated
));

test('delete one changes state correctly', reducerTest(
    reducer,
    theses,
    {
        type: "THESIS_DELETE_ONE_SUCCESS",
        response: thesis2.id,
    },
    [thesis]
));