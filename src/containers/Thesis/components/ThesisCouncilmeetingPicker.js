import React, { Component } from 'react'
import { number, func, arrayOf } from 'prop-types'
import moment from 'moment'
import { Dropdown } from 'semantic-ui-react'
import { councilmeetingType, programmeType } from '../../../util/types'
// import ProgrammeSelect from '../../Unit/components/ProgrammeSelect'

export default class ThesisCouncilmeetingPicker extends Component {
    state = {
        programmeId: undefined
    }

    formatMeetings = () => {
        const { councilmeetings } = this.props
        const { programmeId } = this.state

        if (!councilmeetings)
            return []

        // Deadline is always at the end of the day, so if day is either same or after, then it's not past the deadline.
        const isInFuture = meeting => moment(meeting.instructorDeadline).isSameOrAfter(moment(), 'day')
        const formatDate = meeting => moment(meeting.date).format('DD.MM.YYYY')
        const formatDeadline = meeting => moment(meeting.instructorDeadline).format('23:59 DD.MM.YYYY')
        const isMeetingSelectable = meeting => isInFuture(meeting) && meeting.programmes.includes(programmeId)

        const meetings = councilmeetings
            .filter(isMeetingSelectable)
            .map(meeting => ({
                id: meeting.councilmeetingId,
                content: `${formatDate(meeting)} Deadline: ${formatDeadline(meeting)}`
            }))

        return [{ id: '', content: 'Select Date' }, ...meetings]
    }

    formatProgrammes = programmes => (
        programmes
            .filter(programme => !programme.name.includes('Department') && !programme.name.includes('OLD'))
            .map(programme => ({ key: programme.programmeId, value: programme.programmeId, text: programme.name }))
    )

    chooseMeeting = (event) => {
        if (event.target.value) {
            this.props.sendChange({ councilmeetingId: Number(event.target.value) })
        }
    }

    chooseProgramme = (event, data) => {
        const programmeId = Number(data.value)
        if (programmeId) {
            this.setState({ programmeId },
                this.props.sendChange({ councilmeetingId: undefined })
            )
        }
    }

    render() {
        const chosenMeeting = this.props.chosenMeetingId !== null ? this.props.chosenMeetingId : ''
        const formattedMeetings = this.formatMeetings()
        const programmes = this.props.programmes ? this.formatProgrammes(this.props.programmes) : []
        return (
            <div>
                <h3 className="ui dividing header">Choose the Councilmeeting date</h3>
                <p>
                    Select correct unit for the councilmeeting first.
                </p>
                <Dropdown name="programmes" placeholder="Select unit" selection options={programmes} onChange={this.chooseProgramme} />
                {/* <ProgrammeSelect
                    onChange={this.chooseProgramme}
                    programmes={this.props.programmes}
                /> */}
                <p>
                    Deadline tells when Grappa stops accepting new theses for that date. If the deadline has passed
                    you have to either contact admin or submit thesis to another Councilmeeting.
                </p>
                <select
                    className="ui fluid search dropdown"
                    onChange={this.chooseMeeting}
                    value={chosenMeeting}
                >
                    {formattedMeetings.map(meeting => (
                        <option key={meeting.id} value={meeting.id} >
                            {meeting.content}
                        </option>
                    ))}
                </select>
            </div>
        )
    }
}

ThesisCouncilmeetingPicker.propTypes = {
    councilmeetings: arrayOf(councilmeetingType).isRequired,
    chosenMeetingId: number,
    sendChange: func.isRequired,
    programmes: arrayOf(programmeType).isRequired
}

ThesisCouncilmeetingPicker.defaultProps = {
    chosenMeetingId: undefined
}
