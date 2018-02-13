import React, { Component } from 'react';
import { personType } from '../../../../util/types';

export default class StudentInfoForm extends Component {
    field = (label, text) => (
        <div>
            <br />
            <b>{label}</b>
            <div className="ui fluid input">
                <input type="text" value={text} disabled />
            </div>
        </div>
    )
    render() {
        if (!this.props.user.firstname) {
            return (
                <div>
                    Login to see user info
                </div>
            )
        }
        return (
            <div>
                <h1>Opinnäytetyön tekijä</h1>
                {this.field('Etunimi', this.props.user.firstname)}
                {this.field('Sukunimi', this.props.user.lastname)}
                {this.field('Opiskelijanumero', this.props.user.studentNumber)}
                {this.field('Lähiosoite', this.props.user.address)}
                {this.field('Puhelinnumero', this.props.user.phone)}
                {this.field('Sähköpostiosoite', this.props.user.email)}
                {this.field('Pääaine', this.props.user.major)}
            </div>
        )
    }
}

StudentInfoForm.propTypes = {
    user: personType.isRequired
};
