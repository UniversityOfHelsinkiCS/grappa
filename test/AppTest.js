import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';
import chai from 'chai';
require('ignore-styles')
import App from '../src/App.js';
var expect = chai.expect;

const wrapper = shallow(
  <App/>
);

test('has correct title', () => {
	expect(doesAppContainElement(<h2>Enter your name below</h2>)).to.equal(true);
});

test('text is ennen kutsua at beginning', () => {
	expect(doesAppContainElement(<h2>ennen kutsua</h2>)).to.equal(true);
});

test('has correct input field', () => {
  expect(doesAppContainElement(<input ref="input" placeholder="enter your name here" type="text" name="username"/>)).to.equal(true);
});

test('has correct button', () => {
  expect(doesAppContainElement(<input type="submit" value="send" />)).to.equal(true);
});


function doesAppContainElement(element) {
  return wrapper.containsMatchingElement(element);
};
