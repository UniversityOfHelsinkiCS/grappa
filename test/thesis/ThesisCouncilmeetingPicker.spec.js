import React from 'react';
import test from 'ava';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import ThesisCouncilmeetingPicker from '../../src/components/thesis/ThesisCouncilmeetingPicker';

const meetings = [
    {
        date: '2025-11-29T22:00:00.000Z',
        instructorDeadline: '2025-11-20T22:00:00.000Z',
        studentDeadline: '2025-11-10T22:00:00.000Z',
        programmeId: 1,
        councilmeetingId: 1
    },
    {
        date: '2025-11-29T22:00:00.000Z',
        instructorDeadline: '2025-11-20T22:00:00.000Z',
        studentDeadline: '2025-11-10T22:00:00.000Z',
        programmeId: 2,
        councilmeetingId: 2
    },
    {
        date: '2025-11-29T22:00:00.000Z',
        instructorDeadline: '2025-11-20T22:00:00.000Z',
        studentDeadline: '2025-11-10T22:00:00.000Z',
        programmeId: 3,
        councilmeetingId: 3
    }
];

test('list is empty if programme is not selected', t => {
    const change = sinon.spy();

    const picker = shallow(
        <ThesisCouncilmeetingPicker
            councilmeetings={meetings}
            chosenMeetingId={undefined}
            sendChange={change}
            programmeId={undefined}
        />
    );

    t.is(picker.find('option').length, 1);
});

test('list is filtered with programme id', (t) => {
    const change = sinon.spy();

    const picker = shallow(
        <ThesisCouncilmeetingPicker
            councilmeetings={meetings}
            chosenMeetingId={undefined}
            sendChange={change}
            programmeId={2}
        />
    );

    t.is(picker.find('option').length, 2);
});
