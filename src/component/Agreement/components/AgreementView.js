import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { agreementType, personType, thesisType } from '../../../util/types';

class AgreementView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAgreements: []
        }
    }

    getAuthorName(agreement) {
        const author = this.props.persons.find(person => person.personId === agreement.authorId);
        return author ? `${author.firstname} ${author.lastname}` : '';
    }

    getSupervisor(agreement) {
        const supervisor = this.props.persons.find(person => person.personId === agreement.responsibleSupervisorId);
        if (supervisor)
            return `${supervisor.firstname} ${supervisor.lastname}`;

        return '';
    }

    getThesis(agreement) {
        return this.props.theses.find(thesis => thesis.thesisId === agreement.thesisId) || {};
    }

    handleEdit= (e, agreement) => {
        this.props.handleEditAgreement(agreement);
    }

    changeShowing(e, agreement) {
        const index = this.props.agreements.findIndex((x => x.agreementId === agreement.agreementId));
        const newState = Object.assign({}, this.state);
        if (newState.showAgreements[index]) { // can't use x = !x since x is at first undefined
            newState.showAgreements[index] = false; // if is visible, hide
        } else {
            newState.showAgreements[index] = true;
        }
        this.setState({
            showAgreements: newState.showAgreements
        });
    }

    renderList() {
        const data = this.props.agreements;
        return (
            <div>
                {data.map(agreement => (
                    <div className="ui padded segment" key={agreement.agreementId}>
                        <h2 className="ui header">
                            {this.getAuthorName(agreement)}: {this.getThesis(agreement).title}
                        </h2>
                        <b>Ohjausvastuut: </b> <br />
                        Vastuuohjaaja: {agreement.title} {this.getSupervisor(agreement)}<br />
                        Muuohjaaja: to be shown here<br />
                        2. ohjaaja: to be shown here<br />
                        <button
                            key={agreement.agreementId}
                            className="ui primary button"
                            onClick={e => this.changeShowing(e, agreement)}
                        >
                            Show/hide agreement information
                        </button>
                        <button
                            className="ui primary button"
                            onClick={e => this.handleEdit(e, agreement)}
                        >
                            Edit agreement
                        </button>
                        {this.renderOne(agreement)}
                    </div>
                ))}
            </div>
        );
    }

    renderOne(agreement) {
        const index = this.props.agreements.findIndex(x => x.agreementId === agreement.agreementId);
        return (
            <div>
                {this.state.showAgreements[index] ?
                    <div className="ui padded segment" key={agreement.agreementId}>
                        <h2 className="ui header">{agreement.thesisTitle}</h2>
                        {/*
                        atm doesn't get the information from back end. Is it needed?
                        <h4>Gradun tekijän tiedot</h4>
                        <div>
                            <div className="two fields">
                                Gradun tekijän nimi: {agreement.firstname + " " + agreement.lastname + "\t"}|
                                Gradun ala: {agreement.programmeName}
                            </div>
                            <div className="two fields">
                                Opiskelijanumero: {agreement.studentNumber + "\t"}|
                        Lähiosoite: {agreement.address}
                            </div>
                            <div className="two fields">
                                Sähköpostiosoite: {agreement.email + "\t"}|
                        Puhelinnumero: {agreement.phone}
                            </div>
                        </div> */}

                        <h4>Opinnäytetyön tiedot</h4>
                        <p>
                            Aloitusajankohta: {agreement.startDate}<br />
                            Arvioitu valmistumisajankohta: {agreement.completionEta}<br />
                            Suorituspaikka: {agreement.performancePlace}<br />
                        </p>
                        <h4>Ohjausvastuut</h4>
                        <p>
                            {/* TODO: pass other supervisors as a list from backend with other
                            agreement info. */}
                            Vastuuohjaaja: {agreement.title} {agreement.firstname} {agreement.lastname}<br />
                            Muu ohjaaja: the be shown here<br />
                            2. ohjaaja: to be shown here<br />
                        </p>
                        <h4>Työskentelyn tavoitteet ja ajankäyttö</h4>
                        <p>
                            Viikoittainen työaika: {agreement.studentWorkTime}
                            <br />
                            Ohjaajien varmaama ohjausaika: {agreement.supervisorWorkTime}
                            <br />
                            Välitavoitteet: {agreement.intermediateGoal}
                            <br />
                            Sopimus tapaamistiheydestä, yhteydenpitotavoista ja keskusteluun
                            käytettävissä olevasta ajasta: {agreement.meetingAgreement}
                            <br />
                            Tavoitearvosana: {agreement.studentGradeGoal}
                        </p>
                        <p>
                            Muuta: {agreement.other}
                        </p>
                    </div>
                    : undefined}
            </div>
        );
    }

    render() {
        if (this.props.agreements.length > 0) return <div>{this.renderList()}</div>
        return (
            <div>{this.renderOne(this.props.agreements)}</div>
        );
    }
}

const { arrayOf, func } = PropTypes;
AgreementView.propTypes = {
    agreements: arrayOf(agreementType).isRequired,
    persons: arrayOf(personType).isRequired,
    theses: arrayOf(thesisType).isRequired,
    handleEditAgreement: func.isRequired
};

export default AgreementView;
