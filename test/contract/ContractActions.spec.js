// external modules
import test from 'ava';
import sinon from 'sinon';
import { actionTest } from 'redux-ava';

// internal modules
import * as API from '../../src/util/apiConnection';
import {
    saveAttempt,
    saveSuccess,
    saveFailure,
    saveContract,
    CONTRACT_SAVE_ATTEMPT,
    CONTRACT_SAVE_SUCCESS,
    CONTRACT_SAVE_FAILURE
} from '../../src/components/contract/ContractActions';

const contractTestData = { some: 'data' };

const callApiStub = sinon.stub(API, 'callApi').withArgs('/contract', 'post', contractTestData)
    .returns(Promise.resolve(contractTestData));

test('saveSuccess returns correct type', actionTest(
    saveSuccess,
    {data: "some data"},
    contractTestData,
    { type: CONTRACT_SAVE_SUCCESS, text: 'Sopimus talletettu onnistuneesti' , data: {data: "some data"}},
));

test('saveFailure returns correct type', actionTest(
    saveFailure,
    {error: "some error"},
    contractTestData,
    { type: CONTRACT_SAVE_FAILURE, text: 'Sopimuksen talletus epäonnistui', error: {error: "some error"} },
));

test('saveAttempt returns correct type', actionTest(
    saveAttempt,
    contractTestData,
    { type: CONTRACT_SAVE_ATTEMPT, text: 'Sopimuksen talletus käynnistetty' },
));

test.skip('saveContract returns correct type', t => (
    saveContract(contractTestData).then(res => console.log(res))
    //kunnon kamaa tänne
));
/*
CONTRACT_SAVE_ATTEMPT
CONTRACT_SAVE_SUCCESS
CONTRACT_SAVE_FAILURE
*/
