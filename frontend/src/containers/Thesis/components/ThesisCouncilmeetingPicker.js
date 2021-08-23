import React, { Component } from 'react'
import { connect } from 'react-redux'
import { number, func, arrayOf } from 'prop-types'
import moment from 'moment'
import { Dropdown, Grid, Button, Message } from 'semantic-ui-react'
import { councilmeetingType, programmeType } from '../../../util/types'
// import ProgrammeSelect from '../../Unit/components/ProgrammeSelect'

const NO_MEETING = 'No meeting selected'

class ThesisCouncilmeetingPicker extends Component {
    state = {
        possibleProgrammes: [],
        possibleMeetings: [],
        programmeId: undefined,
        councilmeetingId: undefined,
        selected: NO_MEETING
    }

    componentDidMount() {
        const { councilmeetingId, programmeId, programmes } = this.props
        this.setState({
            possibleProgrammes: this.formatProgrammes(programmes),
            councilmeetingId,
            programmeId
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.programmeId !== this.props.programmeId) {
            const programmeId = Number(this.props.programmeId)
            const possibleMeetings = this.formatMeetings(programmeId)
            if (!possibleMeetings.length)
                return
            this.setState({ programmeId, possibleMeetings, councilmeetingId: possibleMeetings[0].value }, this.selectMeeting)
        }
    }

    formatMeetings = (programmeId) => {
        const { councilmeetings } = this.props

        if (!councilmeetings)
            return []

        // Deadline is always at the end of the day, so if day is either same or after, then it's not past the deadline.
        const isInFuture = meeting => moment(meeting.instructorDeadline).isSameOrAfter(moment(), 'day')
        const formatDate = meeting => moment(meeting.date).format('DD.MM.YYYY')
        const formatDeadline = meeting => moment(meeting.instructorDeadline).format('23:59 DD.MM.YYYY')
        const isMeetingSelectable = meeting => isInFuture(meeting) && meeting.programmes.includes(programmeId)

        return councilmeetings
            .filter(isMeetingSelectable)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(meeting => ({
                key: meeting.councilmeetingId,
                value: meeting.councilmeetingId,
                text: `${formatDate(meeting)} Deadline: ${formatDeadline(meeting)}`
            }))
    }

    formatProgrammes = programmes => programmes
        .filter(programme => !programme.name.includes('OLD')) // && !programme.name.includes('Department')
        .filter(programme => this.formatMeetings(programme.programmeId).length)
        .map(programme => ({ key: programme.programmeId, value: programme.programmeId, text: programme.name }))

    chooseMeeting = (_, target) => {
        if (!target.value) return
        this.setState({ councilmeetingId: Number(target.value) }, this.selectMeeting)
    }

    chooseProgramme = (_, target) => {
        const programmeId = Number(target.value)
        if (!programmeId) return
        const possibleMeetings = this.formatMeetings(programmeId)
        const councilmeetingId = possibleMeetings.length
            ? possibleMeetings[0].value
            : undefined
        this.setState({ programmeId, councilmeetingId, possibleMeetings }, this.selectMeeting)
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
                            options={this.state.possibleProgrammes}
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
                            options={this.state.possibleMeetings}
                            onChange={this.chooseMeeting}
                        />
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

const mapStateToProps = ({ councilmeetings, programmes }) => ({
    councilmeetings,
    programmes
})

export default connect(mapStateToProps)(ThesisCouncilmeetingPicker)
