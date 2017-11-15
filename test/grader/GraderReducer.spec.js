import test from 'ava';
import { reducerTest } from 'redux-ava';
import reducer from '../../src/components/grader/GraderReducer.js';

const graders = [{id: 1, approved: false},{id: 2, approved: true}];
const grader = {id: 3, approved: false};
const reviewedGrader = {id: 3, approved: true};

const stateWithGraders = graders;
const stateWithGrader = [grader];
const stateWithReviewedGrader = [reviewedGrader];

test('get all success changes state correctly', reducerTest(
    reducer,
    [],
    {
        type: "GRADER_GET_ALL_SUCCESS", 
        response: graders,
    },
    stateWithGraders.data,
));

test('save added success changes state correctly', reducerTest(
    reducer,
    [],
    {
        type: "GRADER_SAVE_ONE_SUCCESS", 
        response: grader,
    },
    [stateWithGrader.data],
));

test.skip('delete success changes state correctly', reducerTest(
    reducer,
    [stateWithGrader.data],
    {
        type: "GRADER_DELETE_ONE_SUCCESS", 
        response: grader.id,
    },
    [],
));

test.skip('review success changes state correctly', reducerTest(
    reducer,
    [stateWithGrader],
    {
        type: "GRADER_REVIEW_ONE_SUCCESS", 
        response: reviewedGrader,
    },
    [stateWithReviewedGrader],
));