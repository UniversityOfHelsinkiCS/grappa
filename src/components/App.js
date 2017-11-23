import React, { Component } from 'react';
import { connect } from "react-redux";
import { login } from "../containers/user/userActions";
import { userRoles } from "../util/rolePermissions";

export class App extends Component {

    componentDidMount() {
        document.title = "Grappa: Main page";
    }

    handleRoleChange = (event) => {
        if (!event.target.value) return
        const user = {
            type: event.target.value,
            id: 1
        }
        this.props.login(user);
    }

    render() {
        return (
            <div>
                <div className="ui segment">
                    <select id="roles" className="ui dropdown" onChange={this.handleRoleChange}>
                        <option value="">Choose a role</option>
                        {userRoles.map((role, index) => 
                            <option key={index} value={role}>{role}</option>
                        )}
                    </select>
                    <p>Your role is: {this.props.user ? this.props.user.type : "Not selected"} </p>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    login(data) {
        dispatch(login(data));
    },
});

const mapStateToProps = (state) => {
    return {
        user: state.user
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
