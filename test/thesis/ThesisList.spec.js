import React from 'react';
import test from 'ava';
import {Router, Link } from 'react-router-dom';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ThesisList from '../../src/components/thesis/ThesisList';

const thesis = {authorFirstname: "Teppo", authorLastname: "Testaaja",
title: "Gradu", grade: "5", thesisId: "1"};
const thesisList = [thesis];     
const thesisApp = <ThesisList theses = {thesisList}/>
const wrapper = shallow(thesisApp);
           

test('should have a table element', t => {
    t.is(wrapper.find('table').length, 1);
});

test('should have 2 tr elements', t => {
    t.is(wrapper.find('tr').length, 2);
});

