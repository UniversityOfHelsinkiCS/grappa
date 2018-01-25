import React, { Component } from 'react';
import { arrayOf, func } from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment-timezone';
import { programmeType } from '../../util/types';
import ProgrammeSelect from '../programme/ProgrammeSelect';
import { ProgrammeList } from '../programme/ProgrammeList';

const dateFormat = 'DD.MM.YYYY';

class NewCouncilmeetingForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            meeting: {
                instructorDeadlineDays: 8,
                studentDeadlineDays: 8,
                programmes: []
            },
            selectedProgramme: undefined
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
        const programme = this.props.programmes.find(programme =>
            programme.programmeId === Number(event.target.value)
            && !this.state.meeting.programmes.find(p => p.programmeId === programme.programmeId)
        )
        if (programme) {
            const programmes = [...this.state.meeting.programmes, programme];
            const meeting = Object.assign({}, this.state.meeting, { programmes });
            this.setState({ meeting });
        }
    }

    selectProgramme = (programme) => {
        this.setState({ selectedProgramme: programme })
    }

    removeSelected = () => {
        const programmes = [...this.state.meeting.programmes
            .filter(programme => programme.programmeId !== this.state.selectedProgramme.programmeId)]
        const meeting = Object.assign({}, this.state.meeting, { programmes });

        this.setState({ selectedProgramme: undefined, meeting })
    }


    saveMeeting() {
        // Since users only think about the difference but we want to save the date.
        const { date, instructorDeadlineDays, studentDeadlineDays, programmes } = this.state.meeting;
        const instructorDeadline = moment(date).subtract(instructorDeadlineDays, 'days');
        const studentDeadline = moment(date).subtract(studentDeadlineDays, 'days');
        const programmeIds = programmes.map(programme => programme.programmeId)

        this.props.saveMeeting({ date, instructorDeadline, studentDeadline, programmes: programmeIds });
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
                                utcOffset={moment.tz('Europe/Helsinki').utcOffset()}
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
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label htmlFor="newMeetingProgramme">Programmes</label>
                            <ProgrammeSelect
                                id="newMeetingProgramme"
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
                    <button className="ui green button" onClick={this.saveMeeting}>
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
