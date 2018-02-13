import React, { Component } from 'react'
import { connect } from 'react-redux'
import { arrayOf, func, object } from 'prop-types'
import { Grid, GridColumn, GridRow, Button } from 'semantic-ui-react'
import moment from 'moment'
import {
    agreementType, attachmentType, councilmeetingType, personType, programmeType, roleType, studyfieldType,
    thesisType
} from '../../util/types'
import { downloadAttachments } from '../Attachment/services/attachmentActions'
import AttachmentList from '../Attachment/components/AttachmentList'
import { updateThesis } from './services/thesisActions'
import TextEdit from './components/edit/TextEdit'

class ThesisViewPage extends Component {
    constructor(props) {
        super(props)
        this.state = { value: '', open: '' }
    }

    componentWillReceiveProps(newProps) {
        const editRoles = ['manager', 'admin']
        const {
            theses, agreements, persons, studyfields, programmes, roles, councilMeetings, attachments
        } = newProps
        const hasAllDataLoaded = [
            theses, agreements, persons, studyfields, programmes, roles, councilMeetings, attachments
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
        const allowEdit = this.props.user.roles.find(role => editRoles.includes(role.role))

        this.setState({
            thesis, agreement, author, programmeData, graders, councilMeeting, thesisAttachments, allowEdit
        })
    }

    toggleEditField = (fieldName) => {
        if (this.state.open === fieldName) {
            this.setState({ open: '' })
        } else {
            this.setState({ open: fieldName, value: this.state.thesis[fieldName] })
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
                    <GridColumn>
                        <h3 className="ui sub header">Author</h3>
                        {author ? `${author.firstname} ${author.lastname}` : agreement.email}
                    </GridColumn>
                </GridRow>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Thesis title</h3>
                        {thesis.title}
                    </GridColumn>
                    <GridColumn />
                    {allowEdit ? (
                        <GridColumn>
                            <Button onClick={() => this.toggleEditField('title')}>Edit</Button>
                        </GridColumn>
                    ) : null}
                    <TextEdit
                        active={this.state.open === 'title'}
                        value={this.state.value}
                        handleChange={this.handleChange}
                        save={this.saveChanges}
                    />
                </GridRow>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Unit</h3>
                        {programmeData.programme.name}
                    </GridColumn>
                    <GridColumn>
                        <h3 className="ui sub header">Studyfield</h3>
                        {programmeData.studyfield.name}
                    </GridColumn>
                    {allowEdit ? (
                        <GridColumn>
                            <Button>Edit</Button>
                        </GridColumn>
                    ) : null}
                </GridRow>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Grade</h3>
                        {thesis.grade}
                    </GridColumn>
                    <GridColumn />
                    {allowEdit ? (
                        <GridColumn>
                            <Button>Edit</Button>
                        </GridColumn>
                    ) : null}
                </GridRow>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Graders</h3>
                        {graders.map(grader => (
                            <div key={grader.personId}>{grader.firstname} {grader.lastname}</div>
                        ))}
                    </GridColumn>
                    <GridColumn />
                    {allowEdit ? (
                        <GridColumn>
                            <Button>Edit</Button>
                        </GridColumn>
                    ) : null}
                </GridRow>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Urkund link</h3>
                        <a href={thesis.urkund} target="new">{thesis.urkund}</a>
                    </GridColumn>
                    <GridColumn />
                    {allowEdit ? (
                        <GridColumn>
                            <Button onClick={() => this.toggleEditField('urkund')}>Edit</Button>
                        </GridColumn>
                    ) : null}
                    <TextEdit
                        active={this.state.open === 'urkund'}
                        value={this.state.value}
                        handleChange={this.handleChange}
                        save={this.saveChanges}
                    />
                </GridRow>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Councilmeeting</h3>
                        {councilMeeting ? moment(councilMeeting.date).format('DD.MM.YYYY') : 'Not selected'}
                    </GridColumn>
                    <GridColumn />
                    {allowEdit ? (
                        <GridColumn>
                            <Button>Edit</Button>
                        </GridColumn>
                    ) : null}
                </GridRow>
                <GridRow>
                    <GridColumn width={9}>
                        <h3 className="ui sub header">Attachments</h3>
                        <AttachmentList
                            downloadAttachment={this.props.downloadAttachments}
                            attachments={thesisAttachments}
                        />
                    </GridColumn>
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
    saveThesis: thesis => dispatch(updateThesis(thesis))
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
    saveThesis: func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ThesisViewPage)
