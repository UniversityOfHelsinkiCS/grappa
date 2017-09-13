import React from 'react';
import test from 'ava';
import {Router, Link } from 'react-router-dom';
import { shallow } from 'enzyme';
//import ava from 'ava';
import sinon from 'sinon';
require('ignore-styles')
import Contract from '../src/Contract';

const contractApp = <Contract/>
const wrapper = shallow(contractApp);

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

test('change completionEta by target.name', t => {
    const randomString = getRandomString();
    const input = wrapper.find('textarea[name="completionEta"]');

    input.simulate('change', {target: {name: 'completionEta',value: randomString}});

    t.is(wrapper.state().completionEta,randomString);
});

test('when supervision is filled, state changes', test => {
    const randomString = getRandomString();
    const input = wrapper.find('textarea[name="supervision"]');

    input.simulate('change', {target: {name: 'supervision', value : randomString}});

    test.is(wrapper.state().supervision, randomString);
});

test('when misc is filled, state changes', test => {
    const randomString = getRandomString();
    const input = wrapper.find('textarea[name="misc"]');

    input.simulate('change', {target: {name: 'misc', value : randomString}});
    
    test.is(wrapper.state().misc, randomString);
});

test('change in completionEta textarea changes input field value', t => {
    const randomString = getRandomString();
    
    wrapper.find('textarea[name="completionEta"]').simulate('change', {target: {name: 'completionEta',value: randomString}});
    
    t.is(wrapper.find('textarea[name="completionEta"]').props().value, randomString);
});

test('when send button is clicked, sendForm method is called', t => {
    const instance = wrapper.instance();
    const spy = sinon.spy(instance, "sendForm");
    instance.forceUpdate();

    wrapper.find('input[type="submit"]').simulate('click');
    t.is(spy.calledOnce, true);
});

function getRandomString() {
    return Math.random().toString(36).substring(8);
}