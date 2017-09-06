import React from 'react';
import test from 'ava';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import chai from 'chai';

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
  render() {
    return <p>Title Component</p>;
  }
}

//enzyme & jest test (DOESN'T WORK!!!)
test('enzyme & jest test', () => {
    const wrapper = shallow(
        <Title title="Events" />
    );
    expect(wrapper.prop('title')).to.equal('Events');
});
