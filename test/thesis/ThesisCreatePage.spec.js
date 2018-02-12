import React from 'react';
import test from 'ava';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { ThesisCreatePage } from '../../src/component/Thesis/ThesisCreatePage';


test('New thesis can be created', (t) => {
    const save = sinon.spy();
    const persons = [{ personId: 1, name: 'foo' }, { personId: 2, name: 'bar' }];
    const programmes = [{ programmeId: 15, name: 'test programme' }];
    const studyfields = [{ studyfieldId: 3, programmeId: 15 }];
    const roles = [
        { personRoleId: 1, personId: 1, programmeId: 15, name: 'grader' },
        { personRoleId: 1, personId: 2, programmeId: 15, name: 'grader' }
    ];

    const component = mount(<ThesisCreatePage
        councilmeetings={[]}
        programmes={programmes}
        studyfields={studyfields}
        roles={roles}
        persons={persons}
        saveThesis={save}
    />);

    component.find('[name="authorEmail"]').simulate('change', { target: { value: 'foo@bar.com' } });
    component.find('[name="title"]').simulate('change', { target: { value: 'Thesis Title' } });
    component.find('[name="urkund"]').simulate('change', { target: { value: 'http://a' } });
    component.find('#programmeId-field').simulate('change', { target: { value: 15 } });
    component.find('#studyfieldId-field').simulate('change', { target: { value: 3 } });
    component.find('#grade-field').simulate('change', { target: { value: '3' } });

    const thesis = component.state('thesis');

    t.is(thesis.authorEmail, 'foo@bar.com');
    t.is(thesis.title, 'Thesis Title');
    t.is(thesis.urkund, 'http://a');
    t.is(thesis.programmeId, 15);
    t.is(thesis.studyfieldId, 3);
    t.is(thesis.grade, '3');
});
