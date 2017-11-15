import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { connect } from "react-redux";
import { getPermissions } from "../util/rolePermissions";

export class NavBar extends Component {
    state = {
        links: [
            { path: '/', text: 'Homepage' },
            { path: '/agreement', text: 'Agreement' },
            { path: '/theses', text: 'Theses' },
            { path: '/gradermanagement', text: 'Supervisor management' },
            { path: '/assesment', text: 'Assesment of theses' },
            { path: '/thesis', text: 'New thesis' },
            { path: '/councilmeeting', text: 'Next councilmeeting' },
            { path: '/councilmeetings', text: 'Councilmeetings' },
            { path: '/emaildrafts', text: 'Email drafts' }
        ]
    }

    componentWillReceiveProps(props) {
        if (props.user) {
            this.setState(
                {
                    links: getPermissions(props.user.type, 'nav-bar', 'show')
                }
            );
        }
    }

    render() {
        console.log("props", this.props);
        /*const linkElements = elements.map(elem => {
            if(this.state.active === elem.text)
                return <Link key={elem.text} to={elem.path} className="item active">{elem.text}</Link>;
            else
                return <Link key={elem.text} to={elem.path} className="item">{elem.text}</Link>
         });*/

        return (
            <div>
                <div className="ui inverted segment">
                    <h2>Grappa</h2>
                </div>
                <div className="ui stackable secondary pointing menu">
                    {this.state.links.map((elem, index) => <NavLink key={index} to={elem.path} exact className="item">{elem.text}</NavLink>)}
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
