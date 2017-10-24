import React from 'react';
import test from 'ava';
//import {Router, Link } from 'react-router-dom';
import { shallow } from 'enzyme';
//import sinon from 'sinon';
import GraderEditor from '../../src/components/grader/GraderEditor.js';
require('ignore-styles');


const editor = <GraderEditor graders={[]}/>
const wrapper = shallow(editor);

test('there is renderCreate', t => {
    t.truthy(wrapper.find('renderCreate()'));
});

test('there is renderUpdate', t => {
    t.truthy(wrapper.find('renderUpdate()'));
});
