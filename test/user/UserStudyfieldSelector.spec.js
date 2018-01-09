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

test('checkboxes are rendered', t => {
    const testState = { studyfields, user };
    const store = mockStore(testState);
    const component = mountWithStore(<UserStudyfieldSelector />, store);

    t.is(component.find('input').length, studyfields.length);
});

test('studyfield can be set', t => {
    const testState = { studyfields, user };
    const store = mockStore(testState);    
    const component = mountWithStore(<UserStudyfieldSelector />, store);

    component.find('input').at(0).simulate('change', { target: { checked: true, value: 1 }});
    component.find('input').at(1).simulate('change', { target: { checked: true, value: 2 }});
    component.find('.button').simulate('click');

    t.is(store.getActions()[0].type, 'ROLE_VISITOR_UPDATE_ATTEMPT');
    t.is(store.getActions()[0].payload.data.studyfieldIds.length, 2);
    t.is(store.getActions()[0].payload.data.studyfieldIds[0], 1);
    t.is(store.getActions()[0].payload.data.studyfieldIds[1], 2);
});

test('selected studyfield is checked and can be changed', t => {
    const user = {
        personId: 1,
        roles: [ { role: 'visitor', studyfieldId: 2 } ]
    };
    const testState = { studyfields, user };
    const store = mockStore(testState);    
    const component = mountWithStore(<UserStudyfieldSelector />, store);

    t.is(component.find('input').at(1).props().defaultChecked, true, 'Checkbox is not checked');
    component.find('input').at(1).simulate('change', { target: { checked: false, value: 2 }});
    component.find('.button').simulate('click');

    t.is(store.getActions()[0].type, 'ROLE_VISITOR_UPDATE_ATTEMPT', 'Action is not fired');
    t.is(store.getActions()[0].payload.data.studyfieldIds.length, 0);
});
