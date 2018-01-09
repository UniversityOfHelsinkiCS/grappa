import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from './userActions';
import UserStudyfieldSelector from './UserStudyfieldSelector';
import { personType } from '../../util/types';

export class UserPage extends Component {
    
    componentDidMount() {
        document.title = 'Grappa: Main page';
    }

    handleRoleChange = (event) => {
        if (!event.target.value) return
        const shibbolethId = event.target.value;
        this.props.login(shibbolethId);
    }

    render() {
        return (
            <div>
                <div className="ui segment">
                    <h2>{this.props.user.firstname} {this.props.user.lastname}</h2>
                    <div className="ui list">
                        <div className="item">
                            <span className="header">Student number</span> {this.props.user.studentNumber}
                        </div>
                        <div className="item">
                            <span className="header">Email</span> {this.props.user.email}
                        </div>
                        <div className="item">
                            <span className="header">Address</span> {this.props.user.address}
                        </div>
                        <div className="item">
                            <span className="header">Phone</span> {this.props.user.phone}
                        </div>
                    </div>
                    <UserStudyfieldSelector />
                </div>
                <div className="ui segment">
                    <select id="roles" className="ui dropdown" onChange={this.handleRoleChange}>
                        <option value="">Choose a role</option>
                        {this.props.persons.map((person) =>
                            <option key={person.personId} value={person.shibbolethId}>{person.firstname} {person.lastname}</option>
                        )}
                    </select>
                    <p>Your roles are: {this.props.user.roles ?
                        this.props.user.roles.map(roleObject => {
                            return roleObject.studyfield + ': ' + roleObject.role;
                        })
                        : 'No user in redux'} </p>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    login(data) {
        dispatch(login(data));
    }
});

const mapStateToProps = (state) => {
    return {
        user: state.user,
        persons: state.persons
    };
}

const { arrayOf, func } = PropTypes;
UserPage.propTypes = {
    user: personType.isRequired,
    persons: arrayOf(personType).isRequired,
    login: func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
