import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EventMessage from '../../components/EventMessage';

const EventMessageContainer = ({ messages, clearMessages }) => (
    <div>
        {messages.map(message =>
            (<EventMessage
                key={`${message.type}-${message.key}`}
                type={message.type}
                message={message.text}
                clearMessages={clearMessages}
            />)
        )}
    </div>
);

const mapStateToProps = ({ eventMessage }) => ({
    messages: Object.keys(eventMessage)
        .filter(key => eventMessage[key].active === true)
        .map(key => Object.assign({ key }, eventMessage[key]))
});

const mapDispatchToProps = dispatch => ({
    clearMessages: () => dispatch({ type: 'EVENT_MESSAGE_CLEAR' })
});

EventMessageContainer.propTypes = {
    messages: PropTypes.array.isRequired,
    clearMessages: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(EventMessageContainer);
