import React from 'react';
import test from 'ava';
import {Router, Link } from 'react-router-dom';
import { shallow } from 'enzyme';
import ava from 'ava';
import sinon from 'sinon';
require('ignore-styles')
import Contract from '../src/Contract';

const app = <Contract/>
const wrapper = shallow(app);

test('has a correct tittle 2', t => {
    t.truthy(wrapper.contains(<h2>Thesis Contract</h2>));
});

test('should have 3 textarea elements', t => {
    t.is(wrapper.find('textarea').length,3);
});

test('should have a submit element', t => {
    t.is(wrapper.find('input[type="submit"]').length,1);
});

test('should have specified (3) empty state elements', t => {
    t.is(wrapper.state().completionEta,"");
    t.is(wrapper.state().supervision,"");
    t.is(wrapper.state().misc,"");
});

test('change textarea by target.name', t => {
    const randomString = Math.random().toString(36).substring(8);
    const input = wrapper.find('textarea').at(0);
    input.simulate('change', {target: {name: 'completionEta',value: randomString}});
    t.is(wrapper.state().completionEta,randomString);
});


test.skip('change in completionEta textarea changes completionEta state', t => {
    const randomString = Math.random().toString(36).substring(8);
    const input = wrapper.find('textarea').at(0);
    input.simulate('change', {target: {name: 'completionEta',value: randomString}});
    //console.log(input);
    console.log(input.get(0));
    t.is(input.get(0).value,randomString);
    //expect(input.value).to.equal(randomString);
    //expect(wrapper.state().completionEta).to.equal(randomString);
});
