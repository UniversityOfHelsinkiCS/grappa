import React, { Component } from 'react'
import { number, func, arrayOf } from 'prop-types'
import moment from 'moment'
import { Dropdown, Grid, Button, Message } from 'semantic-ui-react'
import { councilmeetingType, programmeType } from '../../../util/types'
// import ProgrammeSelect from '../../Unit/components/ProgrammeSelect'

export default class ThesisCouncilmeetingPicker extends Component {
    state = {
        programmeId: undefined,
        councilmeetingId: undefined,
        selected: 'No meeting selected'
    }

    componentDidMount() {
        const { councilmeetingId, programmeId } = this.props
        if (councilmeetingId)
            this.setState({ councilmeetingId })
        if (programmeId)
            this.setState({ programmeId })
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
                key: meeting.councilmeetingId,
                value: meeting.councilmeetingId,
                text: `${formatDate(meeting)} Deadline: ${formatDeadline(meeting)}`
            }))

        return meetings
    }

    formatProgrammes = programmes => (
        programmes
            .filter(programme => !programme.name.includes('Department') && !programme.name.includes('OLD'))
            .map(programme => ({ key: programme.programmeId, value: programme.programmeId, text: programme.name }))
    )

    chooseMeeting = (event, data) => {
        if (data.value) {
            this.setState({ councilmeetingId: Number(data.value) })//.props.sendChange({ councilmeetingId: Number(event.target.value) })
        }
    }

    chooseProgramme = (event, data) => {
        const programmeId = Number(data.value)
        if (programmeId) {
            this.setState({ programmeId, councilmeetingId: undefined },
                //this.props.sendChange({ councilmeetingId: undefined })
            )
        }
    }

    clearSelection = () => {
        this.setState({ councilmeetingId: undefined, programmeId: undefined, selected: 'No meeting selected' })
        this.props.sendChange({ councilmeetingId: undefined })
    }

    selectMeeting = () => {
        const { programmeId, councilmeetingId } = this.state
        const { councilmeetings, programmes } = this.props
        const programme = programmes.find(programme => programme.programmeId === programmeId)
        const meeting = councilmeetings.find(councilmeeting => councilmeeting.councilmeetingId === councilmeetingId)
        const formattedMeeting = moment(meeting.date).format('DD.MM.YYYY')
        if (programme && meeting && programme.name && formattedMeeting) {
            this.props.sendChange({ councilmeetingId })
            this.setState({ selected: `${programme.name}: ${formattedMeeting}` })
        } else {
            this.setState({ selected: 'No meeting selected' })
        }
    }

    render() {
        const { councilmeetingId, programmeId, selected } = this.state
        //const chosenMeeting = this.props.chosenMeetingId !== null ? this.props.chosenMeetingId : ''
        const formattedMeetings = this.formatMeetings()
        const programmes = this.props.programmes ? this.formatProgrammes(this.props.programmes) : []
        return (
            <Grid columns="equal">
                <br />
                <h3 className="ui dividing header">Choose the Councilmeeting date</h3>
                <Grid.Row verticalAlign="bottom">
                    <Grid.Column width={5}>
                        <p>
                            Select correct unit for the councilmeeting first.
                        </p>
                        <Dropdown name="programmes" placeholder="Select unit" fluid selection value={programmeId} options={programmes} onChange={this.chooseProgramme} />
                        {/* <ProgrammeSelect
                            onChange={this.chooseProgramme}
                            programmes={this.props.programmes}
                        /> */}
                    </Grid.Column>
                    <Grid.Column>
                        <p>
                            Deadline tells when Grappa stops accepting new theses for that date. If the deadline has passed
                            you have to either contact admin or submit thesis to another Councilmeeting.
                        </p>
                        <Dropdown name="councilmeetings" placeholder="Select meeting date" fluid selection value={councilmeetingId} options={formattedMeetings} onChange={this.chooseMeeting} />
                        {/* <select
                            className="ui fluid search dropdown"
                            onChange={this.chooseMeeting}
                            value={councilmeetingId}
                        >
                            {formattedMeetings.map(meeting => (
                                <option key={meeting.id} value={meeting.id} >
                                    {meeting.content}
                                </option>
                            ))}
                        </select> */}
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <Button color="blue" onClick={this.selectMeeting}>Select</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row verticalAlign="bottom">
                    <Grid.Column>
                        <Message color="yellow">Meeting: {selected}  {selected !== 'No meeting selected' ?
                            <Button size="small" color="red" onClick={this.clearSelection}>Remove</Button> : undefined}
                        </Message>
                        {/* <p>{programmes.find(programme => programme.programmeId === this.state.programmeId)}</p> */}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
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
