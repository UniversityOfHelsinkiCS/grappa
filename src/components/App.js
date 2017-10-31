import React, { Component } from 'react';
import { callApi } from "../util/apiConnection.js";

import { connect } from "react-redux";
import { changeUserRole } from "./user/UserActions.js";

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: { id: props.role },
        }
    }

    componentDidMount() {
        document.title = "Grappa: Main page";
    }

    /*handlePost = (e) => {
        e.preventDefault()
        let value = this.refs.input.value;
        callApi('/helloUser?username=' + value)
            .then(resp => {
                this.setState({
                    username: resp.data.text
                })
            }).catch((error) => console.error(error));
    }
    */

    handleRoleChange = (e) => {
        e.preventDefault();
        let newRole = document.getElementById('roles').value;
        this.setState({
            role: { id: newRole },
        });
        //newRole = this.state.role;
        this.props.changeUserRole({id: newRole});
    }

    render() {
        return (
            <div className="App">
                <div className="ui segment">
                    <form onSubmit={this.handleRoleChange}>
                        <select id="roles" className="ui dropdown">
                            <option value="">Choose a role</option>
                            <option value="opiskelija">Opiskelija</option>
                            <option value="vastuuohjaaja">Vastuuohjaaja</option>
                            <option value="muu ohjaaja">Muu ohjaaja</option>
                            <option value="vastuuprofessori">Vastuuprofessori</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button className="ui button" type="submit">Choose</button>
                    </form>
                    <p>Your role is: {this.state.role.id} </p>
                </div>
            </div>
        );
    }
}

//export default App;

const mapDispatchToProps = (dispatch) => ({
    changeUserRole: function (data) {
        dispatch(changeUserRole(data));
    },
});

const mapStateToProps = (state) => {
    console.log(state);
    if (!state.user[0])
        return {role: undefined};
    return { role: state.user[0].role.id };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
