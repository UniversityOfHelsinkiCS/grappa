import test from 'ava';
import sinon from 'sinon';



test('my passing test', t => {
	t.pass();
});

test('json output test: input no json: expects correct http header and error json', t => {
	const output = require('../src/output');

	var resAPI = {setHeader: function (a,b) {},json: function  (a) {} };
	var mock = sinon.mock(resAPI); 
	
	var expectation1 = mock.expects("setHeader").once().withArgs('Content-Type', 'application/json');
	var expectation2 = mock.expects("json").once().calledWith({ error: "output not valid json" });

	output.send("json", resAPI, "some text");

	mock.verify();
});

test('json output test: input is json: expects correct http header and same json output', t => {
	const output = require('../src/output');

	var resAPI = {setHeader: function (a,b) {},json: function  (a) {} };
	var mock = sinon.mock(resAPI); 
	var expectedOutputContent = { text: "Hello World!" }

	var expectation1 = mock.expects("setHeader").once().withArgs('Content-Type', 'application/json');
	var expectation2 = mock.expects("json").once().calledWith(expectedOutputContent);

	output.send("json", resAPI, expectedOutputContent);

	mock.verify();
});