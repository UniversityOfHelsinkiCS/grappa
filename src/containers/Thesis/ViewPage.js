import React, { Component } from 'react';
import { connect } from 'react-redux';
import { arrayOf, object } from 'prop-types';
import { Grid, GridColumn, GridRow } from 'semantic-ui-react';
import moment from 'moment';
import {
    agreementType, councilmeetingType, personType, programmeType, roleType, studyfieldType,
    thesisType
} from '../../util/types';

class ThesisViewPage extends Component {

    getThesisData() {
        const { theses, agreements, persons, studyfields, programmes, roles, councilMeetings } = this.props;
        const noData = arr => arr.length === 0;

        if (noData(theses) || noData(agreements) || noData(studyfields) || noData(programmes)
            || noData(roles) || noData(councilMeetings))
            return {};

        const selectedId = Number(this.props.match.params.id);
        const selectedThesis = theses.find(thesis => thesis.thesisId === selectedId);
        const agreement = agreements.find(agr => agr.thesisId === selectedId);
        const author = (agreement) ? persons.find(person => person.personId === agreement.authorId) : null;
        const studyfield = studyfields.find(field => field.studyfieldId === agreement.studyfieldId);
        const programme = programmes.find(prg => prg.programmeId === studyfield.programmeId);
        const programmeData = { studyfield, programme };
        const graders = roles
            .filter(role => role.agreementId === agreement.agreementId)
            .map(role => persons.find(person => person.personId === role.personId));
        const councilMeeting = councilMeetings
            .find(meeting => meeting.councilmeetingId === selectedThesis.councilmeetingId);

        return { thesis: selectedThesis, agreement, author, programmeData, graders, councilMeeting };
    }

    render() {
        const data = this.getThesisData();
        console.log(data);

        if (!data.thesis || !data.agreement)
            return null;

        return (
            <Grid columns={3}>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Author</h3>
                        {data.author ? `${data.author.firstname} ${data.author.lastname}` : data.agreement.email}
                    </GridColumn>
                </GridRow>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Thesis title</h3>
                        {data.thesis.title}
                    </GridColumn>
                </GridRow>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Unit</h3>
                        {data.programmeData.programme.name}
                    </GridColumn>
                    <GridColumn>
                        <h3 className="ui sub header">Studyfield</h3>
                        {data.programmeData.studyfield.name}
                    </GridColumn>
                </GridRow>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Grade</h3>
                        {data.thesis.grade}
                    </GridColumn>
                </GridRow>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Graders</h3>
                        {data.graders.map(grader => (
                            <div key={grader.personId}>{grader.firstname} {grader.lastname}</div>
                        ))}
                    </GridColumn>
                </GridRow>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Urkund link</h3>
                        <a href={data.thesis.urkund} target="new">{data.thesis.urkund}</a>
                    </GridColumn>
                </GridRow>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Councilmeeting</h3>
                        {moment(data.councilMeeting.date).format('DD.MM.YYYY')}
                    </GridColumn>
                </GridRow>
                <GridRow>
                    <GridColumn>
                        <h3 className="ui sub header">Attachments</h3>
                    </GridColumn>
                </GridRow>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    theses: state.theses,
    agreements: state.agreements,
    persons: state.persons,
    studyfields: state.studyfields,
    programmes: state.programmes,
    roles: state.roles,
    councilMeetings: state.councilmeetings
});

ThesisViewPage.propTypes = {
    theses: arrayOf(thesisType).isRequired,
    agreements: arrayOf(agreementType).isRequired,
    persons: arrayOf(personType).isRequired,
    studyfields: arrayOf(studyfieldType).isRequired,
    programmes: arrayOf(programmeType).isRequired,
    roles: arrayOf(roleType).isRequired,
    councilMeetings: arrayOf(councilmeetingType).isRequired,
    match: object.isRequired
};

export default connect(mapStateToProps)(ThesisViewPage);
