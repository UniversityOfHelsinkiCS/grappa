import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';
import { SupervisorManagementPage } from '../../src/containers/supervisor/SupervisorManagementPage.js';

const wrapper = shallow(<SupervisorManagementPage supervisors={[]} getAgreementPersons={()=>{}}/>);

test('contains supervisor editor component', t => {
    t.truthy(wrapper.find("SupervisorEditor"));
});

test('contains thesisList component', t => {
    t.truthy(wrapper.find("ThesisList"));
});