// external modules
import test from 'ava';
import sinon from 'sinon';
import { actionTest } from 'redux-ava';
import 'babel-polyfill';

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
const contractTestDataError = { response: { some: 'error' } };

const callApiStub = sinon.stub(API, 'callApi')
    .withArgs('/contract', 'post', contractTestData)
    .returns(Promise.resolve(contractTestData))
    .withArgs('/contract', 'post', contractTestDataError).returns(Promise.reject(contractTestDataError));

test('saveSuccess returns correct type', actionTest(
    saveSuccess,
    { data: "some data" },
    contractTestData,
    { type: CONTRACT_SAVE_SUCCESS, text: 'Sopimus talletettu onnistuneesti', data: { data: "some data" } },
));

test('saveFailure returns correct type', actionTest(
    saveFailure,
    { error: "some error" },
    contractTestData,
    { type: CONTRACT_SAVE_FAILURE, text: 'Sopimuksen talletus epäonnistui', error: { error: "some error" } },
));

test('saveAttempt returns correct type', actionTest(
    saveAttempt,
    contractTestData,
    { type: CONTRACT_SAVE_ATTEMPT, text: 'Sopimuksen talletus käynnistetty' },
));

test('saveContract calls saveSuccess on succesful callApi promise resolution', async t => {
    let resArray = [];
    const compareArray = [saveAttempt(), saveSuccess(contractTestData)];

    const forTest = await saveContract(contractTestData)(a => resArray.push(a));

    t.deepEqual(resArray, compareArray);
});

/**
 * Tämä testi on .cb, eli callback modessa. 
 * Testissä on määritelty monta vertailua tehdään (3kpl).
 * Testi loppuu vain kuin testi saavuttaa t.end() komennon.
 */
test.cb('saveContract calls saveSuccess on errorful callApi promise rejection', t => {
    t.plan(3);
    let compareArray = [saveAttempt(), saveFailure(contractTestDataError.response)];
    let expectedLength = compareArray.length;
    let i = 0;

    saveContract(contractTestDataError)(resObject => {
        i++;
        let temp = compareArray.shift();
        t.deepEqual(temp, resObject)
        if(i >= expectedLength){
            t.is(compareArray.length,0)
            t.end();
        }
    })
});
