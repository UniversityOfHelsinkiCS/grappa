import React, { Component } from 'react';

export default class PersonInviter extends Component {

    constructor() {
        super();
        this.state = {
            email: undefined
        };
    }

    render() {
        const mail = this.state.email;
        return (
            <div> TODO: Send emails to invite users: {mail} </div>
        )
    }
}