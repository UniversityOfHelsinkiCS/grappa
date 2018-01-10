import React, { Component } from 'react';
import { connect } from 'react-redux';

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
            console.log("WTF");
            const person = this.state.person
            const roles = newProps.roles.filter(role => role.personId === person.personId)
                .map(role => {
                    role.studyfield = newProps.studyfields.find(field => field.studyfieldId === role.studyfieldId).name
                    return role;
                })
            console.log(roles);
            this.setState({ roles });
        }
    }

    selectPerson = persons => {
        const person = persons.find(item => !this.state.person || item.personId !== this.state.person.personId)
        const roles = person ?
            this.props.roles.filter(role => role.personId === person.personId)
                .map(role => {
                    role.studyfield = this.props.studyfields.find(field => field.studyfieldId === role.studyfieldId).name
                    return role;
                })
            : undefined
        this.setState({ person, roles });
    }

    handleAddRole = role => {
        role.personId = this.state.person.personId;
        this.props.saveRole(role)
    }

    handleRemoveRole = role => {
        this.props.deleteRole(role)
    }

    renderManagement = () => {
        if (!this.state.person) {
            return <PersonInviter />
        }
        return <PersonRoleChoose
            person={this.state.person}
            roles={this.state.roles}
            studyfields={this.props.studyfields}
            availableRoles={this.props.availableRoles}
            addRole={this.handleAddRole}
            removeRole={this.handleRemoveRole} />
    }

    render() {
        const selected = this.state.person ? [this.state.person] : []
        return (
            <div>
                <PersonSelector
                    persons={this.props.persons}
                    selected={selected}
                    changeList={this.selectPerson} />
                {this.renderManagement()}
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    getAvailableRoles() {
        dispatch(getAvailableRoles());
    },
    saveRole(role) {
        dispatch(saveRole(role))
    },
    deleteRole() {
        dispatch(deleteRole())
    },
});

const mapStateToProps = (state) => {
    return {
        studyfields: state.studyfields,
        persons: state.persons,
        roles: state.roles,
        availableRoles: state.availableRoles,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonRoleManagePage);