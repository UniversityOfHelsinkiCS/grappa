import React from 'react';
import test from 'ava';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import moment from 'moment';
import NewCouncilmeetingForm from '../../src/component/CouncilMeeting/components/NewCouncilmeetingForm';

test('New councilmeeting can be created', (t) => {
    const saveMeeting = sinon.spy();
    const programmes = [{ programmeId: 1, name: 'first' }, { programmeId: 2, name: 'other' }];
    const component = shallow(<NewCouncilmeetingForm saveMeeting={saveMeeting} programmes={programmes} />);

    component.find('DatePicker').simulate('change', moment('2018-01-10'));
    component.find('#newCouncilmeetingInstructorDeadlineDays').simulate('change', { target: { value: '5' } });
    component.find('#newCouncilmeetingStudentDeadlineDays').simulate('change', { target: { value: '6' } });
    component.find('ProgrammeSelect').simulate('change', { target: { value: 2 } });
    component.find('button').simulate('click');

    t.true(saveMeeting.called);

    const data = saveMeeting.args[0][0];
    const format = 'YYYY-MM-DD';

    t.is(data.date.format(format), '2018-01-10');
    t.is(data.instructorDeadline.format(format), '2018-01-05');
    t.is(data.studentDeadline.format(format), '2018-01-04');
    t.is(data.programmes[0], 2);
});

test('programmes can be changed', (t) => {
    const saveMeeting = sinon.spy();
    const programmes = [{ programmeId: 1, name: 'first' }, { programmeId: 2, name: 'other' }];
    const component = mount(<NewCouncilmeetingForm saveMeeting={saveMeeting} programmes={programmes} />);

    component.find('select').simulate('change', { target: { value: '1' } });
    t.is(component.find('td').length, 2);
    component.find('.remove').simulate('click');
    t.is(component.find('td').length, 0);
});
