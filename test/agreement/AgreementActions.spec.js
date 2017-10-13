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
    saveAgreement,
    AGREEMENT_SAVE_ATTEMPT,
    AGREEMENT_SAVE_SUCCESS,
    AGREEMENT_SAVE_FAILURE
} from '../../src/components/agreement/AgreementActions';

const agreementTestData = { some: 'data' };
const agreementTestDataError = { response: { some: 'error' } };

const callApiStub = sinon.stub(API, 'callApi')
    .withArgs('/agreement', 'post', agreementTestData)
    .returns(Promise.resolve(agreementTestData))
    .withArgs('/agreement', 'post', agreementTestDataError).returns(Promise.reject(agreementTestDataError));

test('saveSuccess returns correct type', actionTest(
    saveSuccess,
    { data: "some data" },
    agreementTestData,
    { type: AGREEMENT_SAVE_SUCCESS, text: 'Sopimus talletettu onnistuneesti', data: { data: "some data" } },
));

test('saveFailure returns correct type', actionTest(
    saveFailure,
    { error: "some error" },
    agreementTestData,
    { type: AGREEMENT_SAVE_FAILURE, text: 'Sopimuksen talletus epäonnistui', error: { error: "some error" } },
));

test('saveAttempt returns correct type', actionTest(
    saveAttempt,
    agreementTestData,
    { type: AGREEMENT_SAVE_ATTEMPT, text: 'Sopimuksen talletus käynnistetty' },
));

test('saveAgreement calls saveSuccess on succesful callApi promise resolution', async t => {
    let resArray = [];
    const compareArray = [saveAttempt(), saveSuccess(agreementTestData)];

    const forTest = await saveAgreement(agreementTestData)(a => resArray.push(a));

    t.deepEqual(resArray, compareArray);
});



/**
 * Tämä testi on .cb, eli callback modessa. 
 * Testissä on määritelty monta vertailua tehdään (3kpl).
 * Testi loppuu vain kuin testi saavuttaa t.end() komennon.
 */
test.cb('saveAgreement calls saveSuccess on errorful callApi promise rejection', t => {
    t.plan(3);
    let compareArray = [saveAttempt(), saveFailure(agreementTestDataError.response)];
    let expectedLength = compareArray.length;
    let i = 0;

    saveAgreement(agreementTestDataError)(resObject => {
        i++;
        let temp = compareArray.shift();
        t.deepEqual(temp, resObject)
        if(i >= expectedLength){
            t.is(compareArray.length,0)
            t.end();
        }
    })
});
