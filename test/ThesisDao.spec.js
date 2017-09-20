import test from 'ava';
import sinon from 'sinon';

const thesisDao = require('../src/dao/ThesisDao');
const mockTheses = require('../src/mockdata/Theses');

test('getAllTheses returns list of right length ', t => {
    let listOfTheses = thesisDao.getAllTheses();
    t.deepEqual(listOfTheses.length, mockTheses.length);
    //t.truthy(true);
});

test('getThesisById returns right thesis', t => {
    let id = '1';
    let thesis = thesisDao.getThesisById(id);
    let mockthesis;
    for(let i = 0; i < mockTheses.length; i++) {
        if (mockTheses[i].id.toString() === id) {
            mockthesis = mockTheses[i];
        }
    }

    //t.deepEqual(thesis.id, mockthesis.id);
    t.deepEqual(thesis, mockthesis);
});








// test('json output test > input no json: expects correct http header and error json', t => {
// 	const output = require('../src/output');

// 	const resAPI = {setHeader: (a,b) => {},json: (a) => {} };
// 	const mock = sinon.mock(resAPI); 
	
// 	const expectation1 = mock.expects("setHeader").once().withArgs('Content-Type', 'application/json');
// 	const expectation2 = mock.expects("json").once().calledWith({ error: "output not valid json" });

// 	output.send("json", resAPI, "some text");

// 	mock.verify();
// });
