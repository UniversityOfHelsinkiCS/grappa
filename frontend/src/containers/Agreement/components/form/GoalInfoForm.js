import React, { Component } from 'react'
import { func, object } from 'prop-types'

export default class GoalInfoForm extends Component {
    constructor() {
        super()
        this.state = {
            old: false
        }
    }

    field = (label, formName) => (
        <div>
            <br />
            <b>{label}</b>
            <div className="ui fluid input">
                <input type="text" name={formName} onChange={this.props.handleChange} />
                {(Object.keys(this.props.requiredFields).includes(formName) && !this.props.requiredFields[formName]) ?
                    (
                        <div className="ui left pointing red basic label">
                            Täytä tiedot
                        </div>
                    ) : ''}
            </div>
        </div>
    )

    grades = (old) => {
        if (old) {
            return [
                { value: -1, text: 'Choose a grade' },
                { value: 'L', text: 'Laudatur' },
                { value: 'E', text: 'Eximia cum laude approbatur' },
                { value: 'M', text: 'Magna cum laude approbatur' },
                { value: 'C', text: 'Cum laude approbatur' },
                { value: 'B', text: 'Lubenter approbatur' },
                { value: 'A', text: 'Approbatur' }
            ]
        }
        return [
            { value: -1, text: 'Choose a grade' },
            { value: '5', text: '5 (Excellent)' },
            { value: '4', text: '4 (Very Good)' },
            { value: '3', text: '3 (Good)' },
            { value: '2', text: '2 (Satisfactory)' },
            { value: '1', text: '1 (Passable)' }
        ]
    }

    render() {
        return (
            <div>
                <h1>Työskentelyn tavoitteet ja ajankäyttö</h1>
                {this.field('Opiskelijan arvioima opinnäytetyöhön käytettävä työaika', 'thesisWorkStudentTime')}
                {this.field('Ohjaajien ohjaukseen varaama aika (työn eri vaiheissa)', 'thesisWorkSupervisorTime')}
                {this.field('Välitavoitteet (deadlinet työn eri vaiheille)', 'thesisWorkIntermediateGoal')}
                {this.field('Sopimus tapaamistiheydestä, yhteydenpitotavoista ja keskusteluun käytettävissä ' +
                    'olevasta ajasta', 'thesisWorkMeetingAgreement')}
                {this.field('Muuta', 'thesisWorkOther')}

                <h1>Tavoitearvosana</h1>
                <br />
                <p>
                    <b>
                        Opiskelija on tutustunut laitoksen opinnäytetyön arviointimatriisiin ja
                        määrittää tavoitearvosanakseen:
                    </b>
                </p>
                <div>
                    <select className="ui dropdown" onChange={this.props.handleChange} name="studentGradeGoal" >
                        {this.grades(this.state.old).map(grade =>
                            <option key={grade.value} value={grade.value}>{grade.text}</option>
                        )}
                    </select>
                    {(Object.keys(this.props.requiredFields).includes('studentGradeGoal')
                        && !this.props.requiredFields.studentGradeGoal) ?
                        (
                            <div className="ui left pointing red basic label">
                                Valitse tavoitearvosana
                            </div>) : ''}
                    <button
                        className="ui button"
                        onClick={() => this.setState({ old: !this.state.old })}
                        style={{ marginLeft: '1em' }}
                    >
                        Vaihda arvosana-asteikko
                    </button>
                </div>
            </div>
        )
    }
}

GoalInfoForm.propTypes = {
    handleChange: func.isRequired,
    requiredFields: object.isRequired
}
