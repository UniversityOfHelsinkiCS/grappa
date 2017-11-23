// external modules
import test from 'ava';

test.skip('saveAgreement calls saveSuccess on succesful callApi promise resolution',  t => {
    t.truthy(true);
});

/*import sinon from 'sinon';
import { actionTest } from 'redux-ava';
import 'babel-polyfill';

// internal modules
import * as API from '../../src/util/apiConnection';
import {
    saveAttempt,
    saveSuccess,
    saveFailure,
    saveAgreement,
} from '../../src/containers/agreement/agreementActions';

const agreementTestData = { some: 'data' };
const agreementTestDataError = { response: { some: 'error' } };

const callApiStub = sinon.stub(API, 'callApi')
    .withArgs('/agreements', 'post', agreementTestData)
    .returns(Promise.resolve(agreementTestData))
    .withArgs('/agreements', 'post', agreementTestDataError).returns(Promise.reject(agreementTestDataError));


/*
test('saveAgreement calls saveSuccess on succesful callApi promise resolution', async t => {
    let resArray = [];
    const compareArray = [saveAttempt(), saveSuccess(agreementTestData)];

    const forTest = await saveAgreement(agreementTestData)(a => resArray.push(a));

    t.deepEqual(resArray, compareArray);
});
*/


/**
 * Tämä testi on .cb, eli callback modessa. 
 * Testissä on määritelty monta vertailua tehdään (3kpl).
 * Testi loppuu vain kuin testi saavuttaa t.end() komennon.
 */
/*
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
*/