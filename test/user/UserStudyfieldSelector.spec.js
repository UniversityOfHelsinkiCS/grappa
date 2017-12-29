import React from 'react';
import test from 'ava';

import { mountWithStore, mockStore } from '../testUtils';
import UserStudyfieldSelector from '../../src/containers/user/UserStudyfieldSelector.js';

const studyfields = [
    { studyfieldId: 1, name: 'test' },
    { studyfieldId: 2, name: 'another' }
];
const user = {
    personId: 1,
    roles: []
};

test('dropdown is rendered', t => {
    const testState = { studyfields, user };
    const store = mockStore(testState);
    const component = mountWithStore(<UserStudyfieldSelector />, store);
    const dropdown = component.find('.dropdown');

    t.is(dropdown.is('.dropdown'), true);
});

test('studyfield can be set', t => {
    const testState = { studyfields, user };
    const store = mockStore(testState);    
    const component = mountWithStore(<UserStudyfieldSelector />, store);

    component.find('.dropdown').simulate('change', { target: { value: 2 } });
    component.find('.button').simulate('click');

    t.is(store.getActions()[0].type, 'ROLE_SAVE_ONE_ATTEMPT');
});

test('studyfield can be changed', t => {
    const user = {
        personId: 1,
        roles: [ { role: 'visitor', studyfield: 2 } ]
    };
    const testState = { studyfields, user };
    const store = mockStore(testState);    
    const component = mountWithStore(<UserStudyfieldSelector />, store);

    component.find('.dropdown').simulate('change', { target: { value: 1 } });
    component.find('.button').simulate('click');

    t.is(store.getActions()[0].type, 'ROLE_UPDATE_ONE_ATTEMPT');
});