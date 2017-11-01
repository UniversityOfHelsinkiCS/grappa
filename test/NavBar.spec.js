import test from 'ava';
import { shallow } from 'enzyme';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import NavBar from '../src/components/NavBar.js';

const expectedLinkAmount = 7;

test('Basic NavBar has elements', t => {
    const wrapper = shallow(<NavBar/>);
    t.truthy(wrapper.find('NavLink').length > 0);
});