import React, { Component } from 'react';
import { arrayOf, func } from 'prop-types';
import { programmeType, roleType } from '../../util/types';

export default class PersonInviter extends Component {
    constructor() {
        super();
        this.state = {
            email: undefined,
            role: undefined,
            programme: undefined
        };
    }

    changeValue = type => (event) => {
        const { value } = event.target;
        this.setState({ [type]: value })
    };

    sendEmail = () => {
        const { programme, role, email } = this.state;
        if (programme && role && email) {
            this.props.handleSendInvite(programme, role, email)
        }
    };

    roleDropdown = () => {
        if (!this.props.roles) {
            return undefined;
        }
        return (
            <select className="ui dropdown" onChange={this.changeValue('role')}>
                <option value="">Role</option>
                {this.props.roles.map(role =>
                    <option key={role.roleId} value={role.roleId}>{role.name}</option>
                )}
            </select>
        )
    };

    programmeDropdown = () => {
        if (!this.props.programmes) {
            return undefined;
        }
        return (
            <select className="ui dropdown" onChange={this.changeValue('programme')}>
                <option value="">Programme</option>
                {this.props.programmes.map(programme =>
                    <option key={programme.programmeId} value={programme.programmeId}>{programme.name}</option>
                )}
            </select>
        )
    };

    render() {
        return (
            <div className="ui form" style={{ margin: '2%' }}>
                <h2>Invite a new non-student grappa user</h2>
                <div className="three fields">
                    <div className="field">
                        <label>Programme</label>
                        {this.programmeDropdown()}
                    </div>
                    <div className="field">
                        <label>Role</label>
                        {this.roleDropdown()}
                    </div>
                    <div className="field">
                        <label>Email address</label>
                        <input
                            type="text"
                            placeholder="matti.meikäläinen@helsinki.fi"
                            onChange={this.changeValue('email')}
                        />
                    </div>
                </div>
                <button className="ui big green button" onClick={this.sendEmail}>
                    Send email
                </button>
            </div>
        )
    }
}

PersonInviter.propTypes = {
    handleSendInvite: func.isRequired,
    roles: arrayOf(roleType).isRequired,
    programmes: arrayOf(programmeType).isRequired
};
