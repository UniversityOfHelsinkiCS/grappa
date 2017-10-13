import React, { Component } from 'react';

export default class EventMessage extends Component {
    render() {
        return <div className={'ui ' +  this.props.type + ' message'}><i className="close icon"></i><div className="header">{this.props.message}</div></div>;
    }
}