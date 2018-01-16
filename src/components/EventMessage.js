import React from 'react';
import PropTypes from 'prop-types';
import { setTimeout } from 'timers';

const EVENT_MESSAGE_CLEAR_TIMEOUT = 10000;
let timeout;

const EventMessage = ({ type, message, clearMessages }) => {
    clearTimeout(timeout);
    timeout = setTimeout(clearMessages, EVENT_MESSAGE_CLEAR_TIMEOUT);

    const closeMessage = () => {
        clearTimeout(timeout);
        clearMessages();
    }

    return (
        <div className={'ui ' + type + ' message'}>
            <i className="close icon" onClick={() => closeMessage()} />
            <div className="header">{message}</div>
        </div>
    );
};

const { string, func } = PropTypes;
EventMessage.propTypes = {
    type: string.isRequired,
    message: string.isRequired,
    clearMessages: func.isRequired
};

export default EventMessage;
