import React, { Component } from 'react';
import { connect } from 'react-redux';

import PersonSelector from '../../components/person/PersonSelector';
import PersonInviter from '../../components/person/PersonInviter';
import PersonRoleChoose from '../../components/person/PersonRoleChoose';


export class PersonRoleManagePage extends Component {
    constructor() {
        super();
        this.state = {
            person: undefined
        };
    }

    selectPerson = persons => {
        const person = persons.find(item => !this.state.person || item.personId !== this.state.person.personId)
        this.setState({ person });
    }

    renderManagement = () => {
        if (!this.state.person) {
            return <PersonInviter />
        }
        return <PersonRoleChoose />
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
});

const mapStateToProps = (state) => {
    return {
        persons: state.persons,
        roles: state.roles,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonRoleManagePage);