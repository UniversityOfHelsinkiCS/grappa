import React, { Component } from 'react';

export default class PersonRoleChoose extends Component {

    constructor() {
        super();
        this.state = {
            roleId: undefined,
            programmeId: undefined,
        };
    }

    changeStudyfield = (event) => {
        const programmeId = event.target.value;
        this.setState({ programmeId });
    }

    changeRole = (event) => {
        const roleId = event.target.value;
        this.setState({ roleId })
    }

    programmeDropdown = () => {
        return (
            <select
                className="ui dropdown"
                onChange={this.changeStudyfield}
            >
                <option key="0" value="">Select</option>
                {this.props.programmes.map(field => (
                    <option key={field.programmeId} value={field.programmeId}>
                        {field.name}
                    </option>
                ))}
            </select>
        )
    }

    roleDropdown = () => {
        return (
            <select
                className="ui dropdown"
                onChange={this.changeRole}
            >
                <option key="0" value="">Select</option>
                {this.props.availableRoles.map(role => (
                    <option key={role.roleId} value={role.roleId}>
                        {role.name}
                    </option>
                ))}
            </select>
        )
    }

    addRole = () => {
        const role = {
            roleId: this.state.roleId,
            programmeId: this.state.programmeId
        }
        this.props.addRole(role)
    }

    removeRole = (role) => () => {
        this.props.removeRole(role);
    }

    render() {
        const person = this.props.person;
        const roles = this.props.roles;
        return (
            <div>
                <h2>{person.firstname + ' ' + person.lastname}</h2>
                <p>
                    Removing grader is only possible if the person has not graded anything and is not grading anything.
                    Removing supervisor is only possible if the person has not supervised anything and is not supervising anything.
                    {/*TODO: Make sure this is the way it's supposed to be */}
                </p>
                <table className="ui celled table">
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Studyfield</th>
                            <th>Control</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map(role => (
                            <tr key={role.personRoleId}>
                                <td>{role.name}</td>
                                <td>{role.programme}</td>
                                <td>
                                    {!role.agreementId ?
                                        <button
                                            className="ui red icon button"
                                            onClick={this.removeRole(role)}
                                        >
                                            Remove <i className="remove icon" />
                                        </button> : 'Linked to agreement'}
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td>{this.roleDropdown()}</td>
                            <td>{this.programmeDropdown()}</td>
                            <td>
                                <button
                                    className="ui green icon button"
                                    onClick={this.addRole}
                                >
                                    Add <i className="plus icon" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
