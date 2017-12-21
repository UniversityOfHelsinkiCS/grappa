import React, { Component } from 'react';


class AgreementView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAgreements: [],
        }
    }

    renderOne(agreement) {
        let index = this.props.agreementData.findIndex(x => x.agreementId === agreement.agreementId);
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
                                Gradun ala: {agreement.studyfieldName}
                            </div>
                            <div className="two fields">
                                Opiskelijanumero: {agreement.studentNumber + "\t"}|
                        Lähiosoite: {agreement.address}
                            </div>
                            <div className="two fields">
                                Sähköpostiosoite: {agreement.email + "\t"}|
                        Puhelinnumero: {agreement.phone}
                            </div>
                        </div>*/}

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

    handleEdit= (e, agreement) => {
        this.props.handleEditAgreement(agreement);

    }

    renderList() {
        var data = this.props.agreementData;
        return (
            <div>
                {data.map((agreement, index) =>
                    <div className="ui padded segment" key={agreement.agreementId}>
                        <h2 className="ui header">Opinnäytetyön otsikko (työnimi): {agreement.thesisTitle}</h2>                        
                        <b>Ohjausvastuut: </b> <br />
                        Vastuuohjaaja: {agreement.title} {agreement.firstname} {agreement.lastname}<br />
                        Muuohjaaja: to be shown here<br />
                        2. ohjaaja: to be shown here<br />
                        <button key={agreement.agreementId} className="ui primary button" onClick={(e) => this.changeShowing(e, agreement)}>Show/hide agreement information</button>
                        <button className="ui primary button" onClick={(e) => this.handleEdit(e, agreement)}>Edit agreement</button>                    
                        {this.renderOne(agreement)}
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
