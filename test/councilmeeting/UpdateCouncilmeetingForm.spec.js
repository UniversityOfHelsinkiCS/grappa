import React from 'react';
import test from 'ava';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import moment from 'moment';
import UpdateCouncilmeetingForm from '../../src/component/CouncilMeeting/components/UpdateCouncilmeetingForm';

const programmes = [{ programmeId: 1, name: 'test' }];

test('Councilmeeting can be updated', (t) => {
    const updateMeeting = sinon.spy();
    const meeting = {
        date: '2017-11-29T22:00:00.000Z',
        instructorDeadline: '2017-11-20T22:00:00.000Z',
        studentDeadline: '2017-11-10T22:00:00.000Z',
        councilmeetingId: 1,
        programmes: []
    };
    const compopnent = shallow(
        <UpdateCouncilmeetingForm
            meeting={meeting}
            updateMeeting={updateMeeting}
            programmes={programmes}
        />
    );
    compopnent.find('DatePicker').at(0).simulate('change', moment('2018-01-12'));
    compopnent.find('DatePicker').at(1).simulate('change', moment('2018-01-11'));
    compopnent.find('DatePicker').at(2).simulate('change', moment('2018-01-10'));
    compopnent.find('button').simulate('click');

    t.true(updateMeeting.called);

    const data = updateMeeting.args[0][0];
    const format = 'YYYY-MM-DD';

    t.is(data.date.format(format), '2018-01-12');
    t.is(data.instructorDeadline.format(format), '2018-01-11');
    t.is(data.studentDeadline.format(format), '2018-01-10');
    t.is(data.councilmeetingId, 1);
});

test('selected programmes are listed', (t) => {
    const updateMeeting = sinon.spy();
    const meeting = {
        date: '2017-11-29T22:00:00.000Z',
        instructorDeadline: '2017-11-20T22:00:00.000Z',
        studentDeadline: '2017-11-10T22:00:00.000Z',
        councilmeetingId: 1,
        programmes: [programmes[0]]
    };
    const component = mount(
        <UpdateCouncilmeetingForm
            meeting={meeting}
            updateMeeting={updateMeeting}
            programmes={programmes}
        />
    );

    t.is(component.find('td').length, 2);
});

test('programmes can be changed', (t) => {
    const updateMeeting = sinon.spy();
    const meeting = {
        date: '2017-11-29T22:00:00.000Z',
        instructorDeadline: '2017-11-20T22:00:00.000Z',
        studentDeadline: '2017-11-10T22:00:00.000Z',
        councilmeetingId: 1,
        programmes: [programmes[0]]
    };
    const component = mount(
        <UpdateCouncilmeetingForm
            meeting={meeting}
            updateMeeting={updateMeeting}
            programmes={programmes}
        />
    );

    t.is(component.find('td').length, 2);
    component.find('.remove').simulate('click');
    t.is(component.find('td').length, 0);

    component.find('select').simulate('change', { target: { value: '1' } });
    t.is(component.find('td').length, 2);
});
