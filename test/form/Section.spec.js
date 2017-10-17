import test from 'ava';
import { shallow } from 'enzyme';

import React, { Component } from 'react';
import Section from '../../src/components/form/Section';
require('ignore-styles')


test('sectionkey is correct', t => {
    const withOnlySectionKey = <Section sectionKey="testKey" />;
    const wrapper = shallow(withOnlySectionKey);
    const expected =  <div key={"section" + "testKey"}><br />
                            <h3 className="ui dividing header"></h3>
                     </div>
    
    t.truthy(wrapper.contains(expected));
});

test('header is correct', t => {
    const headerText = "testHeader";
    const withHeaderOnly =  <Section header={headerText} />;
    const wrapper = shallow(withHeaderOnly);
    const expectedHeader = <h3 className="ui dividing header">{headerText}</h3>;
    t.truthy(wrapper.contains(expectedHeader));
});

test('when element is added, it renders', t => {
    const element = <p>Tiistai</p>;
    const array = [];
    array.push(element);
    const withElementOnly = <Section elements = {array} />;
    const wrapper = shallow(withElementOnly);
    t.truthy(wrapper.contains(element));
})