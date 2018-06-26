import React, { Component } from 'react'
import { number, func, arrayOf } from 'prop-types'
import moment from 'moment'
import { Dropdown, Grid, Button, Message } from 'semantic-ui-react'
import { councilmeetingType, programmeType } from '../../../util/types'
// import ProgrammeSelect from '../../Unit/components/ProgrammeSelect'

const NO_MEETING = 'No meeting selected'

export default class ThesisCouncilmeetingPicker extends Component {
    state = {
        programmeId: undefined,
        councilmeetingId: undefined,
        selected: NO_MEETING
    }

    componentDidMount() {
        const { councilmeetingId, programmeId } = this.props
        if (councilmeetingId) {
            this.setState({ councilmeetingId })
        }
        if (programmeId) {
            this.setState({ programmeId })
        }
    }

    componentDidUpdate = async () => {
        const councilmeetingId = Number(this.props.councilmeetingId)
        const programmeId = Number(this.props.programmeId)
        // if a programmeId prop is given and no councilmeeting prop is given
        // then auto select the programme for the meeting
        if (programmeId && !this.state.programmeId && !councilmeetingId) {
            const checkedId = this.checkForOldProgramme(programmeId)
            await this.setState({ programmeId: checkedId })
            // find the first possible meeting date if there are meetings
            const meetings = this.formatMeetings()
            if (meetings.length > 0)
                await this.setState({ councilmeetingId: meetings[0].value })
        } else if (programmeId && councilmeetingId && !this.state.councilmeetingId) {
            // If there is both a programme and councilmeeting, set them both,
            // given the meeting has changed from previous
            this.setState({ programmeId, councilmeetingId })
        }
    }

    checkForOldProgramme = (programmeId) => {
        const { programmes } = this.props
        const curProgramme = programmes.find(programme => programme.programmeId === programmeId)
        if (!curProgramme.name.includes('Department')) {
            return programmeId
        }
        const keyString = curProgramme.name.split(' ')[2]
        const correspondingProg = programmes
            .filter(programme => !programme.name.includes('Department') && !programme.name.includes('OLD'))
            .find(programme => programme.name.includes(keyString))
        return correspondingProg.programmeId
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
        this.setState({ councilmeetingId: undefined, programmeId: undefined, selected: NO_MEETING })
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
            this.setState({ selected: NO_MEETING })
        }
    }

    render() {
        const { councilmeetingId, programmeId, selected } = this.state
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
                        <Dropdown
                            name="programmes"
                            placeholder="Select unit"
                            fluid
                            selection
                            value={programmeId}
                            options={programmes}
                            onChange={this.chooseProgramme}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <p>
                            Deadline tells when Grappa stops accepting new theses for that date.
                            If the deadline has passed you have to either contact admin
                            or submit thesis to another Councilmeeting.
                        </p>
                        <Dropdown
                            name="councilmeetings"
                            placeholder="Select meeting date"
                            fluid
                            selection
                            value={councilmeetingId}
                            options={formattedMeetings}
                            onChange={this.chooseMeeting}
                        />
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <Button color="blue" onClick={this.selectMeeting}>Select</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row verticalAlign="bottom">
                    <Grid.Column>
                        <Message color={selected !== NO_MEETING ? 'green' : 'red'}>
                            Meeting: {selected}  {selected !== NO_MEETING ?
                                <Button size="small" color="red" onClick={this.clearSelection}>
                                    Remove
                                </Button> : undefined}
                        </Message>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

ThesisCouncilmeetingPicker.propTypes = {
    councilmeetings: arrayOf(councilmeetingType).isRequired,
    sendChange: func.isRequired,
    programmes: arrayOf(programmeType).isRequired,
    councilmeetingId: number,
    programmeId: number
}

ThesisCouncilmeetingPicker.defaultProps = {
    councilmeetingId: undefined,
    programmeId: undefined
}
