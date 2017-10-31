import React from 'react';
import test from 'ava';
import {Router, Link } from 'react-router-dom';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import AssesmentOfThesis from '../../src/containers/thesis/AssesmentOfTheses';
require('ignore-styles')


const assesment = <AssesmentOfThesis/>
const wrapper = shallow(assesment);

test('has a correct page title', t => {
    t.truthy(wrapper.contains(<h2>Assesment of theses</h2>));
});

test('has a correct title', t => {
    t.truthy(wrapper.contains(<h1>Ylempään korkeakoulututkintoon sisältyvän pro gradu -tutkielman arviointi</h1>));
});

test.skip('has a list', t => {
    let reg = /.+/;
    t.is(wrapper.find().at(0).children().node, reg);
});

/*test('NavBar marks correct element active when prop "Homepage" is given', t => {
    const page = "Homepage";
    const wrapper = shallow(<NavBar active={page} />);
    t.is(wrapper.find('Link[className="item active"]').length, 1);
    t.is(wrapper.find('Link[className="item active"]').at(0).children().node, page);
});
*/