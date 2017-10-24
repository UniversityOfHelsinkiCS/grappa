import test from 'ava';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import React, { Component } from 'react';
import FormCreator from '../../src/components/form/FormCreator';
import FormSection from '../../src/components/form/FormSection';


require('ignore-styles')
/*
<FormCreator 
    formFieldInfo={this.formFieldInfo}
    onSubmitFunc={(e)=>{if (e !== undefined){e.preventDefault();}}} 
    buttonOnClickFunc={this.sendForm} 
    accessToStore={this.props.agreement}
    fieldOnChangeFunc={this.handleFormChange} />
*/

test('Section child is created', t => {

    const fieldOnChangeSpy = () => { };
    const sectionData = {
        sections: [{
            sectionKey: "someKey",
            header: "Same interesting header",
            elements: [{ fieldData: null, fieldKey: 0 }],
            fieldOnChangeFunc: fieldOnChangeSpy
        }]
    };

    const form = <FormCreator
        formFieldInfo={sectionData}
        onSubmitFunc={() => { }}
        buttonOnClickFunc={() => { }}
        accessToStore={[]}
        fieldOnChangeFunc={fieldOnChangeSpy}
    />

    const wrapper = shallow(form);
    t.is(wrapper.find(FormSection).length, 1);
})

test('Button is created and correct function is added', t => {

    const fieldOnChangeSpy = () => { };
    const buttonOnClickSpy = () => { };
    const sectionData = {
        sections: [{
            sectionKey: "someKey",
            header: "Same interesting header",
            elements: [{ fieldData: null, fieldKey: 0 }],
            fieldOnChangeFunc: fieldOnChangeSpy
        }]
    };

    const form = <FormCreator
        formFieldInfo={sectionData}
        onSubmitFunc={() => { }}
        buttonOnClickFunc={buttonOnClickSpy}
        accessToStore={[]}
        fieldOnChangeFunc={fieldOnChangeSpy}
    />

    const wrapper = shallow(form);

    const expected = <button className="ui primary button" type="submit" onClick={buttonOnClickSpy}>Save</button>;

    t.truthy(wrapper.contains(expected));

    t.is(wrapper.find('button').length, 1);
})

test('Form elemnt is created and there is only 1 element of this kind', t => {

    const fieldOnChangeSpy = () => { };
    const buttonOnClickSpy = () => { };
    const sectionData = {
        sections: [{
            sectionKey: "someKey",
            header: "Same interesting header",
            elements: [{ fieldData: null, fieldKey: 0 }],
            fieldOnChangeFunc: fieldOnChangeSpy
        }]
    };

    const form = <FormCreator
        formFieldInfo={sectionData}
        onSubmitFunc={() => { }}
        buttonOnClickFunc={buttonOnClickSpy}
        accessToStore={[]}
        fieldOnChangeFunc={fieldOnChangeSpy}
    />

    const wrapper = shallow(form);

    t.is(wrapper.find('form').length, 1);
})