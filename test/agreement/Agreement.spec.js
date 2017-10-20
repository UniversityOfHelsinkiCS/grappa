import React from 'react';
import test from 'ava';
import { Router, Link } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
require('ignore-styles')
import {Agreement} from '../../src/components/agreement/Agreement';
import FormCreator from '../../src/components/form/FormCreater';

const wrapper = shallow(<Agreement agreement={[]} />);
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
    const input = findElement(elementType,elementName);
    input.simulate('change', { target: { name: elementName, value: randomString } });

    return (wrapper.state().form[elementName] === randomString);
}

const textareaValueChecker = (elementType, elementName) => {
    const randomString = getRandomString();
    const textArea = findElement(elementType, elementName);
    textArea.simulate('change', { target: {name: elementName, value: randomString } });
    return (wrapper.find(elementType + '[name="' + elementName + '"]').props().value === randomString);
}

const getJson = (object) => {
    return JSON.stringify(object);
}

const findElement = (elementType, elementName) => {
    return wrapper.find(elementType + '[name="' + elementName + '"]');
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
test('has a correct tittle 2', t => {
    t.truthy(wrapper.contains(<h2>Thesis Agreement</h2>));
});

//UNFINISHED
test.skip('calls FormCreator properly', t => {
    const agreementStoreStub = ['some elemtn','elemnt n2', '3rd element'];

    const FakeForm = React.createClass({
        render: () => <div>Fake Form</div>,
      })
    Agreement.__Rewire__('FormCreator', FakeForm)

    const wrapper2 = shallow(<Agreement agreement={agreementStoreStub} />);
    const spy = sinon.stub(Agreement.prototype, 'sendForm')
    const spy = sinon.stub(Agreement.prototype, 'handleFormChange')


    
    t.is(wrapper.find(FakeBook).length,1)


    t.truthy(wrapper.contains(<h2>Thesis Agreement</h2>));
});

test.skip("TBD: change in redux state leads to change in UI", t => {
    let axiousStub = sinon.stub(axios, 'post').withArgs('/agreement', wrapper.state().form)
        .returns(
            Promise.resolve({
                status: 200,
                response: { text: "Agreement saved to backend" }
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
