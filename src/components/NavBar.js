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

    componentWillReceiveProps(props) {
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
         console.log(this.state.links);
        return (
            <div>
                <div className="ui inverted segment">
                    <h2>Grappa</h2>
                </div>
                <div className="ui stackable secondary pointing menu">
                    {this.state.links.map((elem, index) => <NavLink key={index} to={elem.path} exact className="item">{elem.navText}</NavLink>)}
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
