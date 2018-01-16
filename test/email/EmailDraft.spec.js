import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';

import EmailDraft from '../../src/components/email/EmailDraft';

const programmes = [
    { programmeId: 1, name: 'Tietojenkäsittelytiede' },
    { programmeId: 2, name: 'Fysiikka' }
];

test('Render email draft', t => {
    const draftData = { type: 'foo', title: 'Test email', body: 'body', programme: 1 };
    const draft = shallow(<EmailDraft
        draft={draftData}
        updateDraft={() => {}}
        sendDeleteRequest={() => {}}
        programmes={programmes}

    />);

    t.is(draft.find('h3').text(), 'Tietojenkäsittelytiede: foo');
});

test('Email draft editing', t => {
    t.plan(5);
    const draftData = { type: 'foo', title: 'Test email', body: 'body', programme: 1 };
    const save = draft => {
        t.is(draft.title, 'new title');
        t.is(draft.body, 'new body');
        t.is(draft.programme, 2);
    };
    const draft = shallow(<EmailDraft
        draft={draftData}
        updateDraft={save}
        sendDeleteRequest={() => {}}
        programmes={programmes}

    />);

    draft.find('button').at(0).simulate('click');
    t.true(draft.find('h3').contains('Editing draft: '));

    draft.find('input').at(0).simulate('change', { target: { value: 'new title' } });
    draft.find('textarea').at(0).simulate('change', { target: { value: 'new body' } });
    draft.find('select').simulate('change', { target: { value: 2 } });
    draft.find('button[children="Save"]').simulate('click');
    draft.find('button[children="Stop editing"]').simulate('click');
    t.false(draft.find('h3').contains('Editing draft: '));
});

test('Email draft delete', t => {
    t.plan(1);
    const draftData = { type: 'foo', title: 'Test email', body: 'body', programme: 1 };
    const deleteDraft = () => t.true(true);
    const draft = shallow(<EmailDraft
        draft={draftData}
        updateDraft={() => {}}
        sendDeleteRequest={deleteDraft}
        programmes={programmes}

    />);

    draft.find('button').at(0).simulate('click');
    draft.find('button[children="Delete this draft"]').simulate('click');
    draft.find('button[children="Click again to confirm"]').simulate('click');
});
