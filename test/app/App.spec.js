import React from 'react';
import test from 'ava';
import { Link, Router } from 'react-router-dom';
import { shallow } from 'enzyme';
import { App } from '../../src/components/App.js';
require('ignore-styles')

const app = <App />
const wrapper = shallow(app);

test('has correct role fields', t => {
    t.truthy(doesAppContainElement(<option value="muu ohjaaja">Muu ohjaaja</option>));
    t.truthy(doesAppContainElement(<option value="vastuuprofessori">Vastuuprofessori</option>));
    t.truthy(doesAppContainElement(<option value="admin">Admin</option>));
    t.truthy(doesAppContainElement(<option value="vastuuohjaaja">Vastuuohjaaja</option>));
    t.truthy(doesAppContainElement(<option value="opiskelija">Opiskelija</option>));
});

test('has correct button', t => {
    t.truthy(doesAppContainElement(<button className="ui button" type="submit">Choose</button>));
});

function doesAppContainElement(element) {
    return wrapper.containsMatchingElement(element);
};
