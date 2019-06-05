import React, { Component } from 'react'
import { arrayOf, func } from 'prop-types'
import { connect } from 'react-redux'
import { Dropdown, Header, Loader } from 'semantic-ui-react'

import { saveThesis } from './services/thesisActions'
import { requestGraderAction, getGradersAction } from '../Person/services/personActions'
import { programmeType, councilmeetingType } from '../../util/types'

import ThesisConfirmModal from './components/ThesisConfirmModal'
import ThesisInformation from './components/ThesisInformation'
import AttachmentAdder from '../Attachment/components/AttachmentAdder'
import ThesisCouncilMeetingPicker from './components/ThesisCouncilmeetingPicker'
import { emptyThesisData, thesisValidation } from '../../util/theses'
import LoadingIndicator from '../LoadingIndicator'
import AddPerson from '../Person/components/AddPerson'

export class ThesisCreatePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            thesis: emptyThesisData,
            attachments: [],
            showModal: false,
            validationErrors: {},
            validationString: '',
            graders: []
        }
    }

    handleSaveThesis = () => {
        const form = new FormData()
        this.state.attachments.forEach((attachment) => {
            const label = attachment.label ? attachment.label : 'otherFile'
            form.append(label, attachment)
        })
        const thesis = Object.assign({}, this.state.thesis)
        delete thesis.programmeId
        thesis.graders = thesis.graders.map(person => person.personId)
        form.append('json', JSON.stringify(thesis))
        this.setState({ showModal: !this.state.showModal }, this.props.saveThesis(form))
    }

    validateAttachments = attachments => attachments.find(attachment => attachment.label === 'thesisFile')
        && attachments.find(attachment => attachment.label === 'reviewFile')

    toggleModal = () => {
        this.validateThesis()
            .then(() => {
                if (this.validateAttachments(this.state.attachments)) {
                    this.setState({ showModal: !this.state.showModal })
                } else {
                    this.setState({ invalidAttachments: true })
                }
            })
            .catch(res => this.setState({ validationErrors: res.errors }))
    }

    handleChange = (changedValues) => {
        const thesis = Object.assign({}, this.state.thesis, changedValues)

        this.setState({ thesis })
        if (changedValues.programmeId) {
            getGradersAction(changedValues.programmeId).then((res) => {
                this.setState({ graders: res.data })
            })
        }
        this.validateThesis(thesis)
            .then(() => this.setState({ validationErrors: {} }))
            .catch((res) => {
                const validationErrors = res.errors
                let readableError = ''
                if (validationErrors.authorEmail) readableError = 'Author email is required'
                else if (validationErrors.title) readableError = 'Title is required'
                else if (validationErrors.urkund) readableError = 'Urkund link must be given'
                else if (validationErrors.programmeId) readableError = 'Programme must be chosen'
                else if (validationErrors.studyfieldId) readableError = 'Studyfield must be chosen'
                else if (validationErrors.grade) readableError = 'Grade is required'
                else if (validationErrors.graders) readableError = 'There must be 2 graders'
                else if (!this.validateAttachments(this.state.attachments)) {
                    readableError = 'Make sure you have uploaded the thesis and the review'
                }
                this.setState({ validationErrors, validationString: readableError })
            })
    }

    editAttachmentList = (attachments) => {
        this.setState({ attachments })
    }

    validateThesis(thesis = this.state.thesis) {
        return thesisValidation.run(thesis)
    }

    addNewGrader = (data) => {
        const { firstname, lastname, email } = data
        const programmeId = data.programmes[0]
        const role = 'grader'
        const person = { firstname, lastname, email }
        const roleRequest = { programmeId, role }
        requestGraderAction({ person, roleRequest }).then((res) => {
            const { allGraders } = res.data
            const selected = allGraders.filter(grader => grader.person.email === email)
            const { graders } = this.state.thesis
            graders.push(...selected)
            this.setState({ graders: allGraders })
            this.handleChange({ graders })
        })
    }

    changeGraders = (e, data) => {
        const graders = this.state.graders.filter(grader => data.value.includes(grader.personId))
        this.handleChange({ graders })
    }

    renderGraderSelector = () => {
        const graders = this.state.graders.map((grader) => {
            const { personId, firstname, lastname, email } = grader.person
            const obj = {
                key: personId,
                value: personId,
                text: `${firstname} ${lastname} ${email}`
            }
            if (grader.roleRequestId) {
                obj.label = { color: 'red', empty: true, circular: true }
                obj.text = `${obj.text}  -  NOT YET CONFIRMED GRADER`
            }
            return obj
        })
        return (<Dropdown
            placeholder="Select graders"
            fluid
            multiple
            search
            selection
            options={graders}
            onChange={this.changeGraders}
            value={this.state.thesis.graders.map(grader => grader.personId)}
        />)
    }

    render() {
        if (!this.props.programmes.length || !this.props.councilmeetings.length) {
            return (<div><Loader active>Loading</Loader></div>)
        }
        const programme = this.props.programmes.find(p => p.programmeId === parseInt(this.state.thesis.programmeId, 10))
        const councilmeeting = this.props.councilmeetings.find(c =>
            c.councilmeetingId === Number(this.state.thesis.councilmeetingId))
        const meetingProgramme = councilmeeting ?
            this.props.programmes.find(p => p.programmeId === councilmeeting.programmes[0]) : undefined
        return (
            <div>
                <LoadingIndicator type="THESIS_SAVE" redirect="/" />
                <ThesisConfirmModal
                    sendSaveThesis={this.handleSaveThesis}
                    closeModal={this.toggleModal}
                    showModal={this.state.showModal}
                    thesis={this.state.thesis}
                    councilmeeting={councilmeeting}
                    meetingProgramme={meetingProgramme}
                    programme={programme}
                />
                <div className="ui form">
                    <ThesisInformation
                        sendChange={this.handleChange}
                        allowEdit
                        thesis={this.state.thesis}
                        validationErrors={this.state.validationErrors}
                    />
                    <Header as="h3" dividing>Graders of the thesis</Header>
                    {this.renderGraderSelector()}
                    {programme ?
                        <div>
                            <p>If a grader is not on the list, you can submit a request below to add him/her
                                and they should then appear in the list.
                            </p>
                            <AddPerson programmes={[programme]} roles={['grader']} addNewPerson={this.addNewGrader} />
                        </div> : null}
                    <Header as="h3" style={this.state.invalidAttachments ? { color: 'red' } : null} dividing>
                        Upload thesis and review file
                        <Header.Subheader>
                            You can add additional files as well. All need to be in pdf format.
                        </Header.Subheader>
                    </Header>
                    <AttachmentAdder
                        attachments={this.state.attachments}
                        changeList={this.editAttachmentList}
                    />
                    <br />
                    <ThesisCouncilMeetingPicker
                        sendChange={this.handleChange}
                        councilmeetingId={this.state.thesis.councilmeetingId}
                        programmeId={Number(this.state.thesis.programmeId)}
                    />
                </div>
                <br />
                <div>
                    {this.state.validationString}
                </div>
                <button
                    disabled={Object.keys(this.state.validationErrors).length}
                    className="ui positive button"
                    onClick={this.toggleModal}
                >
                    Submit
                </button>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    saveThesis(thesis) {
        dispatch(saveThesis(thesis))
    }
})

const mapStateToProps = ({ councilmeetings, programmes, studyfields }) => ({
    councilmeetings,
    programmes,
    studyfields
})

ThesisCreatePage.propTypes = {
    councilmeetings: arrayOf(councilmeetingType).isRequired,
    programmes: arrayOf(programmeType).isRequired,
    saveThesis: func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ThesisCreatePage)
