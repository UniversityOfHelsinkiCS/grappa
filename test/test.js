import React from 'react';
import test from 'ava';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import chai from 'chai';
require('ignore-styles')
import App from '../src/App.js';
var expect = chai.expect;

//meta tests for all the testing frameworks

//ava test
test('my passing test', t => {
	t.pass();
});

//sinon test
test('sinon spy test', () => {
	var user = {
	  setName: function(name){
	    this.name = name;
			return this.name;
	  }
	}

	//Create a spy for the setName function
	var spy = sinon.spy(user, 'setName');

	sinon.assert.notCalled(spy);
	user.setName('Darth Vader');
	sinon.assert.calledOnce(spy);
	sinon.assert.match(spy.returned("Darth Vader"), true);

	//Important final step - remove the spy
	spy.restore();
});

class Title extends React.Component {

	constructor(props) {
    super(props);
    this.state = {
			title: props.title,
  };
}
  render() {
    return <p>{this.state.title}</p>;
  }
}

 test('Titles text is exactly the same', () => {
    const wrapper = shallow(
        <Title title="Events" />
    );
    expect(wrapper.text()).to.equal('Events');
});

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

test('welcome renders h1 element correct', () => {
	const wrapper = shallow(
			<Welcome name="Pekka" />
	);
	expect(wrapper.containsMatchingElement(<h1>Hello, Pekka</h1>)).to.equal(true);
})
