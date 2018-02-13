import React, { Component } from 'react';
import { connect } from 'react-redux';
import { arrayOf, func, object } from 'prop-types';
import { Grid, GridColumn, GridRow } from 'semantic-ui-react';
import moment from 'moment';
import {
    agreementType, attachmentType, councilmeetingType, personType, programmeType, roleType, studyfieldType,
    thesisType
} from '../../util/types';
import { downloadAttachments } from '../Attachment/services/attachmentActions';
import AttachmentList from '../Attachment/components/AttachmentList';

class ThesisViewPage extends Component {
    getThesisData() {
        const {
            theses, agreements, persons, studyfields, programmes, roles, councilMeetings, attachments
        } = this.props;
        const hasAllDataLoaded = [
            theses, agreements, persons, studyfields, programmes, roles, councilMeetings, attachments
        ].every(arr => arr.length > 0);

        if (!hasAllDataLoaded)
            return {};

        const selectedId = Number(this.props.match.params.id);
        const thesis = theses.find(t => t.thesisId === selectedId);
        const agreement = agreements.find(agr => agr.thesisId === selectedId);
        const author = (agreement) ? persons.find(person => person.personId === agreement.authorId) : null;
        const studyfield = studyfields.find(field => field.studyfieldId === agreement.studyfieldId);
        const programme = programmes.find(prg => prg.programmeId === studyfield.programmeId);
        const programmeData = { studyfield, programme };
        const graders = roles
            .filter(role => role.agreementId === agreement.agreementId)
            .map(role => persons.find(person => person.personId === role.personId));
        const councilMeeting = councilMeetings
            .find(meeting => meeting.councilmeetingId === thesis.councilmeetingId);
        const thesisAttachments = attachments.filter(attachment => attachment.agreementId === agreement.agreementId);

        return { thesis, agreement, author, programmeData, graders, councilMeeting, thesisAttachments };
    }

    render() {
        const data = this.getThesisData();
        const { thesis, agreement, author, programmeData, graders, councilMeeting, thesisAttachments } = data;

        if (!thesis || !agreement)
            return null;

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
                </GridRow>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Grade</h3>
                        {thesis.grade}
                    </GridColumn>
                </GridRow>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Graders</h3>
                        {graders.map(grader => (
                            <div key={grader.personId}>{grader.firstname} {grader.lastname}</div>
                        ))}
                    </GridColumn>
                </GridRow>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Urkund link</h3>
                        <a href={thesis.urkund} target="new">{thesis.urkund}</a>
                    </GridColumn>
                </GridRow>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Councilmeeting</h3>
                        {councilMeeting ? moment(councilMeeting.date).format('DD.MM.YYYY') : 'Not selected'}
                    </GridColumn>
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
        );
    }
}

const mapStateToProps = state => ({
    theses: state.theses,
    agreements: state.agreements,
    persons: state.persons,
    studyfields: state.studyfields,
    programmes: state.programmes,
    roles: state.roles,
    councilMeetings: state.councilmeetings,
    attachments: state.attachments
});

const mapDispatchToProps = dispatch => ({
    downloadAttachments: attachmentId => dispatch(downloadAttachments([attachmentId]))
});

ThesisViewPage.propTypes = {
    theses: arrayOf(thesisType).isRequired,
    agreements: arrayOf(agreementType).isRequired,
    persons: arrayOf(personType).isRequired,
    studyfields: arrayOf(studyfieldType).isRequired,
    programmes: arrayOf(programmeType).isRequired,
    roles: arrayOf(roleType).isRequired,
    councilMeetings: arrayOf(councilmeetingType).isRequired,
    attachments: arrayOf(attachmentType).isRequired,
    match: object.isRequired,
    downloadAttachments: func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps())(ThesisViewPage);
