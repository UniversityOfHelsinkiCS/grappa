import React from 'react';
import test from 'ava';
import { Router, Link } from 'react-router-dom';
import { shallow } from 'enzyme';
import sinon from 'sinon';
require('ignore-styles')
import { Contract } from '../../src/components/contract/Contract';
import axios from 'axios';

const contractApp = <Contract />
const wrapper = shallow(contractApp);
let sandbox;
let server;

const formItems = {
    input: [
        "studentName",
        "studentNumber",
        "studentAddress",
        "studentPhone",
        "studentEmail",
        "studentMajor",
        "thesisStartDate",
        "thesisCompletionEta",
        "thesisSupervisorMain",
        "thesisSupervisorSecond",
        "thesisSupervisorOther",
    ],
    textarea: [
        "thesisTitle",
        "thesisPerformancePlace",
        "thesisWorkStudentTime",
        "thesisWorkSupervisorTime",
        "thesisWorkIntermediateGoal",
        "thesisWorkMeetingAgreement",
        "thesisWorkOther",
        "studentGradeGoal"
    ]
}

const stateValueChecker = (elementType, elementName) => {
    const randomString = getRandomString();
    const input = wrapper.find(elementType + '[name="' + elementName + '"]');

    input.simulate('change', { target: { name: elementName, value: randomString } });

    return (wrapper.state().form[elementName] === randomString);
}

const textareaValueChecker = (elementType, elementName) => {
    const randomString = getRandomString();

    wrapper.find(elementType + '[name="' + elementName + '"]').simulate('change', { target: { name: elementName, value: randomString } });

    return (wrapper.find(elementType + '[name="' + elementName + '"]').props().value === randomString);
}

const getRandomString = () => {
    return Math.random().toString(36).substring(8);
}

/*
test.before( () => {
    //sandbox = sinon.sandbox.create();
    server = sinon.fakeServer.create();//sandbox.useFakeServer();
    server.respondImmediately = true;
});

test.after( () => {
    server.restore();
    //sandbox.restore();
});
*/
test.only('has a correct tittle 2', t => {
    console.log("WTF");
    t.truthy(wrapper.contains(<h2>Thesis Contract</h2>));
});

test('should have ' + formItems.textarea.length + ' textarea elements', t => {
    t.is(wrapper.find('textarea').length, formItems.textarea.length);
});
test('should have ' + formItems.input.length + ' input elements', t => {
    t.is(wrapper.find('input').length, formItems.input.length);
});

test('should have a submit element', t => {
    t.is(wrapper.find('button[type="submit"]').length, 1);
});

test('should have specified ' + formItems.textarea.length + ' textarea and ' + formItems.input.length + ' input empty state elements', t => {
    for (let i = 0; i < (formItems.textarea.length); i++) {
        t.is(wrapper.state().form[formItems.textarea[i]], "");
    }
    for (let i = 0; i < (formItems.input.length); i++) {
        t.is(wrapper.state().form[formItems.input[i]], "");
    }
});

for (let i = 0; i < (formItems.textarea.length); i++) {
    test('change ' + formItems.textarea[i] + ' is filled, state changes', t => {
        t.truthy(stateValueChecker('textarea', formItems.textarea[i]));
    });
}
for (let i = 0; i < (formItems.input.length); i++) {
    test('change ' + formItems.input[i] + ' is filled, state changes', t => {
        t.truthy(stateValueChecker('input', formItems.input[i]));
    });
}

for (let i = 0; i < (formItems.textarea.length); i++) {
    test('change in ' + formItems.textarea[i] + ' changes field value', t => {
        t.truthy(textareaValueChecker('textarea', formItems.textarea[i]));
    });
}
for (let i = 0; i < (formItems.input.length); i++) {
    test('change in ' + formItems.input[i] + ' changes field value', t => {
        t.truthy(textareaValueChecker('input', formItems.input[i]));
    });
}

test('when send button is clicked, sendForm method is called', t => {
    const instance = wrapper.instance();
    const spy = sinon.spy(instance, "sendForm");
    instance.forceUpdate();

    wrapper.find('button[type="submit"]').simulate('click');
    t.is(spy.calledOnce, true);
});

test.skip("when send button is clicked: axios.post() is called with correct arguments", t => {
    let axiousStub = sinon.stub(axios, 'post').withArgs('/contract', wrapper.state().form)
        .returns(
            Promise.resolve({
                status: 200,
                response: { text: "Contract saved to backend" }
        }));

    wrapper.find('textarea[name="thesisTitle"]')
        .simulate('change', { target: { name: "thesisTitle", value: getRandomString() } });

    wrapper.find('button[type="submit"]').simulate('click');

    t.is(axiousStub.calledOnce, true);
    t.is(axiousStub.calledWith('/contract', wrapper.state().form), true);
});

test.skip("when send button is clicked: successful server response leads to change in UI", t => {
    let axiousStub = sinon.stub(axios, 'post').withArgs('/contract', wrapper.state().form)
        .returns(
            Promise.resolve({
                status: 200,
                response: { text: "Contract saved to backend" }
        }));

    const instance = wrapper.instance();
    const spy = sinon.spy(instance, "getResponseMessage");
    instance.forceUpdate();

    wrapper.find('textarea[name="thesisTitle"]')
        .simulate('change', { target: { name: "thesisTitle", value: getRandomString() } });

    wrapper.find('button[type="submit"]').simulate('click');

    console.log(wrapper.state());
    t.is(spy.calledOnce, true);
    t.truthy(wrapper.state().serverResponseReceived == "success");
});
