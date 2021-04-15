import React, { Component } from 'react'
import { bool, func } from 'prop-types'
import { connect } from 'react-redux'
import AgreementEditModalField from './AgreementEditModalField'
import { getPermissions } from '../../../util/rolePermissions'

export class AgreementEditModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editedFormData: {},
            editableFields: [],
            ignoredFields: ['agreementId', 'created_at', 'updated_at'],
            textFields: [
                'thesisWorkStudentTime',
                'thesisWorkSupervisorTime',
                'thesisWorkIntermediateGoal',
                'thesisWorkMeetingAgreement',
                'thesisWorkOther'
            ],
            mandatoryDataFilled: true
        }
    }

    componentWillReceiveProps(props) {
        const original = Object.assign({}, props.formData) // can't use pointer here
        if (props.role) {
            this.setState(
                {
                    editedFormData: original,
                    editableFields: getPermissions(props.role, 'agreement', 'edit')
                }
            )
        } else {
            this.setState(
                {
                    editedFormData: original,
                    editableFields: [
                        'studentAddress',
                        'studentEmail',
                        'studentGradeGoal',
                        'studentAddress',
                        'studentName',
                        'studentPhone',
                        'thesisCompletionEta',
                        'thesisSupervisorSecond',
                        'thesisSupervisorOther',
                        'thesisTitle'
                    ]
                }
            )
        }
    }

    onFieldChange = (fieldName, value) => {
        const newEditedFormData = this.state.editedFormData
        newEditedFormData[fieldName] = value
        this.setState(
            {
                editedFormData: newEditedFormData
            }
        )
        this.validateData()
    }

    validateData = () => {
        const hasEmptyField = Object.keys(this.state.editedFormData)
            .filter(key => this.state.editableFields.indexOf(key) !== -1)
            .map(key => this.state.editedFormData[key])
            .some(field => (field === ''))
        this.setState({ mandatoryDataFilled: !hasEmptyField })
    }

    generateFormFields = () => {
        const elements = this.parseAgreementData(this.state.editedFormData).map(element =>
            this.createFormField(element)
        )
        return (
            <div>
                <form>
                    <div className="ui form">{elements}</div>
                </form>
            </div>
        )
    }

    parseAgreementData = (data) => {
        const parsedList = []
        for (const p in data) {
            const originalData = this.props.originalAgreement
            if (data.hasOwnProperty(p)
                && (this.state.ignoredFields.indexOf(p) === -1)
                && (this.state.editableFields.indexOf(p) > -1)) {
                parsedList.push({
                    fieldName: p,
                    content: data[p],
                    originalContent: originalData[p],
                    textField: (this.state.textFields.indexOf(p) > -1)
                })
            }
        }
        return parsedList
    }

    createFormField = c => (
        <AgreementEditModalField
            key={c.fieldName}
            fieldName={c.fieldName}
            content={c.content}
            originalContent={c.originalContent}
            textField={c.textField}
            onChange={this.onFieldChange}
        />
    )

    handleFormSave = () => {
        this.props.updateFormData(this.state.editedFormData)
        this.props.closeModal()
    }

    render() {
        if (!this.props.showModal) {
            return (<div />)
        }
        return (
            <div>
                <div className="ui dimmer modals page transition visible active" onClick={this.props.closeModal} />
                <div className="ui active modal" style={{ top: 45, border: '2px solid black', borderRadius: '7px' }}>
                    <i className="close icon" onClick={this.props.closeModal} />
                    <div className="header">
                        Edit agreement
                    </div>
                    <div className="scrolling content">
                        <div className="description">
                            {this.generateFormFields()}
                        </div>
                    </div>
                    <br />
                    <button
                        className="ui fluid positive button"
                        disabled={!this.state.mandatoryDataFilled}
                        onClick={this.handleFormSave}
                    >
                        {(!this.state.mandatoryDataFilled) ? 'Kaikkia tietoja ei ole täytetty' : 'Save local changes'}
                    </button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    roles: state.user.roles
})

AgreementEditModal.propTypes = {
    closeModal: func.isRequired,
    updateFormData: func.isRequired,
    showModal: bool.isRequired
}

export default connect(mapStateToProps)(AgreementEditModal)
