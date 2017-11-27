import React from 'react';
import test from 'ava';
//import {Router, Link } from 'react-router-dom';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import GraderEditor from '../../src/components/supervisor/GraderEditor.js';

const editor = <GraderEditor graders={[]}/>
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
    const spy = sinon.stub(instance, "saveNewGrader");
    //instance.forceUpdate();
    //wrapper.find('textarea').simulate('change', {target: {value: 'a'}});
    t.is(spy.calledOnce, true);
    spy.restore();
});
