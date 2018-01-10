import React, { Component } from 'react';

export default class PersonRoleChoose extends Component {

    constructor() {
        super();
        this.state = {
            email: undefined
        };
    }

    render() {
        const mail = this.state.email;
        return (
            <div> TODO: Control users {mail} </div>
        )
    }
}