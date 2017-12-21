import React, { Component } from 'react';
import { connect } from "react-redux";
import { login } from "./userActions";

export class UserPage extends Component {

    constructor() {
        super();
        this.state = {
            personId: 1,
            name: "Unnamed",
            role: "student"
        }
    }

    componentDidMount() {
        document.title = "Grappa: Main page";
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
                    <select id="roles" className="ui dropdown" onChange={this.handleRoleChange}>
                        <option value="">Choose a role</option>
                        {this.props.persons.map((person, index) =>
                            <option key={index} value={person.shibbolethId}>{person.firstname} {person.lastname}</option>
                        )}
                    </select>
                    <p>Your roles are: {this.props.user.roles ?
                        this.props.user.roles.map(roleObject => {
                            return roleObject.studyfield + ": " + roleObject.role;
                        })
                        : "No user in redux"} </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
