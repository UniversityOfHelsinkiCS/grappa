import React from 'react';
import test from 'ava';
import {Router, Link } from 'react-router-dom';
import { shallow } from 'enzyme';
import sinon from 'sinon';
require('ignore-styles')
import ThesisList from '../src/components/ThesisList';

const thesisApp = <ThesisList/>
const wrapper = shallow(thesisApp);

test('has a correct title', t => {
    t.truthy(wrapper.contains(<h2>Thesis List</h2>));
});

test('should have a table element', t => {
    t.is(wrapper.find('table').length, 1);
});

test('should have two tr elements in table', t => {
    t.is(wrapper.find('tr').length, 2);
});

test('should have specified (1) empty tr state element', t => {
    t.is(wrapper.state().thesisListElements.type, 'tr');
});
