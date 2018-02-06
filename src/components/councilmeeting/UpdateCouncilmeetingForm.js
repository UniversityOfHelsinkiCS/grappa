import React, { Component } from 'react';
import { arrayOf, func } from 'prop-types';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import { councilmeetingType, programmeType } from '../../util/types';
import ProgrammeSelect from '../programme/ProgrammeSelect';
import { ProgrammeList } from '../programme/ProgrammeList';

const dateFormat = 'DD.MM.YYYY';

class UpdateCouncilmeetingForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            meeting: Object.assign({}, props.meeting),
            selectedProgramme: undefined
        };

        this.handleDateChange = this.handleDateChange.bind(this);
        this.updateMeeting = this.updateMeeting.bind(this);
    }

    componentWillReceiveProps(props) {
        if (props.meeting && props.meeting.programmes && props.programmes) {
            const meetingCopy = Object.assign({}, props.meeting);
            meetingCopy.programmes = props.meeting.programmes
                .map(programmeId => props.programmes
                    .find(programme => programme.programmeId === programmeId));
            this.setState({ meeting: meetingCopy });
        }
    }

    handleDateChange(date, field) {
        const meeting = Object.assign({}, this.state.meeting);
        meeting[field] = date;
        this.setState({ meeting });
    }

    handleProgrammeChange = (event) => {
        const foundProgramme = this.props.programmes.find(programme =>
            programme.programmeId === Number(event.target.value)
            && !this.state.meeting.programmes.find(p => p.programmeId === programme.programmeId)
        );
        if (foundProgramme) {
            const programmes = [...this.state.meeting.programmes, foundProgramme];
            const meeting = Object.assign({}, this.state.meeting, { programmes });
            this.setState({ meeting });
        }
    };

    selectProgramme = (programme) => {
        this.setState({ selectedProgramme: programme })
    };

    removeSelected = () => {
        const programmes = [...this.state.meeting.programmes
            .filter(programme => programme.programmeId !== this.state.selectedProgramme.programmeId)];
        const meeting = Object.assign({}, this.state.meeting, { programmes });

        this.setState({ selectedProgramme: undefined, meeting })
    };

    updateMeeting = () => {
        const { councilmeetingId, date, instructorDeadline, studentDeadline, programmes } = this.state.meeting;
        const programmeIds = programmes.map(programme => programme.programmeId);
        this.props.updateMeeting({
            councilmeetingId,
            date,
            instructorDeadline,
            studentDeadline,
            programmes: programmeIds
        });
        this.setState({ meeting: {} });
    };

    render() {
        const meetingDate = this.state.meeting.date;

        if (!this.state.meeting.councilmeetingId) {
            return <div />;
        }
        return (
            <div className="field">
                <h2 className="ui dividing header">
                    Change meetings date {meetingDate ? moment(meetingDate).format(dateFormat) : ''}
                </h2>
                <p>
                    Changing the deadline changes it for every thesis connected to the meeting.
                    After deadline has passed no more theses can be added to the meeting.
                </p>
                <div className="ui form">
                    <div className="fields">
                        <div className="field">
                            <label htmlFor="updateMeetingDate">Date</label>
                            <DatePicker
                                id="updateMeetingDate"
                                dateFormat={dateFormat}
                                selected={moment(meetingDate)}
                                onChange={date => this.handleDateChange(date, 'date')}
                                utcOffset={moment.tz('Europe/Helsinki').utcOffset()}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="updateMeetingInstructorDeadline">Instructor deadline</label>
                            <DatePicker
                                id="updateMeetingInstructorDeadline"
                                dateFormat={dateFormat}
                                selected={moment(this.state.meeting.instructorDeadline)}
                                onChange={date => this.handleDateChange(date, 'instructorDeadline')}
                                utcOffset={moment.tz('Europe/Helsinki').utcOffset()}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="updateStudentDeadline">Student deadline</label>
                            <DatePicker
                                id="updateMeetingStudentDeadline"
                                dateFormat={dateFormat}
                                selected={moment(this.state.meeting.studentDeadline)}
                                onChange={date => this.handleDateChange(date, 'studentDeadline')}
                                utcOffset={moment.tz('Europe/Helsinki').utcOffset()}
                            />
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label htmlFor="newMeetingProgramme">Units</label>
                            <ProgrammeSelect
                                onChange={this.handleProgrammeChange}
                                programmes={this.props.programmes}
                            />
                            <ProgrammeList
                                programmes={this.state.meeting.programmes}
                                select={this.selectProgramme}
                            />
                        </div>
                        <div className="field">
                            {this.state.selectedProgramme ? this.state.selectedProgramme.name : undefined}
                            {this.state.selectedProgramme ? <button className="ui red button" onClick={this.removeSelected}>Remove</button> : undefined}
                        </div>
                    </div>
                    <button className="ui green button" onClick={this.updateMeeting}>
                        Update
                    </button>
                </div>
            </div>
        );
    }
}

UpdateCouncilmeetingForm.propTypes = {
    programmes: arrayOf(programmeType).isRequired,
    meeting: councilmeetingType.isRequired,
    updateMeeting: func.isRequired
};

export default UpdateCouncilmeetingForm;
