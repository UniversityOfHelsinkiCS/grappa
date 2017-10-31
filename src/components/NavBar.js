import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NavBar extends Component {
    render() {
        const elements = [
            {path: '/', text: 'Homepage'},
            {path: '/agreementform', text: 'AgreementForm'},
            {path: '/agreement', text: 'Agreement'},
            {path: '/theses', text: 'Theses'},
            {path: '/graderManagement', text: 'Supervisor management'},
            {path: '/thesis', text: 'New thesis'}
        ]
        const linkElements = elements.map((elem, index) => 
            this.props.active === elem.text ? 
                <Link key={index} to={elem.path} className="item active">{elem.text}</Link> :
                <Link key={index} to={elem.path} className="item">{elem.text}</Link>
         );

        return (
            <div className="ui stackable secondary pointing menu">
                {linkElements}
                <div className="right menu">
                    <Link to="/" className="item">Logout</Link>
                </div>
            </div>
        );
    }
}
