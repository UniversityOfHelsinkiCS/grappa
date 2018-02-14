import React, { Component } from 'react'
import { number, func, arrayOf } from 'prop-types'
import moment from 'moment'
import { councilmeetingType, programmeType } from '../../../util/types'
import ProgrammeSelect from '../../Unit/components/ProgrammeSelect'

export default class ThesisCouncilmeetingPicker extends Component {
    state = {
        programmeId: undefined
    }

    formatMeetings = () => {
        const { councilmeetings } = this.props
        const { programmeId } = this.state

        if (!councilmeetings)
            return []

        const isInFuture = meeting => moment(meeting.instructorDeadline).isAfter(moment())
        const formatDate = meeting => moment(meeting.date).format('DD.MM.YYYY')
        const formatDeadline = meeting => moment(meeting.instructorDeadline).format('HH:mm DD.MM.YYYY')
        const isMeetingSelectable = meeting => isInFuture(meeting) && meeting.programmes.includes(programmeId)

        const meetings = councilmeetings
            .filter(isMeetingSelectable)
            .map(meeting => ({
                id: meeting.councilmeetingId,
                content: `${formatDate(meeting)} Deadline: ${formatDeadline(meeting)}`
            }))

        return [{ id: '', content: 'Select Date' }, ...meetings]
    };

    chooseMeeting = (event) => {
        if (event.target.value) {
            this.props.sendChange({ councilmeetingId: Number(event.target.value) })
        }
    };

    chooseProgramme = (event) => {
        const programmeId = Number(event.target.value)
        if (programmeId) {
            this.setState({ programmeId },
                this.props.sendChange({ councilmeetingId: undefined })
            )
        }
    }

    render() {
        const chosenMeeting = this.props.chosenMeetingId !== null ? this.props.chosenMeetingId : ''
        const formattedMeetings = this.formatMeetings()
        return (
            <div>
                <h3 className="ui dividing header">Choose the Councilmeeting date</h3>
                <p>
                    Select correct unit for the councilmeeting first.
                </p>
                <ProgrammeSelect
                    onChange={this.chooseProgramme}
                    programmes={this.props.programmes}
                />
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
