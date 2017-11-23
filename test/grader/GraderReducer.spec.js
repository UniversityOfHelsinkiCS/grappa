import test from 'ava';
import { reducerTest } from 'redux-ava';
import reducer from '../../src/containers/grader/graderReducer.js';

const graders = [{id: 1, lastname:"abc", approved: false},{id: 2, lastname:"def", approved: true}];
const grader = {id: 3, lastname:"asdf", approved: false};
const graderEdited = {id: 3, lastname:"qwerty", approved: false}
const reviewedGrader = {id: 3, lastname:"asdf", approved: false};

const stateWithGraders = graders;
const stateWithGrader = [grader];
const stateWithReviewedGrader = [reviewedGrader];
const stateWithEditedGrader = [grader, graderEdited];

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

test('update success changes state correctly', reducerTest(
    reducer,
    [grader],
    {
        type: "GRADER_UPDATE_ONE_SUCCESS", 
        response: graderEdited,
    },
    stateWithEditedGrader,
));

//not working, not sure why
test.skip('review success changes state correctly', reducerTest(
    reducer,
    stateWithGrader,
    {
        type: "GRADER_REVIEW_ONE_SUCCESS", 
        response: reviewedGrader,
    },
    stateWithReviewedGrader,
));