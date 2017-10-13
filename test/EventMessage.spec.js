import React from 'react';
import test from 'ava';
import EventMessage from "../src/components/EventMessage";
import {shallow, mount} from 'enzyme';
require('ignore-styles');


test('with success message element is correct', t => {
   t.truthy(checkIfEventMessageRenders("success", "onnistumisviesti"));
});

test('with error message element has correct text', t=> {
    t.truthy(checkIfEventMessageRenders("failure" , "epäonnistumisviesti"));
});


const getEventMessage = (typeOfMessage, eventMessage) => {
    return <EventMessage type = {typeOfMessage} message = {eventMessage} />;
};

const checkIfEventMessageRenders = (typeOfMessage, eventMessage) => {
    const eventElement = getEventMessage(typeOfMessage, eventMessage);
    const wrapper = shallow(eventElement);
    const expectedElement = <div className={'ui ' + typeOfMessage + ' message'}>
                                <i className="close icon"></i>
                                <div className="header">{eventMessage}</div>
                            </div>;
    return wrapper.contains(expectedElement);
};

