import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import moment from 'moment';
import UpdateCouncilmeetingForm from '../../src/components/councilmeeting/UpdateCouncilmeetingForm';

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
    const newCouncilmeeting = shallow(
        <UpdateCouncilmeetingForm
            meeting={meeting}
            updateMeeting={updateMeeting}
            programmes={programmes}
        />
    );
    newCouncilmeeting.find('DatePicker').at(0).simulate('change', moment('2018-01-12'));
    newCouncilmeeting.find('DatePicker').at(1).simulate('change', moment('2018-01-11'));
    newCouncilmeeting.find('DatePicker').at(2).simulate('change', moment('2018-01-10'));
    newCouncilmeeting.find('button').simulate('click');

    t.true(updateMeeting.called);

    const data = updateMeeting.args[0][0];
    const format = 'YYYY-MM-DD';

    t.is(data.date.format(format), '2018-01-12');
    t.is(data.instructorDeadline.format(format), '2018-01-11');
    t.is(data.studentDeadline.format(format), '2018-01-10');
    // t.is(data.programmes[0], 1);
    t.is(data.councilmeetingId, 1);
});
