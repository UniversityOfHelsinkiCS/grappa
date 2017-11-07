import test from 'ava';
import sinon from 'sinon';
import { actionTest } from 'redux-ava';
import 'babel-polyfill';

import * as API from '../../src/util/apiConnection';

import {
    saveAddedSuccess,
    saveAddedFailure,
    saveAddedAttempt,
    saveUpdatedAttempt,
    saveUpdatedSuccess,
    saveUpdatedFailure,
    getGradersAttempt,
    getGradersSuccess,
    getGradersFailure,
    ADD_GRADER_SAVE_ATTEMPT,
    ADD_GRADER_SAVE_SUCCESS,
    ADD_GRADER_SAVE_FAILURE,
    UPDATE_GRADER_SAVE_ATTEMPT,
    UPDATE_GRADER_SAVE_SUCCESS,
    UPDATE_GRADER_SAVE_FAILURE,
    GET_GRADERS_ATTEMPT,
    GET_GRADERS_SUCCESS,
    GET_GRADERS_FAILURE
} from '../../src/components/grader/GraderActions';

const testData = { some: 'data' };
const testDataError = { response: { some: 'error' } };

test('saveAddedSuccess returns correct type', actionTest(
    saveAddedSuccess,
    { data: "some data" },
    testData,
    { type: ADD_GRADER_SAVE_SUCCESS, text: 'Grader/supervisor added', data: { data: "some data" } },
));

test('saveAddedAttempt returns correct type', actionTest(
    saveAddedAttempt,
    { data: "some data" },
    testData,
    { type: ADD_GRADER_SAVE_ATTEMPT, text: 'Trying to save a grader/supervisor' },
));

test('saveAddedFailure returns correct type', actionTest(
    saveAddedFailure,
    { error: "some error" },
    testDataError,
    { type: ADD_GRADER_SAVE_FAILURE, text: 'Couldn\'t save a grader/supervisor', error: { error: "some error" } },
));

test('saveUpdatedSuccess returns correct type', actionTest(
    saveUpdatedSuccess,
    { data: "some data" },
    testData,
    { type: UPDATE_GRADER_SAVE_SUCCESS, text: 'Grader/supervisor updated', data: { data: "some data" } },
));

test('saveUpdatedAttempt returns correct type', actionTest(
    saveUpdatedAttempt,
    { data: "some data" },
    testData,
    { type: UPDATE_GRADER_SAVE_ATTEMPT, text: 'Trying to update a grader/supervisor' },
));

test('saveUpdatedFailure returns correct type', actionTest(
    saveUpdatedFailure,
    { error: "some error" },
    testDataError,
    { type: UPDATE_GRADER_SAVE_FAILURE, text: 'Couldn\'t update a grader/supervisor', error: { error: "some error" } },
));

test('getGradersSuccess returns correct type', actionTest(
    getGradersSuccess,
    { data: "some data" },
    testData,
    { type: GET_GRADERS_SUCCESS, text: 'Managed to get graders/supervisors', data: { data: "some data" } },
));

test('getGradersAttempt returns correct type', actionTest(
    getGradersAttempt,
    { data: "some data" },
    testData,
    { type: GET_GRADERS_ATTEMPT, text: 'Trying to get graders/supervisors' },
));

test('saveUpdatedFailure returns correct type', actionTest(
    getGradersFailure,
    { error: "some error" },
    testDataError,
    { type: GET_GRADERS_FAILURE, text: 'Couldn\'t get graders/supervisors', error: { error: "some error" } },
));
