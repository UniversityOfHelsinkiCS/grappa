import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';

import SupervisingInfoForm from '../../src/components/agreement/form/SupervisingInfoForm';

const studyfields = [{ id: 1, name: 'käpistely' }];
const func = function() {}

const supervisors = [
    { studyfieldId: 1, person: { personId: 1 } },
    { studyfieldId: 1, person: { personId: 2 } },
    { studyfieldId: 2, person: { personId: 3 } }
];

test('Component renders without errors', t => {
    shallow(<SupervisingInfoForm
        studyfields={studyfields}
        resetSupervisors={func}
        handleChange={func}
        supervisors={supervisors}
        requiredFields={{ }}
    />);
});

test('Supervisors are filtered', t => {
    const component = shallow(<SupervisingInfoForm
        studyfields={studyfields}
        resetSupervisors={func}
        handleChange={func}
        supervisors={supervisors}
        requiredFields={{ studyfieldId: 1 }}
    />);

    t.is(component.find('[name="thesisSupervisorMain"]').find('option').length, 1);

    component.find('[name="studyfieldId"]').simulate('change', { target: { value: 1 } });
    t.is(component.find('[name="thesisSupervisorMain"]').find('option').length, 3);

    component.find('[name="studyfieldId"]').simulate('change', { target: { value: 2 } });
    t.is(component.find('[name="thesisSupervisorMain"]').find('option').length, 2);
});