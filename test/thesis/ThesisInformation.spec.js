import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import ThesisInformation from '../../src/components/thesis/ThesisInformation';


test('invalid fields are highlighted', t => {
    const thesis = {};
    const validationErrors = {
        authorEmail: {}
    };
    const form = shallow(<ThesisInformation
        sendChange={function () {}}
        thesis={thesis}
        studyfields={[{ studyfieldId: 1, name: 'test' }]}
        allowEdit
        validationErrors={validationErrors}
    />);

    t.is(form.find('input[name="authorEmail"]').parent().hasClass('error'), true);
});
