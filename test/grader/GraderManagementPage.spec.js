import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';
import { GraderManagementPage } from '../../src/containers/grader/GraderManagementPage.js';

const wrapper = shallow(<GraderManagementPage/>);

test('contains grader editor component', t => {
    t.truthy(wrapper.find("GraderEditor"));
});

test('contains thesisList component', t => {
    t.truthy(wrapper.find("ThesisList"));
});