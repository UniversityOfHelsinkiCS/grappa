import React, { Component } from 'react';
import NavBar from './NavBar';

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
                <div className="ui inverted segment">
                    <h2>Choose a role for browsing Grappa 2</h2>
                </div>
                <NavBar active={"Homepage"} />
                <div className="ui segment">
                    <form onSubmit={this.handleRoleChange}>
                        <select id="roles" class="ui dropdown">
                            <option value="">Choose a role</option>
                            <option value="student">Opiskelija</option>
                            <option value="supervisor">Vastuuohjaaja</option>
                            <option value="other_supervisor">Muu ohjaaja</option>
                            <option value="resp_professor">Vastuuprofessori</option>
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
