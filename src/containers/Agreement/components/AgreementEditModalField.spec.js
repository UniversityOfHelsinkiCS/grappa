import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import AgreementEditModalField from './AgreementEditModalField';

const mockField = shallow(
    <AgreementEditModalField
        fieldName="fname"
        content="fcontent"
        originalContent="foriginal"
        textField={false}
        onChange={() => {}}
    />);

const mockTextarea = shallow(
    <AgreementEditModalField
        fieldName="tname"
        content="tcontent"
        originalContent="toriginal"
        textField
        onChange={() => {}}
    />);

test('agreement edit modal field has right div class', (t) => {
    t.truthy(mockField.find('div[className="two fields"]').length, 1);
});

test('agreement edit modal textarea has right div class', (t) => {
    t.truthy(mockTextarea.find('div[className="field ui"]').length, 1);
});

test('agreement edit modal textarea has label', (t) => {
    t.truthy(mockTextarea.find('label').length, 1);
});

test('agreement edit modal field has input field', (t) => {
    t.truthy(mockField.find('input').length, 1);
});

test('agreement edit modal textarea has textarea', (t) => {
    t.truthy(mockTextarea.find('textarea').length, 1);
});

test('agreement edit modal field has a reset button', (t) => {
    t.truthy(mockField.containsMatchingElement(<button className="ui primary button">reset</button>));
});

test('agreement edit modal textarea has a reset button', (t) => {
    t.truthy(mockTextarea.containsMatchingElement(<button className="ui right floated primary button">reset</button>));
});

test('when agreement edit modal field input value changes handleChange is called', (t) => {
    const changeStub = sinon.stub();
    const wrapper = shallow(
        <AgreementEditModalField
            fieldName="tname"
            content="tcontent"
            originalContent="toriginal"
            textField={false}
            onChange={changeStub}
        />);
    wrapper.find('input').simulate('change', { target: { value: 'a' } });
    t.truthy(changeStub.calledOnce);
});

test('when agreement edit modal textarea value changes handleChange is called', (t) => {
    const changeStub = sinon.stub();
    const wrapper = shallow(
        <AgreementEditModalField
            fieldName="tname"
            content="tcontent"
            originalContent="toriginal"
            textField
            onChange={changeStub}
        />);
    wrapper.find('textarea').simulate('change', { target: { value: 'a' } });
    t.truthy(changeStub.calledOnce);
});
