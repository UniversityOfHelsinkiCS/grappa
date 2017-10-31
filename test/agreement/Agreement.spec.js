import React from 'react';
import test from 'ava';
import { Router, Link } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
require('ignore-styles')
import {Agreement} from '../../src/components/agreement/Agreement';
import FormCreator from '../../src/components/form/FormCreator';

const wrapper = shallow(<Agreement agreement={[]} />);

//UNFINISHED
test.skip('calls FormCreator properly', t => {
    const agreementStoreStub = ['some elemtn','elemnt n2', '3rd element'];

    const FakeForm = React.createClass({
        render: () => <div>Fake Form</div>,
      })
    Agreement.__Rewire__('FormCreator', FakeForm)

    const wrapper2 = shallow(<Agreement agreement={agreementStoreStub} />);
    const spy = sinon.stub(Agreement.prototype, 'sendForm')
    const spy2 = sinon.stub(Agreement.prototype, 'handleFormChange')


    
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
