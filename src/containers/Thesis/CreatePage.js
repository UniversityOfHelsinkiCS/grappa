import React, { Component } from 'react'
import { arrayOf, func } from 'prop-types'
import { connect } from 'react-redux'
import { Dropdown, Message } from 'semantic-ui-react'
import moment from 'moment'

import { saveThesis } from './services/thesisActions'
import { requestGraderAction, getGradersAction } from '../Person/services/personActions'
import { personType, programmeType, studyfieldType, councilmeetingType } from '../../util/types'

import ThesisConfirmModal from './components/ThesisConfirmModal'
import ThesisInformation from './components/ThesisInformation'
import AttachmentAdder from '../Attachment/components/AttachmentAdder'
// import ThesisCouncilMeetingPicker from './components/ThesisCouncilmeetingPicker'
import { emptyThesisData, thesisValidation } from '../../util/theses'
import LoadingIndicator from '../LoadingIndicator'
import AddOutsidePerson from '../Person/components/AddOutsidePerson'

export class ThesisCreatePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            thesis: emptyThesisData,
            attachments: [],
            showModal: false,
            validationErrors: {}
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
            this.props.getGraders(changedValues.programmeId)
        }
        this.validateThesis(thesis)
            .then(() => this.setState({ validationErrors: {} }))
            .catch(res => this.setState({ validationErrors: res.errors }))
    }

    editAttachmentList = (attachments) => {
        this.setState({ attachments })
    }

    validateThesis(thesis = this.state.thesis) {
        return thesisValidation.run(thesis)
    }

    addNewGrader = (data) => {
        const { firstname, lastname, email } = data
        const programmeId = data.programmes[0].value
        const role = 'grader'
        const person = { firstname, lastname, email }
        const roleRequest = { programmeId, role }
        this.props.requestNewGrader({ person, roleRequest })
    }

    changeGraders = (e, data) => {
        const graders = this.props.graders.filter(grader => data.value.includes(grader.personId))
        this.handleChange({ graders })
    }


    formatMeetings = () => {
        const { councilmeetings } = this.props
        const programmeId = parseInt(this.state.thesis.programmeId, 10)

        if (!councilmeetings || !programmeId)
            return []

        // Deadline is always at the end of the day, so if day is either same or after, then it's not past the deadline.
        const isInFuture = meeting => moment(meeting.instructorDeadline).isSameOrAfter(moment(), 'day')
        const formatDate = meeting => moment(meeting.date).format('DD.MM.YYYY')
        const formatDeadline = meeting => moment(meeting.instructorDeadline).format('23:59 DD.MM.YYYY')
        const isMeetingSelectable = meeting => isInFuture(meeting) && meeting.programmes.includes(programmeId)

        const meetings = councilmeetings
            .filter(isMeetingSelectable)
            .map(meeting => ({
                name: 'councilmeetingId',
                value: meeting.councilmeetingId,
                key: meeting.councilmeetingId,
                id: meeting.councilmeetingId,
                text: `${formatDate(meeting)} Deadline: ${formatDeadline(meeting)}`
            }))
        return meetings
    }

    renderGraderSelector = () => {
        const graders = this.props.graders.map((grader) => {
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
        return <Dropdown placeholder="Select grader" fluid multiple search selection options={graders} onChange={this.changeGraders} />
    }

    render() {
        const programme = this.props.programmes.find(p => p.programmeId === parseInt(this.state.thesis.programmeId, 10))
        return (
            <div>
                <LoadingIndicator type="THESIS_SAVE" redirect="/" />
                <ThesisConfirmModal
                    sendSaveThesis={this.handleSaveThesis}
                    closeModal={this.toggleModal}
                    showModal={this.state.showModal}
                />
                <div className="ui form">
                    <ThesisInformation
                        sendChange={this.handleChange}
                        allowEdit
                        studyfields={this.props.studyfields}
                        programmes={this.props.programmes}
                        thesis={this.state.thesis}
                        validationErrors={this.state.validationErrors}
                    />
                    {this.renderGraderSelector()}
                    {programme !== undefined ?
                        <div>
                            <p><b>If a grader is not on the list, you can submit a request below to add him/her and they should then appear in the list</b></p>
                            <AddOutsidePerson programmes={[programme]} roles={['grader']} addOutsider={this.addNewGrader} />
                        </div> :
                        undefined}
                    <h2 style={this.state.invalidAttachments ? { color: 'red' } : null}>
                        Upload at least thesis file and the review file
                    </h2>
                    <AttachmentAdder
                        attachments={this.state.attachments}
                        changeList={this.editAttachmentList}
                    />
                    <br />
                    <div className="two fields">
                        <div className="field">
                            {programme ?
                                <Message color="teal">{programme.name}</Message> :
                                <Message color="red">Please select the unit first</Message>
                            }
                        </div>
                        <div className="field">
                            <Dropdown placeholder="Select meeting" fluid selection options={this.formatMeetings()} onChange={(e, data) => this.handleChange({ councilmeetingId: data.value })} />
                        </div>
                    </div>
                    {/*
                    <ThesisCouncilMeetingPicker
                        sendChange={this.handleChange}
                        chosenMeetingId={this.state.thesis.councilmeetingId}
                        councilmeetings={this.props.councilmeetings}
                        programmes={this.props.programmes}
                    />
                    */}
                </div>
                <br />
                <button className="ui positive button" onClick={this.toggleModal}>
                    Submit
                </button>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    saveThesis(thesis) {
        dispatch(saveThesis(thesis))
    },
    requestNewGrader: data => (
        dispatch(requestGraderAction(data))
    ),
    getGraders: programmeId => (
        dispatch(getGradersAction(programmeId))
    )
})

const mapStateToProps = state => ({
    councilmeetings: state.councilmeetings,
    programmes: state.programmes,
    studyfields: state.studyfields,
    roles: state.roles,
    persons: state.persons,
    graders: state.graders
})

ThesisCreatePage.propTypes = {
    councilmeetings: arrayOf(councilmeetingType).isRequired,
    programmes: arrayOf(programmeType).isRequired,
    studyfields: arrayOf(studyfieldType).isRequired,
    graders: arrayOf(personType).isRequired,
    getGraders: func.isRequired,
    requestNewGrader: func.isRequired,
    saveThesis: func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ThesisCreatePage)
