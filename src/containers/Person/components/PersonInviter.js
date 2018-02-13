import React, { Component } from 'react'
import { arrayOf, func } from 'prop-types'
import { programmeType, roleType } from '../../../util/types'
import ProgrammeSelect from '../../Unit/components/ProgrammeSelect'

export default class PersonInviter extends Component {
    constructor() {
        super()
        this.state = {
            email: undefined,
            role: undefined,
            programmeId: undefined
        }
    }

    changeValue = type => (event) => {
        const { value } = event.target
        this.setState({ [type]: value })
    };

    sendEmail = () => {
        const { programmeId, role, email } = this.state
        if (programmeId && role && email) {
            this.props.handleSendInvite(programmeId, role, email)
        }
    };

    roleDropdown = () => {
        if (!this.props.roles) {
            return undefined
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

    programmeDropdown = () => (
        <ProgrammeSelect
            onChange={this.changeValue('programmeId')}
            programmes={this.props.programmes}
        />
    );

    render() {
        return (
            <div className="ui form">
                <h2>Invite a new non-student grappa user</h2>
                <div className="three fields">
                    <div className="field ten wide">
                        <label>Unit</label>
                        {this.programmeDropdown()}
                    </div>
                    <div className="field two wide">
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
}
