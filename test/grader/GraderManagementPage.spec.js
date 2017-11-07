import React from 'react';
import test from 'ava';
//import {Router, Link } from 'react-router-dom';
import { shallow } from 'enzyme';
//import sinon from 'sinon';
import { GraderManagementPage } from '../../src/containers/grader/GraderManagementPage.js';
//import GraderEditor from "../../src/components/grader/GraderEditor.js";
require('ignore-styles');


const page = <GraderManagementPage/>
const wrapper = shallow(page);

test('contains grader editor component', t => {
    t.truthy(wrapper.find('<GraderEditor/>'));
});

test('contains thesisList component', t => {
    t.truthy(wrapper.find('<ThesisList/>'));
});