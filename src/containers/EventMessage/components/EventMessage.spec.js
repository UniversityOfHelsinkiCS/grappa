import React from 'react';
import test from 'ava';
import EventMessage from './EventMessage';
import { shallow } from 'enzyme';


test('with success message element is correct', t => {
    t.truthy(checkIfEventMessageRenders('success', 'onnistumisviesti'));
});

test('with error message element has correct text', t => {
    t.truthy(checkIfEventMessageRenders('failure', 'epäonnistumisviesti'));
});


const getEventMessage = (typeOfMessage, eventMessage) => {
    return <EventMessage type={typeOfMessage} message={eventMessage} clearMessages={() => { }} />;
};

const checkIfEventMessageRenders = (typeOfMessage, eventMessage) => {
    const eventElement = getEventMessage(typeOfMessage, eventMessage);
    const wrapper = shallow(eventElement);

    return wrapper.find(`.${typeOfMessage}`).length === 1 && wrapper.find('.header').contains(eventMessage);
};

