import test from 'ava';
import { shallow} from 'enzyme';
import sinon from 'sinon';

import React, { Component } from 'react';
import Section from '../../src/components/form/FormSection';
import FormField from '../../src/components/form/FormField';

test('header is correct', t => {
    const headerText = "testHeader";
    const withHeaderOnly =  <Section header={headerText} elements={[]} />;
    const wrapper = shallow(withHeaderOnly);
    const expectedHeader = <h1 className="ui dividing header">{headerText}</h1>;
    t.truthy(wrapper.contains(expectedHeader));
});

test('when element is added, it creates FormField object', t => {

    const fieldData = {
        inputType: "input",
        name: "someTestName",
        label: "Testing label",
        placeholder: "test placeholder"
    };
    const fieldOnChangeSpy = () => {};
  
    const element = {fieldData: {fieldData}, fieldKey: 0,
                     fieldOnChangeFunc: {fieldOnChangeSpy}};
    const array = [element];
    
    const section = <Section sectionKey="Ww" header="en" elements = {array}
                             fieldOnChangeFunc= {fieldOnChangeSpy} />
    const wrapper = shallow(section);
    t.is(wrapper.find(FormField).length , 1);
})