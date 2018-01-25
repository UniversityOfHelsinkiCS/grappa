import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';

import SupervisingInfoForm from '../../src/components/agreement/form/SupervisingInfoForm';

const programmes = [{ id: 1, name: 'käpistely' }];
const func = function() {}

const supervisors = [
    { programmeId: 1, person: { personId: 1 } },
    { programmeId: 1, person: { personId: 2 } },
    { programmeId: 2, person: { personId: 3 } }
];

test('Component renders without errors', t => {
    shallow(<SupervisingInfoForm
        programmes={programmes}
        resetSupervisors={func}
        handleChange={func}
        supervisors={supervisors}
        requiredFields={{ }}
    />);
});

test('Supervisors are filtered', t => {
    const component = shallow(<SupervisingInfoForm
        programmes={programmes}
        resetSupervisors={func}
        handleChange={func}
        supervisors={supervisors}
        requiredFields={{ programmeId: 1 }}
    />);

    t.is(component.find('[name="thesisSupervisorMain"]').find('option').length, 1);

    component.find('[name="programmeId"]').simulate('change', { target: { value: 1 } });
    t.is(component.find('[name="thesisSupervisorMain"]').find('option').length, 3);

    component.find('[name="programmeId"]').simulate('change', { target: { value: 2 } });
    t.is(component.find('[name="thesisSupervisorMain"]').find('option').length, 2);
});
