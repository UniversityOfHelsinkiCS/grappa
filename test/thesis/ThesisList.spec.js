import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';
import ThesisList from '../../src/components/thesis/ThesisList';

const thesis = {
    authorFirstname: 'Teppo',
    authorLastname: 'Testaaja',
    thesisTitle: 'Gradu',
    grade: '5',
    thesisId: 1,
    printDone: false
};
const thesisList = [thesis];
const thesisApp = (<ThesisList
    theses={thesisList}
    downloadSelected={() => ({})}
    attachments={[]}
    agreements={[]}
/>);
const wrapper = shallow(thesisApp);


test('should have a table element', (t) => {
    t.is(wrapper.find('table').length, 1);
});

test('should have 2 tr elements', (t) => {
    t.is(wrapper.find('tr').length, 2);
});

