import React, { Component } from 'react';
import { connect } from 'react-redux';
import { arrayOf, func } from 'prop-types';
import { personType, roleType, programmeType, availableRoleType } from '../../util/types';

import PersonSelector from '../../components/person/PersonSelector';
import PersonInviter from '../../components/person/PersonInviter';
import PersonRoleChoose from '../../components/person/PersonRoleChoose';

import { getAvailableRoles, saveRole, deleteRole } from '../role/roleActions';

export class PersonRoleManagePage extends Component {
    constructor(props) {
        super(props);
        this.props.getAvailableRoles();
        this.state = {
            person: undefined,
            roles: undefined
        };
    }

    componentWillReceiveProps(newProps) {
        if (this.state.person) {
            const person = this.state.person
            const roles = newProps.roles.filter(role => role.personId === person.personId)
                .map((role) => {
                    role.programme = newProps.programmes.find(field => field.programmeId === role.programmeId).name
                    return role;
                })
            this.setState({ roles });
        }
    }

    selectPerson = (persons) => {
        const person = persons.find(item => !this.state.person || item.personId !== this.state.person.personId)
        const roles = person ?
            this.props.roles.filter(role => role.personId === person.personId)
                .map((role) => {
                    role.programme = this.props.programmes.find(field => field.programmeId === role.programmeId).name
                    return role;
                })
            : undefined
        this.setState({ person, roles });
    }

    handleAddRole = (role) => {
        role.personId = this.state.person.personId;
        if (role.personId && role.roleId && role.programmeId) {
            this.props.saveRole(role)
        }
    }

    handleRemoveRole = (role) => {
        this.props.deleteRole(role)
    }

    handleSendInvite = (programme, role, email) => {
        console.log(programme, role, email);
    }

    renderManagement = () => {
        if (!this.state.person) {
            return (
                <PersonInviter
                    roles={this.props.availableRoles}
                    programmes={this.props.programmes}
                    handleSendInvite={this.handleSendInvite}
                />
            )
        }
        return (<PersonRoleChoose
            person={this.state.person}
            roles={this.state.roles}
            programmes={this.props.programmes}
            availableRoles={this.props.availableRoles}
            addRole={this.handleAddRole}
            removeRole={this.handleRemoveRole}
        />);
    }

    render() {
        const selected = this.state.person ? [this.state.person] : []
        return (
            <div>
                <PersonSelector
                    persons={this.props.persons}
                    selected={selected}
                    changeList={this.selectPerson}
                />
                {this.renderManagement()}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    getAvailableRoles() {
        dispatch(getAvailableRoles());
    },
    saveRole(role) {
        dispatch(saveRole(role))
    },
    deleteRole(role) {
        dispatch(deleteRole(role))
    }
});

const mapStateToProps = state => ({
    programmes: state.programmes,
    persons: state.persons,
    roles: state.roles,
    availableRoles: state.availableRoles
})

PersonRoleManagePage.propTypes = {
    programmes: arrayOf(programmeType).isRequired,
    persons: arrayOf(personType).isRequired,
    roles: arrayOf(roleType).isRequired,
    availableRoles: arrayOf(availableRoleType).isRequired,
    getAvailableRoles: func.isRequired,
    saveRole: func.isRequired,
    deleteRole: func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonRoleManagePage);
