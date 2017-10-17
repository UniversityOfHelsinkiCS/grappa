import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import { callApi } from "../util/apiConnection.js";

import { connect } from "react-redux";
import { changeRole } from "./user/UserActions.js";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: {id: undefined},
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
        e.preventDefault()
        let newRole = document.getElementById('roles').value;
        
        this.setState({
            role: newRole,
        })
        newRole = this.state.role;
        this.props.changeRole(newRole);
    }

    render() {
        return (
            <div className="App">
                <div className="ui inverted segment">
                    <h2>Choose a role for browsing Grappa 2</h2>
                </div>
                <NavBar active={"Homepage"} />
                <div className="ui segment">
                    <form onSubmit={this.handleRoleChange}>
                        <select id="roles" class="ui dropdown">
                            <option value="">Choose a role</option>
                            <option value="opiskelija">Opiskelija</option>
                            <option value="vastuuohjaaja">Vastuuohjaaja</option>
                            <option value="muu ohjaaja">Muu ohjaaja</option>
                            <option value="vastuuprofessori">Vastuuprofessori</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button className="ui button" type="submit">Choose</button>
                    </form>
                </div>
            </div>
        );
    }
}

//export default App;

const mapDispatchToProps = (dispatch) => ({
    saveAddedGrader: function (data) {
        dispatch(changeRole(data));
    },
});

const mapStateToProps = (state) => {
    return { role: state.role };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
