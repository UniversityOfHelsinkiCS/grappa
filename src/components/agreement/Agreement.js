import React, { Component } from 'react';

import EventMessage from '../EventMessage';
import FormCreator from '../form/FormCreator'

export default class Agreement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sent: false,
            lengthBefore: props.agreement.length,
            completionEta: "",
            supervision: "",
            misc: "",
            form: {
                studentName: "",
                studentNumber: "",
                studentAddress: "",
                studentPhone: "",
                studentEmail: "",
                studentMajor: "",

                thesisTitle: "",
                thesisStartDate: "",
                thesisCompletionEta: "",
                thesisPerformancePlace: "",

                thesisSupervisorMain: "",
                thesisSupervisorOther: "",

                thesisWorkStudentTime: "",
                thesisWorkSupervisorTime: "",
                thesisWorkIntermediateGoal: "",
                thesisWorkMeetingAgreement: "",
                thesisWorkOther: "",

                studentGradeGoal: "",
            }
        }
    }

    getResponseMessage = () => {
        if (this.props.agreement.length > this.state.lengthBefore && this.state.sent) {
            return <EventMessage type='success' message='Tiedot tallennettiin onnistuneesti' />;
        } else if (this.state.sent) {
            return <EventMessage type='error' message='Ilmestyi ongelmia' />;
        }
        return undefined;
    }

    handleFormChange = (event) => {
        const oldForm = this.state.form;
        let newForm = oldForm;
        newForm[event.target.name] = event.target.value;
        this.setState({ form: newForm })
    }

    sendForm = (event) => {
        if (event !== undefined)
            event.preventDefault();
        this.props.saveAgreement(this.state.form);
        this.setState({ sent: true });
    }

    formFieldInfo = {
        sections:
        [{
            header: "Opinnäytetyön tekijä",
            fields: [
                { inputType: "input", name: "studentName", label: "Nimi", extraClassNames: "nine wide", required: true, placeholder: "Etu- ja Sukunimi" },
                { inputType: "input", name: "studentNumber", label: "Opiskelijanumero", extraClassNames: "nine wide", required: true, placeholder: "XXXXXXX" },
                { inputType: "input", name: "studentAddress", label: "Lähiosoite", extraClassNames: "nine wide", required: true, placeholder: "Peräpolku 2 C 45, Nuppulinna" },
                { inputType: "input", name: "studentPhone", label: "Puhelinnumero", extraClassNames: "nine wide", required: true, placeholder: "000 000 00 00" },
                { inputType: "input", name: "studentEmail", label: "Sähköpostiosoite", extraClassNames: "nine wide", required: true, placeholder: "nimi@domain.com" },
                { inputType: "input", name: "studentMajor", label: "Pääaine", extraClassNames: "nine wide", required: true, placeholder: "(jos muu kuin TKTL)" },
            ]
        },
        {
            header: "Opinnäytetyö",
            fields: [
                { inputType: "textarea", rows: 2, name: "thesisTitle", label: "Opinnäytetyön otsikko (työnimi) tekokielellä", extraClassNames: "fluid", required: true, placeholder: "Opinnäytetyön otsikko (työnimi) tekokielellä" },
                { inputType: "input", name: "thesisStartDate", label: "Aloitusajankohta", extraClassNames: "", required: true, placeholder: "" },
                { inputType: "input", name: "thesisCompletionEta", label: "Arvioitu valmistumisajankohta", extraClassNames: "", required: true, placeholder: "" },
                { inputType: "textarea", rows: 2, name: "thesisPerformancePlace", label: "Suorituspaikka", extraClassNames: "fluid ", required: true, placeholder: "(projekti, työnantaja, tms.) ja yhteystiedot" },
            ]
        },
        {
            header: "Ohjausvastuut",
            fields: [
                { inputType: "input", name: "thesisSupervisorMain", label: "Vastuuohjaaja", extraClassNames: "nine wide fluid", required: true, placeholder: "(nimi, oppiarvo ja/tai tehtävänimike, organisaatio, yhteystiedot)" },
                { inputType: "input", name: "thesisSupervisorOther", label: "Muu ohjaaja", extraClassNames: "nine wide fluid", required: true, placeholder: "(nimi, oppiarvo ja/tai tehtävänimike, organisaatio, yhteystiedot)" },
            ]
        },
        {
            header: "Työskentelyn tavoitteet ja ajankäyttö",
            fields: [
                { inputType: "textarea", rows: 1, name: "thesisWorkStudentTime", label: "Opiskelijan arvioima opinnäytetyöhön käytettävä työaika", extraClassNames: "fluid", required: true, placeholder: "(esim. tuntia / vko)" },
                { inputType: "textarea", rows: 2, name: "thesisWorkSupervisorTime", label: "Ohjaajien ohjaukseen varaama aika (työn eri vaiheissa)", extraClassNames: "fluid", required: true, placeholder: "" },
                { inputType: "textarea", rows: 2, name: "thesisWorkIntermediateGoal", label: "Välitavoitteet (deadlinet työn eri vaiheille)", extraClassNames: "fluid", required: true, placeholder: "" },
                { inputType: "textarea", rows: 2, name: "thesisWorkMeetingAgreement", label: "Sopimus tapaamistiheydestä, yhteydenpitotavoista ja keskusteluun käytettävissä olevasta ajasta", extraClassNames: "fluid", required: true, placeholder: "" },
                { inputType: "textarea", rows: 2, name: "thesisWorkOther", label: "Muuta", extraClassNames: "fluid", required: false, placeholder: "(esim. opiskelijan odotukset ohjaajalle / ohjaajan odotukset opiskelijalle" },
            ]
        },
        {
            header: "Tavoitearvosana",
            fields: [
                {
                    inputType: "dropdown", name: "studentGradeGoal", label: "Opiskelija on tutustunut laitoksen opinnäytetyön arviointimatriisiin ja määrittää tavoitearvosanakseen:", extraClassNames: "nine wide", required: true,
                    responses: [
                        { value: 0, text: 'Choose...' },
                        { value: 5, text: '5 (Excellent)' },
                        { value: 4, text: '4 (Very Good)' },
                        { value: 3, text: '3 (Good)' },
                        { value: 2, text: '2 (Satisfactory)' },
                        { value: 1, text: '1 (Passable)' },
                    ]
                },
            ]
        }]
    }

    /* SAVE FROM OLD BRANCH - AGREEMENT WIZARD BAR
    getWizardLine() {
        return (<div className="ui mini steps">
            <a className={"step " + (this.state.formSteps == 0 ? 'active' : (this.state.formSteps > 0 ? 'completed' : ''))} onClick={() => this.wizardOnClick(0)}>
                <i className="small address card outline icon"></i>
                <div className="content">
                    <div className="title">Personal Info</div>
                </div>
            </a>
            <a className={"step " + (this.state.formSteps == 1 ? 'active' : (this.state.formSteps > 1 ? 'completed' : ''))} onClick={() => this.wizardOnClick(1)}>
                <i className="small file text outline icon"></i>
                <div className="content">
                    <div className="title">Thesis</div>
                </div>
            </a>
            <a className={"step " + (this.state.formSteps == 2 ? 'active' : (this.state.formSteps > 2 ? 'completed' : ''))} onClick={() => this.wizardOnClick(2)}>
                <i className="small user icon"></i>
                <div className="content">
                    <div className="title">Supervisor</div>
                </div>
            </a>
            <a className={"step " + (this.state.formSteps == 3 ? 'active' : (this.state.formSteps > 3 ? 'completed' : ''))} onClick={() => this.wizardOnClick(3)}>
                <i className="small edit outline icon"></i>
                <div className="content">
                    <div className="title">Agreement</div>
                </div>
            </a>
            <a className={"step " + (this.state.formSteps == 4 ? 'active' : (this.state.formSteps > 4 ? 'completed' : ''))} onClick={() => this.wizardOnClick(4)}>
                <i className="small comments outline icon"></i>
                <div className="content">
                    <div className="title">Other</div>
                </div>
            </a>
            <a className={"step " + (this.state.formSteps == 5 ? 'active' : (this.state.formSteps > 5 ? 'completed' : ''))} onClick={() => this.wizardOnClick(5)}>
                <i className="small info icon"></i>
                <div className="content">
                    <div className="title">Confirm</div>

                </div>
            </a>
        </div>);
    }
    */

    render() {
        return (
            <div>
                <h2>Gradusopimus tehdään gradunohjauksen alkaessa</h2>
                <p>Sopimusta voidaan muuttaa osapuolten yhteisestä päätöksestä.</p>

                <FormCreator
                    formFieldInfo={this.formFieldInfo}
                    onSubmitFunc={(e) => { if (e !== undefined) { e.preventDefault(); } }}
                    buttonOnClickFunc={this.sendForm}
                    accessToStore={this.props.agreement}
                    fieldOnChangeFunc={this.handleFormChange} />
                {this.getResponseMessage()}
                <br />
            </div>

        );
    }
}
