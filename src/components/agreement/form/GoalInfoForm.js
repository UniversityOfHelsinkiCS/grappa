import React, { Component } from 'react';

export default class GoalInfoForm extends Component {

    constructor() {
        super();
        this.state = {
            old: false,
        }
    }

    field = (label, formName) => {
        return (
            <div>
                <br />
                <b>{label}</b>
                <div className="ui fluid input">
                    <input type="text" name={formName} onChange={this.props.handleChange} />
                </div>
            </div>
        )
    }

    grades = (old) => {
        if (old) {
            return [
                { value: -1, text: 'Choose a grade' },
                { value: "L", text: 'Laudatur' },
                { value: "E", text: 'Eximia cum laude approbatur' },
                { value: "M", text: 'Magna cum laude approbatur' },
                { value: "C", text: 'Cum laude approbatur' },
                { value: "B", text: 'Lubenter approbatur' },
                { value: "A", text: 'Approbatur' }
            ]
        }
        return [
            { value: -1, text: 'Choose a grade' },
            { value: 5, text: '5 (Excellent)' },
            { value: 4, text: '4 (Very Good)' },
            { value: 3, text: '3 (Good)' },
            { value: 2, text: '2 (Satisfactory)' },
            { value: 1, text: '1 (Passable)' }
        ]
    }

    render() {
        return (
            <div>
                <h1>Työskentelyn tavoitteet ja ajankäyttö</h1>
                {this.field("Opiskelijan arvioima opinnäytetyöhön käytettävä työaika", "thesisWorkStudentTime")}
                {this.field("Ohjaajien ohjaukseen varaama aika (työn eri vaiheissa)", "thesisWorkSupervisorTime")}
                {this.field("Välitavoitteet (deadlinet työn eri vaiheille)", "thesisWorkIntermediateGoal")}
                {this.field("Sopimus tapaamistiheydestä, yhteydenpitotavoista ja keskusteluun käytettävissä olevasta ajasta", "thesisWorkMeetingAgreement")}
                {this.field("Muuta", "thesisWorkOther")}

                <h1>Tavoitearvosana</h1>
                <button className="ui mini button" onClick={() => this.setState({ old: !this.state.old })}>
                    Vaihda arvosana-asteikko
                </button>
                <br />
                <div>
                    <b>
                        Opiskelija on tutustunut laitoksen opinnäytetyön arviointimatriisiin ja määrittää tavoitearvosanakseen:
                    </b>
                </div>
                <div>
                    <select className="ui dropdown" onChange={this.props.handleChange} name="studentGradeGoal" >
                        {this.grades(this.state.old).map((grade, index) => {
                            return <option key={index} value={grade.value}>{grade.text}</option>;
                        })}
                    </select>
                </div>

            </div>
        )
    }
}