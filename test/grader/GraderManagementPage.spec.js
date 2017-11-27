import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';
import { GraderManagementPage } from '../../src/containers/supervisor/GraderManagementPage.js';

const wrapper = shallow(<GraderManagementPage graders={[]} getSupervisors={()=>{}}/>);

test('contains grader editor component', t => {
    t.truthy(wrapper.find("GraderEditor"));
});

test('contains thesisList component', t => {
    t.truthy(wrapper.find("ThesisList"));
});