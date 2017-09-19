import React from 'react';
import test from 'ava';
import {Router, Link } from 'react-router-dom';
import { shallow } from 'enzyme';
//import ava from 'ava';
import sinon from 'sinon';
require('ignore-styles')
import Contract from '../src/Contract';

const contractApp = <Contract/>
const wrapper = shallow(contractApp);
let xhr, requests;

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

const stateValueChecker = (elementType,elementName) => {
    const randomString = getRandomString();
    const input = wrapper.find(elementType+'[name="'+elementName+'"]');

    input.simulate('change', {target: {name: elementName,value: randomString}});
    
    return (wrapper.state().form[elementName] === randomString);
}

const textareaValueChecker = (elementType,elementName) => {
    const randomString = getRandomString();
    
    wrapper.find(elementType+'[name="'+elementName+'"]').simulate('change', {target: {name: elementName,value: randomString}});
    
    return (wrapper.find(elementType+'[name="'+elementName+'"]').props().value === randomString);
}

function getRandomString() {
    return Math.random().toString(36).substring(8);
}

test('has a correct tittle 2', t => {
    t.truthy(wrapper.contains(<h2>Thesis Contract</h2>));
});

test('should have '+formItems.textarea.length+' textarea elements', t => {
    t.is(wrapper.find('textarea').length,formItems.textarea.length);
});
test('should have '+formItems.input.length+' input elements', t => {
    t.is(wrapper.find('input').length,formItems.input.length);
});

test('should have a submit element', t => {
    t.is(wrapper.find('button[type="submit"]').length,1);
});

test('should have specified '+formItems.textarea.length+' textarea and '+formItems.input.length+' input empty state elements', t => {
    for(let i=0;i < (formItems.textarea.length);i++){
        t.is(wrapper.state().form[formItems.textarea[i]],"");
    }
    for(let i=0;i < (formItems.input.length);i++){
        t.is(wrapper.state().form[formItems.input[i]],"");
    }
});

for(let i=0;i < (formItems.textarea.length);i++){
    test('change '+formItems.textarea[i]+' is filled, state changes', t => {
        t.truthy(stateValueChecker('textarea',formItems.textarea[i]));
    });
}
for(let i=0;i < (formItems.input.length);i++){
    test('change '+formItems.input[i]+' is filled, state changes', t => {
        t.truthy(stateValueChecker('input',formItems.input[i]));
    });
}

for(let i=0;i < (formItems.textarea.length);i++){
    test('change in '+formItems.textarea[i]+' changes field value', t => {
        t.truthy(textareaValueChecker('textarea',formItems.textarea[i]));
    });
}
for(let i=0;i < (formItems.input.length);i++){
    test('change in '+formItems.input[i]+' changes field value', t => {
        t.truthy(textareaValueChecker('input',formItems.input[i]));
    });
}

test('when send button is clicked, sendForm method is called', t => {
    const instance = wrapper.instance();
    const spy = sinon.spy(instance, "sendForm");
    instance.forceUpdate();

    wrapper.find('button[type="submit"]').simulate('click');
    t.is(spy.calledOnce, true);
});

test.before( () => {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = function (req) { requests.push(req); };
});

test.skip('when send button is clicked, data is sent to the server to correct url via POST', t => {

    wrapper.instance().sendForm(undefined, sinon.spy());
    console.log(requests);
    t.is(requests.length, 1);
    t.is(requests[0].url, "/api/contract");
    t.is(requests[0].method, "POST");
    console.log(requests[0].requestBody);
});

test.after( () => {
    xhr.restore();
});