import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { getPermissions } from "../util/rolePermissions";

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            links: [
                {path: '/', text: 'Homepage'},
                {path: '/agreementform', text: 'AgreementForm'},
                {path: '/agreement', text: 'Agreement'},
                {path: '/theses', text: 'Theses'},
                {path: '/graderManagement', text: 'Supervisor management'},
            ]
        }
    }

    componentWillReceiveProps(props) {
        if (props.role) {
            this.setState(
                {
                    links: getPermissions(props.role, 'nav-bar', 'show')
                }
            );
        }
    }

    render() {
        const elements = this.state.links
        const linkElements = elements.map(elem => {
            if(this.props.active === elem.text)
                return <Link key={elem.text} to={elem.path} className="item active">{elem.text}</Link>;
            else
                return <Link key={elem.text} to={elem.path} className="item">{elem.text}</Link>
         });

        return (
            <div className="ui secondary pointing menu">
                {linkElements}
                <div className="right menu">
                    <Link to="/" className="item"> Logout </Link>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    if (!state.user[0])
        return { role: undefined };
    return { role: state.user[state.user.length - 1].role.id };
}

export default connect(mapStateToProps)(NavBar);
