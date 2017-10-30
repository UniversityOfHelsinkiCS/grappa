import React, { Component } from 'react';

//redux
import { connect, subscribe } from "react-redux";
import { saveAgreement } from "./AgreementActions";

import EventMessage from '../EventMessage';
import NavBar from '../NavBar';
import FormCreator from '../form/FormCreator'


export class Agreement extends Component {
    constructor() {
        super();
        this.state = {
            serverResponseReceived: "",
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

    componentDidMount() {
        document.title = "Agreement page";
        //this.prefillFormInfo();
        //dispatch action to get info for agreement
    }

    getLastAgreementAction() {
        const forReturn = this.props.agreement[this.props.agreement.length - 1];

        return (forReturn === undefined ? {} : forReturn);
    }

    getResponseMessage = () => {
        const lastAction = this.getLastAgreementAction();

        if (lastAction === undefined) { return '' }
        else {
            if (lastAction.id === 'AGREEMENT_SAVE_SUCCESS') {
                return <EventMessage type='success' message='Tiedot tallennettiin onnistuneesti' />;
            }
            else if (lastAction.id === 'AGREEMENT_SAVE_FAILURE') {
                return <EventMessage type='error' message='Ilmestyi ongelmia' />;
            }
            else {
                return '';
            }
        }
    }

    handleFormChange = (event) => {
        //console.log("handler called " + event.target.name + " " + event.target.value);
        const oldForm = this.state.form;
        let newForm = oldForm;
        newForm[event.target.name] = event.target.value;
        this.setState({ form: newForm })
    }

    sendForm = (event) => {
        this.setState({ serverResponseReceived: "" });

        if (event !== undefined)
            event.preventDefault();

        //THIS IS HOW IT SHOULD WORK
        //this.props.saveAgreement(this.state.form);

        //GUM-FIX
        const gumFixReturn = {
            authorId: 1,
            thesisId: 2,
            responsibleSupervisorId: this.state.form.thesisSupervisorMain,
            studyFieldId: 1,
            fake: true,
            studentGradeGoal: this.state.form.studentGradeGoal
        }
        this.props.saveAgreement(gumFixReturn);
    }

    formFieldInfo =  {
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
                { inputType: "dropdown", name: "studentGradeGoal", label: "Opiskelija on tutustunut laitoksen opinnäytetyön arviointimatriisiin ja määrittää tavoitearvosanakseen:", extraClassNames: "nine wide", required: true, 
                    responses: [
                        {value: 0, text: 'Choose...'},
                        {value: 5, text: '5 (Excellent)'},
                        {value: 4, text: '4 (Very Good)'},
                        {value: 3, text: '3 (Good)'},
                        {value: 2, text: '2 (Satisfactory)'},
                        {value: 1, text: '1 (Passable)'},
                    ]
                },
            ]
        }]
    }


    render() {
        return (
            <div className="App">
                <div className="ui inverted segment">
                    <h2>Thesis Agreement</h2>
                </div>
                <NavBar active={"Agreement"} />
                
                <div className="ui left aligned container">

                    <h2>Gradusopimus tehdään gradunohjauksen alkaessa</h2>
                    <p>Sopimusta voidaan muuttaa osapuolten yhteisestä päätöksestä.</p>

                    <FormCreator 
                        formFieldInfo={this.formFieldInfo}
                        onSubmitFunc={(e)=>{if (e !== undefined){e.preventDefault();}}} 
                        buttonOnClickFunc={this.sendForm} 
                        accessToStore={this.props.agreement}
                        fieldOnChangeFunc={this.handleFormChange} />
                        {this.getResponseMessage()}
                    <br />
                </div>
            </div>

        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    saveAgreement(data) {
        dispatch(saveAgreement(data));
    },
});

const mapStateToProps = (state) => {
    return { agreement: state.agreement };
}

export default connect(mapStateToProps, mapDispatchToProps)(Agreement);
