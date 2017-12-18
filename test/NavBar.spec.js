import test from 'ava';
import { shallow } from 'enzyme';

import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';

import { NavBar } from '../src/containers/NavBar.js';

test('NavBar has elements for admin', t => {
    const wrapper = shallow(
        <NavBar
            user={{
                roles: [
                    { role: "admin" }
                ]
            }}
            login={() => { }}
            history={{ push: () => { } }}
        />);
    t.truthy(wrapper.find('NavLink').length > 0);
});
