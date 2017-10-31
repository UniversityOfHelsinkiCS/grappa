import React from 'react';
import test from 'ava';
import {Router, Link } from 'react-router-dom';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import AssesmentOfThesis from '../../src/containers/thesis/AssesmentOfTheses';
require('ignore-styles')


const assesment = <AssesmentOfThesis/>
const wrapper = shallow(assesment);

test.skip('has a correct page title', t => {
    t.truthy(wrapper.contains(<h2>Assesment of theses</h2>));
});

test.skip('has a correct title', t => {
    t.truthy(wrapper.contains(<h1>Ylempään korkeakoulututkintoon sisältyvän pro gradu -tutkielman arviointi</h1>));
});

test('has a list with something in it', t => {
    t.truthy(wrapper.find('ul').children().length > 0)
    t.truthy(wrapper.find('li').children().length > 0);
});