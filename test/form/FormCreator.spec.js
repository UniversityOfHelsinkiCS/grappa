import test from 'ava';
import { shallow} from 'enzyme';
import sinon from 'sinon';

import React, { Component } from 'react';
import FormField from '../../src/components/form/FormCreator';
import Section from '../../src/components/form/FormSection';
import FormField from '../../src/components/form/FormField';


require('ignore-styles')


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