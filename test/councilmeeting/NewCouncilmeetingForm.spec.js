import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import moment from 'moment';
import NewCouncilmeetingForm from '../../src/components/councilmeeting/NewCouncilmeetingForm';

test('New councilmeeting can be created', (t) => {
    const saveMeeting = sinon.spy();
    const newCouncilmeeting = shallow(<NewCouncilmeetingForm saveMeeting={saveMeeting} />);

    newCouncilmeeting.find('DatePicker').simulate('change', moment('2018-01-10'));
    newCouncilmeeting.find('#newCouncilmeetingInstructorDeadlineDays').simulate('change', { target: { value: '5' } });
    newCouncilmeeting.find('#newCouncilmeetingStudentDeadlineDays').simulate('change', { target: { value: '6' } });
    newCouncilmeeting.find('button').simulate('click');

    t.true(saveMeeting.called);

    const data = saveMeeting.args[0][0];

    t.is(data.date, '2018-01-10');
    t.is(data.instructorDeadline, '2018-01-05');
    t.is(data.studentDeadline, '2018-01-04');
});
