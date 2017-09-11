import test from 'ava';
import sinon from 'sinon';

test('json output test > input no json: expects correct http header and error json', t => {
	const output = require('../src/output');

	const resAPI = {setHeader: (a,b) => {},json: (a) => {} };
	const mock = sinon.mock(resAPI); 
	
	const expectation1 = mock.expects("setHeader").once().withArgs('Content-Type', 'application/json');
	const expectation2 = mock.expects("json").once().calledWith({ error: "output not valid json" });

	output.send("json", resAPI, "some text");

	mock.verify();
});

test('json output test > input is json: expects correct http header and same json output', t => {
	const output = require('../src/output');

	const resAPI = {setHeader: (a,b) => {},json: (a) => {} };
	const mock = sinon.mock(resAPI); 
	const expectedOutputContent = { text: "Hello World!" }

	const expectation1 = mock.expects("setHeader").once().withArgs('Content-Type', 'application/json');
	const expectation2 = mock.expects("json").once().calledWith(expectedOutputContent);

	output.send("json", resAPI, expectedOutputContent);

	mock.verify();
});