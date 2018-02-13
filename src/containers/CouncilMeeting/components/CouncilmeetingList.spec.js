import React from 'react';
import test from 'ava';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import sinon from 'sinon';
import CouncilmeetingList from './CouncilmeetingList';

const selectMeeting = sinon.spy();
const deleteMeeting = sinon.spy();
const meetings = [{
    date: '2017-11-29T22:00:00.000Z',
    instructorDeadline: '2017-11-20T22:00:00.000Z',
    studentDeadline: '2017-11-10T22:00:00.000Z',
    programmes: [1],
    councilmeetingId: 1
}];
const programmes = [{ programmeId: 1, name: 'test' }];

test('Councilmeeting list renders', (t) => {
    const list = mount(
        <MemoryRouter>
            <CouncilmeetingList
                meetings={meetings}
                selectMeeting={selectMeeting}
                deleteMeeting={deleteMeeting}
                showOld
                programmes={programmes}
            />
        </MemoryRouter>
    );

    t.is(list.find('td').length, 6);
});

test('Old meetings are filtered', (t) => {
    const list = mount(
        <MemoryRouter>
            <CouncilmeetingList
                meetings={meetings}
                selectMeeting={selectMeeting}
                deleteMeeting={deleteMeeting}
                showOld={false}
                programmes={programmes}
            />
        </MemoryRouter>
    );

    t.is(list.find('td').length, 0);
});
