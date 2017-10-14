import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class NavBar extends Component {
    render() {
        const elements = [
            {path: '/', text: 'Homepage'},
            {path: '/agreementform', text: 'AgreementForm'},
            {path: '/agreement', text: 'Agreement'},
            {path: '/theses', text: 'Theses'},
        ]
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
