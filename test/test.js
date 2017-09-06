import test from 'ava';
import sinon from 'sinon';



test('my passing test', t => {
	t.pass();
});

test('output test: input no json', t => {
	const output = require('../src/output');
	//const express = require('express');
	//var mock = sinon.mock(express.ServerResponse); 
	var myAPI = {setHeader: function (a,b) {},json: function  (a) {} };
	//console.log(typeof(myAPI.setHeader()))
	var mock = sinon.mock(myAPI); 

	var expectation1 = mock.expects("setHeader").once().withArgs('Content-Type', 'application/json');
	var expectation2 = mock.expects("json").once();

	output.jsonOut(mock,"some text");

	mock.verify();
	//t.pass();
	
});
