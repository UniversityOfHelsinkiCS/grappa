import React from 'react';
import test from 'ava';
import { Router, Link } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
require('ignore-styles')
import AgreementEditModalField from '../../src/components/agreement/AgreementEditModalField';

const mockField = shallow(<AgreementEditModalField fieldName={ "fname" } content={ "fcontent" } originalContent={ "foriginal" } textField={ false } onChange={() => {}}/>);

const mockTextarea = shallow(<AgreementEditModalField fieldName={ "tname" } content={ "tcontent" } originalContent={ "toriginal" } textField={ true } onChange={() => {}}/>);

test('modal edit field has right div class', t => {
    t.truthy(mockField.find('div[className="two fields"]').length, 1);
});

test('modal edit textarea has right div class', t => {
    t.truthy(mockTextarea.find('div[className="field ui"]').length, 1);
});

test('modal edit textarea has label', t => {
    t.truthy(mockTextarea.find('label').length, 1);
});

test('modal edit field has input field', t => {
    t.truthy(mockField.find('input').length, 1);
});

test('modal edit textarea has textarea', t => {
    t.truthy(mockTextarea.find('textarea').length, 1);
});

test('modal edit field has a reset button', t => {
    t.truthy(mockField.containsMatchingElement(<button className="ui primary button">reset</button>));
});

test('modal edit textarea has a reset button', t => {
    t.truthy(mockTextarea.containsMatchingElement(<button className="ui right floated primary button">reset</button>));
});

test('when field input value changes handleChange is called', t => {
    const instance = mockField.instance();
    const spy = sinon.stub(instance, "handleChange");
    instance.forceUpdate();

    mockField.find('input').simulate('change', {target: {value: 'a'}});
    t.is(spy.calledOnce, true);
    spy.restore();
});

test('when textarea value changes handleChange is called', t => {
    const instance = mockTextarea.instance();
    const spy = sinon.stub(instance, "handleChange");
    instance.forceUpdate();

    mockTextarea.find('textarea').simulate('change', {target: {value: 'a'}});
    t.is(spy.calledOnce, true);
    spy.restore();
});

test('when field input value changes component state changes', t => {
    mockField.find('input').simulate('change', {target: {value: 'a'}});
    t.truthy(mockField.unrendered.props.content, 'fcontenta');
});

test('when textarea value changes component state changes', t => {
    mockTextarea.find('textarea').simulate('change', {target: {value: 'a'}});
    t.truthy(mockField.unrendered.props.content, 'fcontenta');
});

test('when field reset button is clicked resetContent is called', t => {
    const instance = mockField.instance();
    const spy = sinon.stub(instance, "resetContent");
    instance.forceUpdate();

    mockField.find('button').simulate('click');
    t.is(spy.calledOnce, true);
    spy.restore();
});

test('when textarea reset button is clicked resetContent is called', t => {
    const instance = mockField.instance();
    const spy = sinon.stub(instance, "resetContent");
    instance.forceUpdate();

    mockField.find('button').simulate('click');
    t.is(spy.calledOnce, true);
    spy.restore();
});

test('when textarea reset button is clicked resetContent is called', t => {
    mockField.find('button').simulate('click');
    t.truthy(mockField.unrendered.props.content, 'foriginal');
});

test('when textarea value changes component state changes', t => {
    mockTextarea.find('textarea').simulate('click');
    t.truthy(mockField.unrendered.props.content, 'foriginal');
});
