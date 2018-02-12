import React, { Component } from 'react';
import { arrayOf, func } from 'prop-types';
import ProgrammeSelect from '../../Unit/components/ProgrammeSelect';
import { personType, programmeType, roleType } from '../../../util/types';

export default class PersonRoleChoose extends Component {
    constructor() {
        super();
        this.state = {
            roleId: undefined,
            programmeId: undefined
        };
    }

    changeValue = type => (event) => {
        const { value } = event.target;
        this.setState({ [type]: value })
    };

    programmeDropdown = () => (
        <ProgrammeSelect
            onChange={this.changeValue('programmeId')}
            programmes={this.props.programmes}
        />
    );

    roleDropdown = () => (
        <select
            className="ui dropdown"
            onChange={this.changeValue('roleId')}
        >
            <option key="0" value="">Select</option>
            {this.props.availableRoles.map(role => (
                <option key={role.roleId} value={role.roleId}>
                    {role.name}
                </option>
            ))}
        </select>
    );

    addRole = () => {
        const role = {
            roleId: this.state.roleId,
            programmeId: this.state.programmeId
        };
        this.props.addRole(role)
    };

    removeRole = role => () => this.props.removeRole(role);

    render() {
        const { person, roles } = this.props;
        return (
            <div>
                <h2>{`${person.firstname} ${person.lastname}`}</h2>
                <p>
                    Removing grader is only possible if the person has not graded anything and is not grading anything.
                    Removing supervisor is only possible if the person has not supervised anything and is not
                    supervising anything.
                    {/* TODO: Make sure this is the way it's supposed to be */}
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

PersonRoleChoose.propTypes = {
    programmes: arrayOf(programmeType).isRequired,
    availableRoles: arrayOf(roleType).isRequired,
    roles: arrayOf(roleType).isRequired,
    person: personType.isRequired,
    addRole: func.isRequired,
    removeRole: func.isRequired
};
