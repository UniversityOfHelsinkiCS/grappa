import React, { Component } from 'react'
import { arrayOf, func } from 'prop-types'
import { connect } from 'react-redux'
import { Dropdown, Header } from 'semantic-ui-react'
import moment from 'moment'

import { saveThesis } from './services/thesisActions'
import { requestGraderAction, getGradersAction } from '../Person/services/personActions'
import { programmeType, studyfieldType, councilmeetingType } from '../../util/types'

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
                    <Header as="h3" dividing>Graders of the thesis</Header>
                    {this.renderGraderSelector()}
                    {programme !== undefined ?
                        <div>
                            <p>If a grader is not on the list, you can submit a request below to add him/her
                                and they should then appear in the list.
                            </p>
                            <AddPerson programmes={[programme]} roles={['grader']} addNewPerson={this.addNewGrader} />
                        </div> :
                        undefined}
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
                    {/*
                    <Header as="h3" dividing>Select the councilmeeting</Header>
                    {programme ?
                        <Label basic size="large" color="teal">{programme.name}</Label> :
                        <Label basic size="large" color="red">Please select the unit first.</Label>
                    }
                    <Dropdown
                    placeholder="Select meeting"
                    selection options={this.formatMeetings()}
                    onChange={(e, data) => this.handleChange({ councilmeetingId: data.value })}
                    />
                    */}
                    <ThesisCouncilMeetingPicker
                        sendChange={this.handleChange}
                        chosenMeetingId={this.state.thesis.councilmeetingId}
                        councilmeetings={this.props.councilmeetings}
                        programmes={this.props.programmes}
                    />
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
    }
})

const mapStateToProps = state => ({
    councilmeetings: state.councilmeetings,
    programmes: state.programmes,
    studyfields: state.studyfields,
    roles: state.roles,
    persons: state.persons
})

ThesisCreatePage.propTypes = {
    councilmeetings: arrayOf(councilmeetingType).isRequired,
    programmes: arrayOf(programmeType).isRequired,
    studyfields: arrayOf(studyfieldType).isRequired,
    saveThesis: func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ThesisCreatePage)
