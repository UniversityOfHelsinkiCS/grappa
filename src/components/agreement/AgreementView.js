import React, { Component } from 'react';

class AgreementView extends Component {
    render() {
        var data = this.props.agreementData;
        return (
            <div className="ui padded segment">
                <h2 className="ui header">{ data.thesisTitle }</h2>
                <h4>Gradun tekijän tiedot</h4>
                <div>
                    <div className="two fields">
                        Gradun tekijän nimi: { data.studentFirstName + " " + data.studentLastName + "\t"}|
                        Pääaine: { data.studentMajor }
                    </div>
                    <div className="two fields">
                        Opiskelijanumero: { data.studentNumber + "\t"}|
                        Lähiosoite: { data.studentAddress }
                    </div>
                    <div className="two fields">
                        Sähköpostiosoite: { data.studentEmail + "\t"}|
                        Puhelinnumero: { data.studentPhone }
                    </div>
                </div>
                <h4>Opinnäytetyön tiedot</h4>
                <p>
                    Aloitusajankohta: { data.thesisStartDate }<br/>
                    Arvioitu valmistumisajankohta: { data.thesisCompletionEta }<br/>
                    Suorituspaikka: { data.thesisPerformancePlace }<br/>
                </p>
                <h4>Ohjausvastuut</h4>
                <p>
                    Vastuuohjaaja: { data.thesisSupervisorMain }<br/>
                    Muuohjaaja: { data.thesisSupervisorSecond }<br/>
                    2. ohjaaja: { data.thesisSupervisorOther }<br/>
                </p>
                <h4>Työskentelyn tavoitteet ja ajankäyttö</h4>
                <p>
                    Viikoittainen työaika: { data.thesisWorkStudentTime }<br/>
                    Ohjaajien varmaama ohjausaika: { data.thesisWorkSupervisorTime }<br/>
                    Välitavoitteet: { data.thesisWorkIntermediateGoal }<br/>
                    Sopimus tapaamistiheydestä, yhteydenpitotavoista ja keskusteluun käytettävissä olevasta ajasta: { data.thesisWorkMeetingAgreement }<br/>
                    Tavoitearvosana: { data.studentGradeGoal }
                </p>
                <p>
                    Muuta: { data.thesisWorkOther }
                </p>
            </div>
        );
    }
}

export default AgreementView;
