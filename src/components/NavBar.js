import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { connect } from "react-redux";
import { getPermissions } from "../util/rolePermissions";
import { login } from "../containers/user/userActions";

export class NavBar extends Component {
    constructor() {
        super();
        this.state = {
            links: []
        }
    }

    componentDidMount() {
        //This login will allow shibboleth to check on page reload
        this.props.login();
        this.refreshLinks(this.props)
        if (!this.props.user.roles) {
            this.props.history.push("/")
        }
    }

    componentWillReceiveProps(props) {
        this.refreshLinks(props);
    }

    refreshLinks = (props) => {
        let links = [];
        //Get all links that the user could require in their work.
        if (props.user && props.user.roles) {
            props.user.roles.forEach(roleObject => {
                const linkPermissions = getPermissions(roleObject.role, 'nav-bar', 'show');
                links = links.concat(linkPermissions.filter(link => !links.includes(link)));
            })
        }
        //Everyone who can access Grappa is a student
        const linkPermissions = getPermissions('student', 'nav-bar', 'show');
        links = links.concat(linkPermissions.filter(link => !links.includes(link)));

        this.setState({ links });

    }

    render() {
        return (
            <div>
                <div className="ui inverted segment">
                    <h1><Link to="/">Grappa</Link></h1>
                </div>
                <div className="ui stackable secondary pointing menu">
                    {this.state.links ? this.state.links.map((elem, index) => {
                        //Handle special cases:
                        switch (elem.path) {
                            case '/councilmeeting/:id': //Using navbar we want to display the NEXT councilmeeting, logic in component.
                                return <NavLink key={index} to={'/councilmeeting/next'} exact className="item">{elem.navText}</NavLink>
                            default:
                                return <NavLink key={index} to={elem.path} exact className="item">{elem.navText}</NavLink>
                        }
                    }) : undefined}
                    <div className="right menu">
                        <Link to="/" className="item">{this.props.user.firstname}</Link>
                        <Link to="/" className="item">Logout</Link>
                    </div>
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
        user: state.user
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
