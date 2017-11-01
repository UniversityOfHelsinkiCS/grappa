import test from 'ava';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import React, { Component } from 'react';
import FormField from '../../src/components/form/FormField';
require('ignore-styles')

const fieldTestData = {
    inputType: "textarea",
    rows: 1,
    name: "thesisWorkStudentTime",
    label: "Opiskelijan arvioima opinnäytetyöhön käytettävä työaika",
    extraClassNames: "fluid",
    required: true,
    placeholder: "(esim. tuntia / vko)"
};


test('correct input field returned', t => {
    const fieldKey = 'someTestingKey';
    const fieldData = {
        inputType: "input",
        name: "someTestName",
        label: "Testing label",
        placeholder: "test placeholder"
    };
    const fieldOnChangeSpy = () => {};
    const formField = <FormField
        fieldKey={fieldKey}
        fieldData={fieldData}
        fieldOnChangeFunc={fieldOnChangeSpy}
    />;
    const wrapper = shallow(formField);

    const expected = <div key={fieldKey + "fieldDiv"} className={'field small input'}>
                        <label key={fieldKey + "label"} >{fieldData.label}</label>
                        <input
                            key={fieldKey}
                            name={fieldData.name}
                            type="text" placeholder={fieldData.placeholder}
                            onChange={fieldOnChangeSpy} />
                    </div>
    
    t.truthy(wrapper.contains(expected));
});

test('correct textarea field returned', t => {
    const fieldKey = 'someTestingKey2';
    const fieldData = {
        inputType: "textarea",
        rows: 3,
        name: "someTestName2",
        label: "Testing label 2",
        placeholder: "test placeholder 2"
    };
    const fieldOnChangeSpy = () => {};
    const formField = <FormField
        fieldKey={fieldKey}
        fieldData={fieldData}
        fieldOnChangeFunc={fieldOnChangeSpy}
    />;
    const wrapper = shallow(formField);

    const expected = <div key={fieldKey + "fieldDiv"} className={'field small textarea'}>
                        <label key={fieldKey + "label"}>{fieldData.label}</label>
                        <textarea 
                           key={fieldKey} 
                           name={fieldData.name} 
                           rows={fieldData.rows} 
                           placeholder={fieldData.placeholder} 
                           onChange={fieldOnChangeSpy} ></textarea>
                    </div>
    
    t.truthy(wrapper.contains(expected));
});

test('correct bareText field returned', t => {
    const fieldKey = 'someTestingKey3';
    const fieldData = {
        inputType: "bareText",
        name: "someTestName3",
        label: "Testing label 3",
        placeholder: "test placeholder 3"
    };
    const fieldOnChangeSpy = () => {};
    const formField = <FormField
        fieldKey={fieldKey}
        fieldData={fieldData}
        fieldOnChangeFunc={fieldOnChangeSpy}
    />;
    const wrapper = shallow(formField);

    const expected = <div key={fieldKey + "fieldDiv"} className={'field small bareText'}>
                        <label key={fieldKey + "label"} >{fieldData.label}</label>
                        <p 
                            key={fieldKey} 
                            id={fieldData.name} 
                            type="text" placeholder={fieldData.placeholder} />
                    </div>
    
    t.truthy(wrapper.contains(expected));
})

test.only('correct dropdown field returned', t => {
    const fieldKey = 'someTestingKey4';
    const fieldData = {
        inputType: "dropdown",
        name: "someTestName4",
        label: "Testing label 4",
        placeholder: "test placeholder 4",
        responses: [
            {value: 0, text: 'Choose some'},
            {value: 5, text: 'some chosen one', selected:true},
        ]
    };
    const fieldOnChangeSpy = () => {};
    const formField = <FormField
        fieldKey={fieldKey}
        fieldData={fieldData}
        fieldOnChangeFunc={fieldOnChangeSpy}
    />;
    const wrapper = shallow(formField);

    const expected = <div key={fieldKey + "fieldDiv"} className={'field small dropdown'}>
                        <label key={fieldKey + "label"} >{fieldData.label}</label>
                        <select className="ui dropdown" onChange={fieldOnChangeSpy}  name={fieldData.name} >
                            <option value={fieldData.responses[0].value} selected={fieldData.responses[0].selected} >{fieldData.responses[0].text}</option>
                            <option value={fieldData.responses[1].value} selected={fieldData.responses[1].selected} >{fieldData.responses[1].text}</option>
                        </select>
                    </div>;
    t.truthy(wrapper.contains(expected));
})

test('extraClasses are added correctly', t => {
    const fieldKey = 'someTestingKey4';
    const fieldData = {
        inputType: "input",
        name: "someTestName4",
        label: "Testing label 4",
        placeholder: "test placeholder 4",
        extraClassNames: "someExtraClass"
    };
    const fieldOnChangeSpy = () => {};
    const formField = <FormField
        fieldKey={fieldKey}
        fieldData={fieldData}
        fieldOnChangeFunc={fieldOnChangeSpy}
    />;
    const wrapper = shallow(formField);

    const expected = <div key={fieldKey + "fieldDiv"} className={'field small someExtraClass input'}>
                        <label key={fieldKey + "label"} >{fieldData.label}</label>
                        <input
                            key={fieldKey}
                            name={fieldData.name}
                            type="text" placeholder={fieldData.placeholder}
                            onChange={fieldOnChangeSpy} />
                    </div>
    
    t.truthy(wrapper.contains(expected));
})

test('required flag is correctly translated', t => {
    const fieldKey = 'someTestingKey5';
    const fieldData = {
        inputType: "input",
        name: "someTestName5",
        label: "Testing label 5",
        placeholder: "test placeholder 5",
        required: true
    };
    const fieldOnChangeSpy = () => {};
    const formField = <FormField
        fieldKey={fieldKey}
        fieldData={fieldData}
        fieldOnChangeFunc={fieldOnChangeSpy}
    />;
    const wrapper = shallow(formField);

    const expected = <div key={fieldKey + "fieldDiv"} className={'field small input required'}>
                        <label key={fieldKey + "label"} >{fieldData.label}</label>
                        <input
                            key={fieldKey}
                            name={fieldData.name}
                            type="text" placeholder={fieldData.placeholder}
                            onChange={fieldOnChangeSpy} />
                    </div>
    
    t.truthy(wrapper.contains(expected));
})