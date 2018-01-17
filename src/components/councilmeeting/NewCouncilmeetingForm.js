import React, { Component } from 'react';
import { arrayOf, func } from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment/moment';
import { programmeType } from '../../util/types';
import ProgrammeSelect from '../programme/ProgrammeSelect';

const dateFormat = 'DD.MM.YYYY';

class NewCouncilmeetingForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            meeting: {
                instructorDeadlineDays: 8,
                studentDeadlineDays: 8
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.saveMeeting = this.saveMeeting.bind(this);
        this.handleProgrammeChange = this.handleProgrammeChange.bind(this);
    }

    handleChange(field, event) {
        const meeting = Object.assign({}, this.state.meeting);
        meeting[field] = event.target.value;
        this.setState({ meeting });
    }

    handleDateChange(date) {
        const meeting = Object.assign({}, this.state.meeting, { date });
        this.setState({ meeting });
    }

    handleProgrammeChange(event) {
        const programmeId = Number(event.target.value);
        const meeting = Object.assign({}, this.state.meeting, { programmeId });
        this.setState({ meeting });
    }

    saveMeeting() {
        // Since users only think about the difference but we want to save the date.
        const { date, instructorDeadlineDays, studentDeadlineDays, programmeId } = this.state.meeting;
        const instructorDeadline = moment(date).subtract(instructorDeadlineDays, 'days');
        const studentDeadline = moment(date).subtract(studentDeadlineDays, 'days');

        this.props.saveMeeting({ date, instructorDeadline, studentDeadline, programmeId });
    }

    render() {
        return (
            <div className="field">
                <h2 className="ui dividing header">Create a councilmeeting date</h2>
                <p>
                    There can be only one meeting per date. Deadline days is date minus days
                    when the deadline is set at 23:59. Eg. if date is 25/11/2016 and instructor
                    deadline days is 8 then the deadline is at 23:59 17/11/2016.
                </p>
                <div className="ui form">
                    <div className="three fields">
                        <div className="field">
                            <label htmlFor="newCouncilmeetingDate">Date</label>
                            <DatePicker
                                id="newCouncilmeetingDate"
                                dateFormat={dateFormat}
                                selected={this.state.meeting.date}
                                onChange={date => this.handleDateChange(date)}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="newCouncilmeetingInstructorDeadlineDays">Instructor deadline days</label>
                            <input
                                id="newCouncilmeetingInstructorDeadlineDays"
                                type="text"
                                value={this.state.meeting.instructorDeadlineDays}
                                onChange={event => this.handleChange('instructorDeadlineDays', event)}
                                placeholder="Days"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="newCouncilmeetingStudentDeadlineDays">Student deadline days</label>
                            <input
                                id="newCouncilmeetingStudentDeadlineDays"
                                type="text"
                                value={this.state.meeting.studentDeadlineDays}
                                onChange={event => this.handleChange('studentDeadlineDays', event)}
                                placeholder="Days"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="newMeetingProgramme">Programme</label>
                            <ProgrammeSelect
                                id="newMeetingProgramme"
                                onChange={this.handleProgrammeChange}
                                programmes={this.props.programmes}
                                value={this.state.meeting.programmeId}
                            />
                        </div>
                    </div>
                    <button className="ui primary button" onClick={this.saveMeeting}>
                        Submit
                    </button>
                </div>
            </div>
        );
    }
}

NewCouncilmeetingForm.propTypes = {
    saveMeeting: func.isRequired,
    programmes: arrayOf(programmeType).isRequired
};

export default NewCouncilmeetingForm;
