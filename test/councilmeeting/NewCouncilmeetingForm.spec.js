import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import moment from 'moment';
import NewCouncilmeetingForm from '../../src/components/councilmeeting/NewCouncilmeetingForm';

test('New councilmeeting can be created', (t) => {
    const saveMeeting = sinon.spy();
    const programmes = [{ programmeId: 1, name: 'first' }, { programmeId: 2, name: 'other' }];
    const newCouncilmeeting = shallow(<NewCouncilmeetingForm saveMeeting={saveMeeting} programmes={programmes} />);

    newCouncilmeeting.find('DatePicker').simulate('change', moment('2018-01-10'));
    newCouncilmeeting.find('#newCouncilmeetingInstructorDeadlineDays').simulate('change', { target: { value: '5' } });
    newCouncilmeeting.find('#newCouncilmeetingStudentDeadlineDays').simulate('change', { target: { value: '6' } });
    newCouncilmeeting.find('ProgrammeSelect').simulate('change', { target: { value: 2 } });
    newCouncilmeeting.find('button').simulate('click');

    t.true(saveMeeting.called);

    const data = saveMeeting.args[0][0];

    t.is(data.date.format(), '2018-01-10T00:00:00+02:00');
    t.is(data.instructorDeadline.format(), '2018-01-05T00:00:00+02:00');
    t.is(data.studentDeadline.format(), '2018-01-04T00:00:00+02:00');
    t.is(data.programmeId, 2);
});
