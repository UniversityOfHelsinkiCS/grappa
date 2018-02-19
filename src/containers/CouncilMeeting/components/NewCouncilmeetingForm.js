import React, { Component } from 'react'
import { arrayOf, func } from 'prop-types'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { programmeType } from '../../../util/types'
import ProgrammeSelect from '../../Unit/components/ProgrammeSelect'
import { ProgrammeList } from '../../Unit/components/ProgrammeList'

const dateFormat = 'DD.MM.YYYY'
const initialState = {
    meeting: {
        instructorDeadlineDays: 8,
        studentDeadlineDays: 6,
        programmes: []
    }
}


class NewCouncilmeetingForm extends Component {
    constructor(props) {
        super(props)
        this.state = Object.assign({}, initialState)
    }

    handleChange = field => (event) => {
        const meeting = Object.assign({}, this.state.meeting)
        meeting[field] = event.target.value
        this.setState({ meeting })
    };

    handleDateChange = (date) => {
        const meeting = Object.assign({}, this.state.meeting, { date })
        this.setState({ meeting })
    };

    handleProgrammeChange = (event) => {
        const newProgramme = this.props.programmes.find(programme =>
            programme.programmeId === Number(event.target.value)
            && !this.state.meeting.programmes.find(p => p.programmeId === programme.programmeId)
        )
        if (newProgramme) {
            const programmes = [...this.state.meeting.programmes, newProgramme]
            const meeting = Object.assign({}, this.state.meeting, { programmes })
            this.setState({ meeting })
        }
    };

    removeSelected = (programmeId) => {
        const programmes = [...this.state.meeting.programmes
            .filter(programme => programme.programmeId !== programmeId)]
        const meeting = Object.assign({}, this.state.meeting, { programmes })

        this.setState({ meeting })
    };


    saveMeeting = () => {
        // Since users only think about the difference but we want to save the date.
        const { date, instructorDeadlineDays, studentDeadlineDays, programmes } = this.state.meeting
        const instructorDeadline = moment(date).subtract(instructorDeadlineDays, 'days')
        const studentDeadline = moment(date).subtract(studentDeadlineDays, 'days')
        const programmeIds = programmes.map(programme => programme.programmeId)

        this.props.saveMeeting({ date, instructorDeadline, studentDeadline, programmes: programmeIds })
        this.setState(Object.assign({}, initialState))
    };

    render() {
        return (
            <div className="field">
                <h2 className="ui dividing header">Create a council meeting date</h2>
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
                                onChange={this.handleDateChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="newCouncilmeetingInstructorDeadlineDays">Instructor deadline days</label>
                            <input
                                id="newCouncilmeetingInstructorDeadlineDays"
                                type="text"
                                value={this.state.meeting.instructorDeadlineDays}
                                onChange={this.handleChange('instructorDeadlineDays')}
                                placeholder="Days"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="newCouncilmeetingStudentDeadlineDays">Student deadline days</label>
                            <input
                                id="newCouncilmeetingStudentDeadlineDays"
                                type="text"
                                value={this.state.meeting.studentDeadlineDays}
                                onChange={this.handleChange('studentDeadlineDays')}
                                placeholder="Days"
                            />
                        </div>
                    </div>
                    <div className="one fields">
                        <div className="field">
                            <label htmlFor="newMeetingProgramme">Units</label>
                            <ProgrammeSelect
                                onChange={this.handleProgrammeChange}
                                programmes={this.props.programmes}
                                clearSelect
                            />
                            <ProgrammeList
                                programmes={this.state.meeting.programmes}
                                removeProgramme={this.removeSelected}
                            />
                        </div>
                    </div>
                    <button className="ui green button" onClick={this.saveMeeting}>
                        Submit
                    </button>
                </div>
            </div>
        )
    }
}

NewCouncilmeetingForm.propTypes = {
    saveMeeting: func.isRequired,
    programmes: arrayOf(programmeType).isRequired
}

export default NewCouncilmeetingForm
