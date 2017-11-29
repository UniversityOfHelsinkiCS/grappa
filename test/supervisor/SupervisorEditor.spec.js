import React from 'react';
import test from 'ava';
//import {Router, Link } from 'react-router-dom';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import SupervisorEditor from '../../src/components/supervisor/SupervisorEditor.js';

const editor = <SupervisorEditor supervisors={[]}/>
const wrapper = shallow(editor);

test('there is renderCreate', t => {
    t.truthy(wrapper.find('renderCreate()'));
});

test('there is renderUpdate', t => {
    t.truthy(wrapper.find('renderUpdate()'));
});

//not working yet
test.skip('is called', t => {
    wrapper.find('#add').simulate('click');
    const instance = wrapper.instance();
    const spy = sinon.stub(instance, "saveNewSupervisor");
    //instance.forceUpdate();
    //wrapper.find('textarea').simulate('change', {target: {value: 'a'}});
    t.is(spy.calledOnce, true);
    spy.restore();
});
