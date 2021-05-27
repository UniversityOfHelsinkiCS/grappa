import React, { Component } from 'react'
import { connect } from 'react-redux'
import { arrayOf, bool, func, object } from 'prop-types'
import { TextArea } from 'semantic-ui-react'

import { gradeFields } from '../../../util/theses'
import { thesisType, programmeType, studyfieldType } from '../../../util/types'

class ThesisInformation extends Component {

    componentDidMount() {
        const defaults = {}
        const filteredProgrammes = this.props.programmes.filter(programme => !programme.name.includes('Department'))
        if (filteredProgrammes.length === 1 && !this.props.thesis.programmeId)
            defaults.programmeId = filteredProgrammes[0].programmeId.toString()

        if (!defaults.programmeId)
            return this.props.sendChange({ ...defaults }, false)

        const studyfieldId = this.getDefaultStudyTrack(defaults.programmeId) || ''
        return this.props.sendChange({ ...defaults, studyfieldId }, false)
    }

    componentWillReceiveProps(props) {
        const selectedProgrammeId = props.studyfields
            .find(studyfield => studyfield.programmeId === props.thesis.studyfieldId)

        if (selectedProgrammeId)
            props.thesis.programmeId = selectedProgrammeId.programmeId
    }

    getDefaultStudyTrack(programmeId) {
        if (!programmeId) return null
        const filteredStudyTracks = this.props.studyfields
            .filter(studyfield => studyfield.programmeId === Number(programmeId))
        return filteredStudyTracks.length === 1
            ? filteredStudyTracks[0].studyfieldId.toString()
            : null
    }

    changeField = fieldName => (event) => {
        const changedValues = { [fieldName]: event.target.value }
        if (fieldName === 'programmeId') {
            const defaultStudyfieldId = this.getDefaultStudyTrack(changedValues.programmeId)
            changedValues.studyfieldId = defaultStudyfieldId || ''
            changedValues.majorId = ''
            changedValues.graders = []
        }
        if (fieldName === 'majorId') {
            const studyFields = this.props.studyfields
                .filter(studyfield => studyfield.programmeId === Number(this.props.thesis.programmeId))
                .filter(field => field.majorId === Number(changedValues.majorId))
            changedValues.studyfieldId = studyFields.length === 1 ? studyFields[0].studyfieldId : ''
        }
        this.props.sendChange(changedValues)
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
            .filter(programme => !programme.name.includes('Department'))
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
                    {this.renderDropdownField('Grade', gradeFields, 'grade', !this.props.allowEdit)}

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

const mapStateToProps = ({ programmes, studyfields, user }) => {
    const roles = user.roles || []
    return {
        programmes: programmes
            .filter(programme => roles.find(role => programme.programmeId === role.programmeId))
            .filter(programme => !programme.name.includes('OLD')),
        studyfields
    }
}

export default connect(mapStateToProps)(ThesisInformation)
