import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from './userActions';
import { personType } from '../../util/types';
import PersonSwitcher from '../Person/components/PersonSwitcher';
import RoleExplain from '../Role/components/RoleExplain';

export class UserPage extends Component {
    componentDidMount() {
        document.title = 'Grappa: Main page';
    }

    handleRoleChange = (event) => {
        if (!event.target.value) return;
        const shibbolethId = event.target.value;
        this.props.login(shibbolethId);
    };

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
                            <span className="header">Phone</span> {this.props.user.phone}
                        </div>
                    </div>
                </div>
                {process.env.NODE_ENV !== 'production' ?
                    <PersonSwitcher
                        persons={this.props.persons}
                        onChange={this.handleRoleChange}
                    />
                    : null}
                <RoleExplain user={this.props.user} />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    login(data) {
        dispatch(login(data));
    }
});

const mapStateToProps = state => ({
    user: state.user,
    persons: state.persons
});

const { arrayOf, func } = PropTypes;
UserPage.propTypes = {
    user: personType.isRequired,
    persons: arrayOf(personType).isRequired,
    login: func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
