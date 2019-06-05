import React, { Component } from 'react'
import { connect } from 'react-redux'
import { arrayOf, bool, func, object } from 'prop-types'
import { Button, TextArea } from 'semantic-ui-react'

import { oldGradeFields, gradeFields } from '../../../util/theses'
import { thesisType, programmeType, studyfieldType } from '../../../util/types'

class ThesisInformation extends Component {
    state = {
        oldGrading: true
    }

    componentWillReceiveProps(props) {
        const selectedProgrammeId = props.studyfields
            .find(studyfield => studyfield.programmeId === props.thesis.studyfieldId)

        if (selectedProgrammeId)
            props.thesis.programmeId = selectedProgrammeId.programmeId
    }

    changeField = fieldName => (event) => {
        const changedValues = { [fieldName]: event.target.value }
        if (fieldName === 'programmeId') {
            changedValues.studyfieldId = ''
            changedValues.majorId = ''
            changedValues.graders = []
        }
        if (fieldName === 'majorId') {
            changedValues.studyfieldId = ''
        }
        this.props.sendChange(changedValues)
    }

    toggleGrading = (e, data) => {
        if (this.state.oldGrading === data.value) return
        this.props.sendChange({
            programmeId: '',
            majorId: '',
            studyfieldId: '',
            grade: '',
            graders: []
        })
        this.setState({ oldGrading: data.value })
    }

    renderTextField(label, fieldName, placeholder, disabled, type = 'text') {
        const className = this.props.validationErrors[fieldName] ? 'field error' : 'field'
        const inputId = `${fieldName}-field`

        return (
            <div className={className}>
                <label htmlFor={inputId}>
                    {label}
                    <input
                        id={inputId}
                        type={type}
                        name={fieldName}
                        disabled={disabled ? 'true' : ''}
                        value={this.props.thesis[fieldName]}
                        onChange={this.changeField(fieldName)}
                        placeholder={placeholder}
                    />
                </label>
            </div>
        )
    }

    renderDropdownField(label, fieldArray, fieldName, disabled) {
        const className = this.props.validationErrors[fieldName] ? 'field error' : 'field'
        const inputId = `${fieldName}-field`

        return (
            <div className={className}>
                <label htmlFor={inputId}>
                    {label}
                    <select
                        id={inputId}
                        className="ui fluid search dropdown"
                        disabled={disabled ? 'true' : ''}
                        value={this.props.thesis[fieldName]}
                        onChange={this.changeField(fieldName)}
                    >
                        <option key="0" value="">Select {label}</option>
                        {fieldArray.map(field => (
                            <option key={field.id} value={field.id}>
                                {field.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        )
    }

    renderToggleUnitsAndGradingButton() {
        return (
            <div>
                <p><b>Is the thesis according to old (40 credits) or new (30 credits) grading?</b></p>
                <Button.Group id="unit_toggle">
                    <Button
                        color={this.state.oldGrading ? 'blue' : 'grey'}
                        onClick={this.toggleGrading}
                        disabled={!this.props.allowEdit}
                        value
                    >
                        40 credits
                    </Button>
                    <Button.Or />
                    <Button
                        color={this.state.oldGrading ? 'grey' : 'blue'}
                        onClick={this.toggleGrading}
                        disabled={!this.props.allowEdit}
                        value={false}
                    >
                        30 credits
                    </Button>
                </Button.Group>
            </div>
        )
    }

    renderThesisAuthor() {
        if (!this.props.thesis.authorFirstname) {
            return (
                <div className="three fields">
                    {this.renderTextField('Email', 'authorEmail', 'Email Address', false, 'email')}
                </div>
            )
        }

        return (
            <div className="three fields">
                {this.renderTextField('Email', 'authorEmail', 'Email Address', true, 'email')}
                {this.renderTextField('First name', 'authorFirstname', 'Email Address', true, 'email')}
                {this.renderTextField('Last name', 'authorLastname', 'Email Address', true, 'email')}
            </div>
        )
    }

    renderThesisInformation() {
        const programmes = this.props.programmes
            .filter(programme => (
                programme.name.includes('Department') === this.state.oldGrading
            ))
            .map(programme => ({
                id: programme.programmeId,
                name: programme.name
            }))

        const studyfields = this.props.studyfields
            .filter(studyfield => studyfield.programmeId === Number(this.props.thesis.programmeId))
            .map(studyfield => ({
                id: studyfield.studyfieldId,
                name: studyfield.name,
                major: studyfield.major
            }))

        const majors = studyfields.filter(field => field.major !== undefined)
            .map(field => ({
                id: field.major.majorId,
                name: field.major.majorName,
                studyfieldId: field.id
            }))

        const groupedMajors = { majors: [] }
        if (majors.length > 0) {
            for (let i = 0; i < majors.length; i += 1) {
                const major = majors[i]
                if (!groupedMajors[major.id]) {
                    groupedMajors.majors.push(major)
                    groupedMajors[major.id] = { id: major.id, name: major.name, studyfields: [major.studyfieldId] }
                } else {
                    groupedMajors[major.id].studyfields.push(major.studyfieldId)
                }
            }
        }

        const majorStudyfields = this.props.thesis.majorId && groupedMajors.majors.length > 0 ?
            studyfields.filter(studyfield =>
                groupedMajors[this.props.thesis.majorId].studyfields.includes(studyfield.id))
            : undefined


        return (
            <div className="ui form">
                <div className="two fields">
                    {this.renderTextField('Title', 'title', 'Title', !this.props.allowEdit)}
                    {this.renderTextField('Urkund-link', 'urkund', 'Link to Urkund', !this.props.allowEdit)}
                </div>
                <div className="one field">
                    {this.renderToggleUnitsAndGradingButton()}
                </div>
                <div className="four fields">
                    {this.renderDropdownField('Unit', programmes, 'programmeId', !this.props.allowEdit)}
                    <div className="field">
                        {groupedMajors.majors.length > 0 ?
                            this.renderDropdownField('Major', groupedMajors.majors, 'majorId', !this.props.allowEdit)
                            : undefined}
                    </div>
                    <div className="field">
                        {this.renderDropdownField('Studyfield', majorStudyfields !== undefined ?
                            majorStudyfields : studyfields, 'studyfieldId', !this.props.allowEdit)}
                    </div>
                    {this.state.oldGrading ?
                        this.renderDropdownField('Grade', oldGradeFields, 'grade', !this.props.allowEdit) :
                        this.renderDropdownField('Grade', gradeFields, 'grade', !this.props.allowEdit)
                    }

                </div>
                <div className="one field">
                    <label htmlFor="additionalInfo">
                        Additional info
                        <TextArea
                            id="additionalInfo"
                            value={this.props.thesis.additionalInfo}
                            onChange={this.changeField('additionalInfo')}
                            placeholder="e.g. gradun erikoiskurssi, kypsyysnäytteen kieli"
                        />
                    </label>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                <h3 className="ui dividing header">Thesis Author</h3>
                {this.renderThesisAuthor()}
                <h3 className="ui dividing header">Thesis Information</h3>
                {this.renderThesisInformation()}
            </div>
        )
    }
}

ThesisInformation.propTypes = {
    sendChange: func.isRequired,
    thesis: thesisType.isRequired,
    programmes: arrayOf(programmeType).isRequired,
    studyfields: arrayOf(studyfieldType).isRequired,
    allowEdit: bool.isRequired,
    validationErrors: object.isRequired
}

const mapStateToProps = ({ programmes, studyfields }) => {
    // const roles = user.roles || []
    return {
        programmes: programmes
            // .filter(programme => roles.find(role => programme.programmeId === role.programmeId))
            .filter(programme => !programme.name.includes('OLD')),
        studyfields
    }
}

export default connect(mapStateToProps)(ThesisInformation)