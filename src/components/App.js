import React, { Component } from 'react';
import { connect } from "react-redux";
import { login } from "../containers/user/userActions.js";

export class App extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        document.title = "Grappa: Main page";
    }

    handleRoleChange = (event) => {
        const user = {
            type: event.target.value
        }
        this.props.login(user);
    }

    render() {
        return (
            <div>
                <div className="ui segment">
                    <select id="roles" className="ui dropdown" onChange={this.handleRoleChange}>
                        <option value="student">Choose a role</option>
                        <option value="student">Opiskelija</option>
                        <option value="supervisor">Vastuuohjaaja</option>
                        <option value="other_supervisor">Muu ohjaaja</option>
                        <option value="resp_professor">Vastuuprofessori</option>
                        <option value="admin">Admin</option>
                    </select>
                    <p>Your role is: {this.props.user ? this.props.user.type : "visitor"} </p>
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
