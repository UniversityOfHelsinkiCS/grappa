import React from 'react';
import test from 'ava';
import { Link } from 'react-router-dom';
import { shallow } from 'enzyme';
import chai from 'chai';
import sinon from 'sinon';
require('ignore-styles')
import App from '../src/App.js';
import Router from "react-router-dom";
var expect = chai.expect;
const app = <App/>
const wrapper = shallow(
  app
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

test('has link to contract page', () => {
  expect(doesAppContainElement(<Link to="/contract"> Go to contract page </Link>)).to.equal(true);
});

test('when link to contract page is called, something happens', () => {
  const changeToContract = sinon.spy('/contract')
  wrapper.find('Link').simulate('click');
  expect(changeToContract.calledOnce).to.equal(true);
});

function doesAppContainElement(element) {
  return wrapper.containsMatchingElement(element);
};
