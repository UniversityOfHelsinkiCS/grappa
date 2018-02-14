import React, { Component } from 'react'
import { connect } from 'react-redux'
import { arrayOf, func, object } from 'prop-types'
import { Grid, GridColumn, GridRow, Button } from 'semantic-ui-react'
import moment from 'moment'
import {
    agreementType, attachmentType, councilmeetingType, personType, programmeType, roleType, studyfieldType,
    thesisType
} from '../../util/types'
import { createAttachment, downloadAttachments } from '../Attachment/services/attachmentActions'
import AttachmentList from '../Attachment/components/AttachmentList'
import { updateThesis } from './services/thesisActions'
import TextEdit from './components/edit/TextEdit'
import ThesisFieldEdit from './components/edit/ThesisFieldEdit'
import { getAgreements } from '../Agreement/services/agreementActions'
import ThesisValueField from './components/edit/ThesisValueField'
import EditButton from './components/edit/EditButton'
import ThesisCouncilmeetingPicker from './components/ThesisCouncilmeetingPicker'
import AttachmentAdder from '../Attachment/components/AttachmentAdder'
import GraderSelector from './components/edit/GraderSelector'
import { gradeFields, oldGradeFields } from '../../util/theses'

class ThesisViewPage extends Component {
    constructor(props) {
        super(props)
        this.state = { value: '', open: '', newAttachments: [] }
    }

    componentDidMount() {
        this.updateState(this.props)
    }

    componentWillReceiveProps(newProps) {
        this.updateState(newProps)
    }

    updateState(newProps) {
        const editRoles = ['manager', 'admin']
        const {
            theses, agreements, persons, studyfields, programmes, roles, councilMeetings, attachments
        } = newProps
        const hasAllDataLoaded = [
            theses, agreements, persons, studyfields, programmes, roles, councilMeetings
        ].every(arr => arr.length > 0)

        if (!hasAllDataLoaded)
            return

        const selectedId = Number(this.props.match.params.id)
        const thesis = theses.find(t => t.thesisId === selectedId)
        const agreement = agreements.find(agr => agr.thesisId === selectedId)
        const author = (agreement) ? persons.find(person => person.personId === agreement.authorId) : null
        const studyfield = studyfields.find(field => field.studyfieldId === agreement.studyfieldId)
        const programme = programmes.find(prg => prg.programmeId === studyfield.programmeId)
        const programmeData = { studyfield, programme }
        const graders = roles
            .filter(role => role.agreementId === agreement.agreementId)
            .map(role => persons.find(person => person.personId === role.personId))
        const councilMeeting = councilMeetings
            .find(meeting => meeting.councilmeetingId === thesis.councilmeetingId)
        const thesisAttachments = attachments.filter(attachment => attachment.agreementId === agreement.agreementId)
        const allowEdit = !!this.props.user.roles.find(role => editRoles.includes(role.role))

        this.setState({
            thesis, agreement, author, programmeData, graders, councilMeeting, thesisAttachments, allowEdit
        })
    }

    toggleEditField = (fieldName) => {
        if (this.state.open === fieldName) {
            this.setState({ open: '' })
        } else {
            const value = this.state.thesis[fieldName]
            this.setState({ open: fieldName, value: value || '' })
        }
    }

    handleChange = event => this.setState({ value: event.target.value })

    saveChanges = () => {
        const field = this.state.open
        const thesis = { thesisId: this.state.thesis.thesisId }

        thesis[field] = this.state.value
        this.props.saveThesis(thesis)
        this.setState({ open: '', value: '' })
    }

    saveMeeting = (meeting) => {
        const councilmeetingId = Number(meeting.councilmeetingId)
        this.props.saveThesis({ thesisId: this.state.thesis.thesisId, councilmeetingId })
        this.setState({ open: '', value: '' })
    }

    updateGraders = graders => this.setState({ graders })

    updateAttachments = attachments => this.setState({ newAttachments: attachments })

    uploadAttachments = () => {
        const form = new FormData()
        // agreementId needed to link the attachment to.
        const agreement = this.props.agreements.find(agreement => agreement.thesisId === this.state.thesis.thesisId)
        form.append('json', JSON.stringify(agreement))
        this.state.newAttachments.forEach((attachment) => {
            if (!attachment.label) {
                attachment.label = 'otherFile'
            }
            form.append(attachment.label, attachment)
        })

        this.props.createAttachment(form)
        this.setState({ open: '', newAttachments: [] })
    }

    saveGraders = () => {
        this.props.saveThesis({
            thesisId: this.state.thesis.thesisId,
            graders: this.state.graders.map(grader => grader.personId)
        })
        this.setState({ open: '', value: '' })
        this.props.getAgreements()
    }

    render() {
        const {
            thesis, agreement, author, programmeData, graders,
            councilMeeting, thesisAttachments, allowEdit
        } = this.state

        if (!thesis || !agreement)
            return null

        return (
            <Grid columns={3}>
                <GridRow>
                    <ThesisValueField title="Author">
                        {author ? `${author.firstname} ${author.lastname}` : agreement.email}
                    </ThesisValueField>
                </GridRow>
                <GridRow>
                    <ThesisValueField title="Thesis title">{thesis.title}</ThesisValueField>
                    <GridColumn />
                    <EditButton toggle={() => this.toggleEditField('title')} allowEdit={allowEdit} />
                    <TextEdit
                        active={this.state.open === 'title'}
                        value={this.state.value}
                        handleChange={this.handleChange}
                        save={this.saveChanges}
                    />
                </GridRow>
                <GridRow>
                    <ThesisValueField title="Unit">{programmeData.programme.name}</ThesisValueField>
                    <ThesisValueField title="Studyfield">{programmeData.studyfield.name}</ThesisValueField>
                </GridRow>
                <GridRow>
                    <ThesisValueField title="Grade">{thesis.grade}</ThesisValueField>
                    <GridColumn />
                    <EditButton toggle={() => this.toggleEditField('grade')} allowEdit={allowEdit} />
                    <ThesisFieldEdit active={this.state.open === 'grade'}>
                        <select value={this.state.value} onChange={this.handleChange}>
                            {programmeData.programme.name.includes('Department') ?
                                oldGradeFields.map(grade => (
                                    <option key={grade.id} value={grade.id}>{grade.name}</option>
                                )) : gradeFields.map(grade => (
                                    <option key={grade.id} value={grade.id}>{grade.name}</option>
                                ))}
                        </select>
                        <Button onClick={this.saveChanges}>Save</Button>
                    </ThesisFieldEdit>
                </GridRow>
                <GridRow>
                    <ThesisValueField title="Graders">
                        {graders.map(grader => (
                            <div key={grader.personId}>{grader.firstname} {grader.lastname}</div>
                        ))}
                    </ThesisValueField>
                    <GridColumn />
                    <EditButton toggle={() => this.toggleEditField('graders')} allowEdit={allowEdit} />
                    <ThesisFieldEdit active={this.state.open === 'graders'}>
                        <Button onClick={this.saveGraders} >Save</Button>
                        <GraderSelector
                            graders={graders}
                            validationErrors={{}}
                            allowEdit={allowEdit}
                            persons={this.props.persons}
                            programmeId={programmeData.programme.programmeId}
                            roles={this.props.roles}
                            change={this.updateGraders}
                        />
                    </ThesisFieldEdit>
                </GridRow>
                <GridRow>
                    <ThesisValueField title="Urkund link">
                        <a href={thesis.urkund} target="new">{thesis.urkund}</a>
                    </ThesisValueField>
                    <GridColumn />
                    <EditButton toggle={() => this.toggleEditField('urkund')} allowEdit={allowEdit} />
                    <TextEdit
                        active={this.state.open === 'urkund'}
                        value={this.state.value}
                        handleChange={this.handleChange}
                        save={this.saveChanges}
                    />
                </GridRow>
                <GridRow>
                    <ThesisValueField title="Council meeting">
                        {councilMeeting ? moment(councilMeeting.date).format('DD.MM.YYYY') : 'Not selected'}
                    </ThesisValueField>
                    <GridColumn />
                    <EditButton toggle={() => this.toggleEditField('councilmeeting')} allowEdit={allowEdit} />
                    <ThesisFieldEdit active={this.state.open === 'councilmeeting'}>
                        <ThesisCouncilmeetingPicker
                            councilmeetings={this.props.councilMeetings}
                            sendChange={this.saveMeeting}
                            programmes={this.props.programmes}
                        />
                    </ThesisFieldEdit>
                </GridRow>
                <GridRow>
                    <GridColumn width={10}>
                        <h3 className="ui sub header">Attachments</h3>
                        <AttachmentList
                            downloadAttachment={this.props.downloadAttachments}
                            attachments={thesisAttachments}
                        />
                    </GridColumn>
                    <EditButton toggle={() => this.toggleEditField('attachments')} allowEdit={allowEdit} />
                    <ThesisFieldEdit active={this.state.open === 'attachments'}>
                        <AttachmentAdder
                            attachments={this.state.newAttachments}
                            changeList={this.updateAttachments}
                            uploadAttachments={this.uploadAttachments}
                        />
                    </ThesisFieldEdit>
                </GridRow>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    theses: state.theses,
    agreements: state.agreements,
    persons: state.persons,
    studyfields: state.studyfields,
    programmes: state.programmes,
    roles: state.roles,
    councilMeetings: state.councilmeetings,
    attachments: state.attachments
})

const mapDispatchToProps = dispatch => ({
    downloadAttachments: attachmentId => dispatch(downloadAttachments([attachmentId])),
    saveThesis: thesis => dispatch(updateThesis(thesis)),
    getAgreements: () => dispatch(getAgreements()),
    createAttachment: attachment => dispatch(createAttachment(attachment))
})

ThesisViewPage.propTypes = {
    user: personType.isRequired,
    theses: arrayOf(thesisType).isRequired,
    agreements: arrayOf(agreementType).isRequired,
    persons: arrayOf(personType).isRequired,
    studyfields: arrayOf(studyfieldType).isRequired,
    programmes: arrayOf(programmeType).isRequired,
    roles: arrayOf(roleType).isRequired,
    councilMeetings: arrayOf(councilmeetingType).isRequired,
    attachments: arrayOf(attachmentType).isRequired,
    match: object.isRequired,
    downloadAttachments: func.isRequired,
    saveThesis: func.isRequired,
    getAgreements: func.isRequired,
    createAttachment: func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ThesisViewPage)
