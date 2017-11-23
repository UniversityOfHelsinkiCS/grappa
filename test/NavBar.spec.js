import test from 'ava';
import { shallow } from 'enzyme';

import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';

import { NavBar } from '../src/components/NavBar.js';

test('NavBar has elements for admin', t => {
    const wrapper = shallow(<NavBar user={{ type: "admin" }} />);
    t.truthy(wrapper.find('NavLink').length > 0);
});
