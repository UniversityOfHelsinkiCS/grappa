import test from 'ava';
import { shallow } from 'enzyme';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import NavBar from '../src/components/NavBar.js';

const expectedLinkAmount = 7;

test('Basic NavBar has 7 inactive elements', t => {
    const wrapper = shallow(<NavBar/>);
    t.is(wrapper.find('Link').length, expectedLinkAmount);
    t.is(wrapper.find('Link[className="item active"]').length, 0);
});

test('NavBar marks correct element active when prop "Homepage" is given', t => {
    const page = "Homepage";
    const wrapper = shallow(<NavBar active={page} />);
    t.is(wrapper.find('Link[className="item active"]').length, 1);
    t.is(wrapper.find('Link[className="item active"]').at(0).children().node, page);
});

test('NavBar doesn\'t mark non-existing element prop is given', t => {
    const page = "Random Non Existing";
    const wrapper = shallow(<NavBar active={page} />);
    t.is(wrapper.find('Link').length, expectedLinkAmount);
    t.is(wrapper.find('Link[className="item active"]').length, 0);
});
