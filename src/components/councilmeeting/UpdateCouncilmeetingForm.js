import React, { Component } from 'react';
import { func } from 'prop-types';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import { councilmeetingType } from '../../util/types';

const dateFormat = 'DD.MM.YYYY';

class UpdateCouncilmeetingForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            meeting: props.meeting || {}
        };

        this.handleDateChange = this.handleDateChange.bind(this);
        this.updateMeeting = this.updateMeeting.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({ meeting: props.meeting });
    }

    handleDateChange(date, field) {
        const meeting = Object.assign({}, this.state.meeting);
        meeting[field] = date;
        this.setState({ meeting });
    }

    updateMeeting() {
        this.props.updateMeeting(this.state.meeting);
    }

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
                    <button className="ui green button" onClick={this.updateMeeting}>
                        Update
                    </button>
                </div>
            </div>
        );
    }
}

UpdateCouncilmeetingForm.propTypes = {
    meeting: councilmeetingType.isRequired,
    updateMeeting: func.isRequired
};

export default UpdateCouncilmeetingForm;
