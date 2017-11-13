import React from 'react';
import test from 'ava';
//import {Router, Link } from 'react-router-dom';
import { shallow } from 'enzyme';
//import sinon from 'sinon';
import { GraderManagementPage } from '../../src/containers/grader/GraderManagementPage.js';
//import GraderEditor from "../../src/components/grader/GraderEditor.js";


const page = <GraderManagementPage/>
const wrapper = shallow(page);

test('passing test', t => {
    t.truthy(true);
})

test.skip('contains grader editor component', t => {
    t.truthy(wrapper.find('<GraderEditor/>'));
});

test.skip('contains thesisList component', t => {
    t.truthy(wrapper.find('<ThesisList/>'));
});