import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default class NavBar extends Component {
    render() {
        const elements = [
            { path: '/', text: 'Homepage' },
            { path: '/agreementform', text: 'AgreementForm' },
            { path: '/agreement', text: 'Agreement' },
            { path: '/theses', text: 'Theses' },
            { path: '/graderManagement', text: 'Supervisor management' },
            { path: '/thesis', text: 'New thesis' }
        ];

        return (
            <div>
                <div className="ui inverted segment">
                    <h2>Grappa</h2>
                </div>
                <div className="ui stackable secondary pointing menu">
                    {elements.map((elem, index) => <NavLink key={index} to={elem.path} exact className="item">{elem.text}</NavLink>)}
                    <div className="right menu">
                        <Link to="/" className="item">Logout</Link>
                    </div>
                </div>
            </div>
        );
    }
}
