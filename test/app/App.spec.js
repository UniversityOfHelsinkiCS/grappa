import React from 'react';
import test from 'ava';
import { Link, Router } from 'react-router-dom';
import { shallow } from 'enzyme';
require('ignore-styles')
import App from '../../src/components/App.js';

const app = <App/>
const wrapper = shallow(app);

test('has correct title', t => {
	t.truthy(doesAppContainElement(<h2>Enter your name below</h2>));
});

test('text is ennen kutsua at beginning', t => {
	t.truthy(doesAppContainElement(<h2>ennen kutsua</h2>));
});

test('has correct input field', t => {
  t.truthy(doesAppContainElement(<input ref="input" placeholder="enter your name here" type="text" name="username"/>));
});

test('has correct button', t => {
  t.truthy(doesAppContainElement(<button className="ui button" type="submit">Send</button>));
});

test('has link to agreement page', t => {
  t.truthy(doesAppContainElement(<Link to="/agreement"> Go to agreement page </Link>));
});

function doesAppContainElement(element) {
  return wrapper.containsMatchingElement(element);
};
