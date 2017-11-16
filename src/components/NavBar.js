import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { connect } from "react-redux";
import { getPermissions } from "../util/rolePermissions";

export class NavBar extends Component {
    constructor() {
        super();
        this.state = {
            links: []
        }
    }

    componentDidMount() {
        this.refreshLinks(this.props)
    }

    componentWillReceiveProps(props) {
        this.refreshLinks(props);
    }

    refreshLinks = (props) => {
        if (props.user) {
            const links = getPermissions(props.user.type, 'nav-bar', 'show');
            this.setState({ links });
        }
    }

    render() {
        /*const linkElements = elements.map(elem => {
            if(this.state.active === elem.text)
                return <Link key={elem.text} to={elem.path} className="item active">{elem.text}</Link>;
            else
                return <Link key={elem.text} to={elem.path} className="item">{elem.text}</Link>
         });*/
        return (
            <div>
                <div className="ui inverted segment">
                    <h1><Link to="/">Grappa</Link></h1>
                </div>
                <div className="ui stackable secondary pointing menu">
                    {this.state.links ? this.state.links.map((elem, index) => <NavLink key={index} to={elem.path} exact className="item">{elem.navText}</NavLink>) : undefined}
                    <div className="right menu">
                        <Link to="/" className="item">Logout</Link>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    };
}

export default connect(mapStateToProps)(NavBar);
