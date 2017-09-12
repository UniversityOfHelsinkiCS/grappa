import test from 'ava';
import sinon from 'sinon';
import app from '../index'

const request = require('supertest');

test('get > hello world -greeting', async t => {
	t.plan(2);

	const res = await request(app)
		.get('/')
		.send();

	t.is(res.status, 200);
	t.is(
		JSON.stringify(res.body), 
		JSON.stringify({ text: "Hello World!" })
	);
});

test('get > /hellouser -greeting when name NOT provided', async t => {
	t.plan(2);
	
	const res = await request(app)
		.get('/helloUser')
		.send();

	t.is(res.status, 200);
	t.is(
		JSON.stringify(res.body), 
		JSON.stringify({ text: "Hello World!" })
	);
});

test('get > /hellouser -greeting when name provided', async t => {
	t.plan(2);
	const randomString = Math.random().toString(36).substring(8);

	const res = await request(app)
		.get('/helloUser?username='+randomString)
		.send();

	t.is(res.status, 200);
	t.is(
		JSON.stringify(res.body), 
		JSON.stringify({ text: randomString })
	);
});