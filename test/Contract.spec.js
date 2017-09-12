import React from 'react';
import test from 'ava';
import {Router, Link } from 'react-router-dom';
import { shallow } from 'enzyme';
import chai from 'chai';
import sinon from 'sinon';
require('ignore-styles')
import Contract from '../src/Contract';

var expect = chai.expect;
const app = <Contract/>
const wrapper = shallow(
  app
);

test('has correct title', () => {
	expect(doesAppContainElement(<h2>Thesis Contract</h2>)).to.equal(true);
});

function doesAppContainElement(element) {
    return wrapper.containsMatchingElement(element);
  };