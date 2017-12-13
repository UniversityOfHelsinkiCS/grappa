import React, { Component } from 'react';


class AgreementView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAgreements: []
        }
    }

    renderOne(agreement) {
        let index = this.props.agreementData.findIndex(x => x.agreementId === agreement.agreementId);
        console.log('agreement');
        console.log(agreement);

        return (
            <div>
                {this.state.showAgreements[index] ?
                    <div className="ui padded segment" key={agreement.agreementId}>
                        <h2 className="ui header">{agreement.title}</h2>
                        <h4>Gradun tekijän tiedot</h4>
                        <div>
                            <div className="two fields">
                                Gradun tekijän nimi: {agreement.firstname + " " + agreement.lastname + "\t"}|
                        Pääaine: {agreement.major}
                            </div>
                            <div className="two fields">
                                Opiskelijanumero: {agreement.studentNumber + "\t"}|
                        Lähiosoite: {agreement.address}
                            </div>
                            <div className="two fields">
                                Sähköpostiosoite: {agreement.email + "\t"}|
                        Puhelinnumero: {agreement.phone}
                            </div>
                        </div>
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
                            Vastuuohjaaja: {agreement.responsibleSupervisorId}<br />

                            {/* These variable names do not exist in database. Other supervisors need 
                            to be selected from AgreementPerson-table */}
                            Muuohjaaja: {agreement.supervisorSecond}<br />
                            2. ohjaaja: {agreement.supervisorOther}<br />
                        </p>
                        <h4>Työskentelyn tavoitteet ja ajankäyttö</h4>
                        <p>
                            Viikoittainen työaika: {agreement.studentWorkTime}<br />
                            Ohjaajien varmaama ohjausaika: {agreement.supervisorWorkTime}<br />
                            Välitavoitteet: {agreement.intermediateGoal}<br />
                            Sopimus tapaamistiheydestä, yhteydenpitotavoista ja keskusteluun käytettävissä olevasta ajasta: {agreement.meetingAgreement}<br />
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

    changeShowing(e, agreement) {
        let index = this.props.agreementData.findIndex((x => x.agreementId === agreement.agreementId));
        this.props.agreementData.map((agr, i) => {
            if (agr === agreement) index = i
        });
        let newState = this.state;
        if (newState.showAgreements[index]) { //can't use x = !x since x is at first undefined
            newState.showAgreements[index] = false; //if is visible, hide
        } else {
            newState.showAgreements[index] = true;
        }
        this.setState({
            showAgreements: newState.showAgreements
        });
    }

    renderList() {
        var data = this.props.agreementData;
        return (
            <div>
                {data.map((agreement, index) =>
                    <div className="ui padded segment" key={agreement.agreementId}>
                        <h2 className="ui header">Opinnäytetyön otsikko (työnimi): {agreement.title}</h2>

                        <b>Ohjausvastuut: </b> <br />
                        Vastuuohjaaja: {agreement.thesisSupervisorMain}<br />
                        Muuohjaaja: {agreement.thesisSupervisorSecond}<br />
                        2. ohjaaja: {agreement.thesisSupervisorOther}<br />

                        {this.renderOne(agreement)}
                                                                                           
                        <button key={agreement.agreementId} className="ui primary button" onClick={(e) => this.changeShowing(e, agreement)}>Show/hide agreement information</button>
                    </div>
                )}
            </div>
        );
    }

    render() {
        if (this.props.agreementData.length > 0) return <div>{this.renderList()}</div>
        return (
            <div>{this.renderOne(this.props.agreementData)}</div>
        );
    }
}

export default AgreementView;
