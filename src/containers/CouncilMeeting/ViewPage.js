import React, { Component } from 'react'
import { arrayOf, func, shape, string } from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router-dom'
import isEqual from 'lodash/isEqual'
import { Grid, Dropdown, Button } from 'semantic-ui-react'

import { connect } from 'react-redux'
import { downloadAttachments } from '../Attachment/services/attachmentActions'
import { markPrinted } from '../Thesis/services/thesisActions'
import { thesisType, agreementType, programmeType } from '../../util/types'

import ThesisList from '../Thesis/ThesisList'

export class CouncilmeetingViewPage extends Component {
    constructor() {
        super()
        this.state = {
            previousMeetingId: undefined,
            currentMeeting: undefined,
            nextMeetingId: undefined,
            selectedProgramme: undefined,
            programmeMeetings: []
        }
    }

    componentDidMount() {
        this.initState(this.props)
    }

    componentWillReceiveProps(newProps) {
        const idChanged = !isEqual(this.props.match.params.id, newProps.match.params.id)
        const thesesUpdated = !isEqual(this.props.theses, newProps.theses)
        const agreementsUpdated = !isEqual(this.props.agreements, newProps.agreements)

        if (idChanged || thesesUpdated || agreementsUpdated || !this.state.currentMeeting) {
            this.initState(newProps)
        }
    }

    getProgrammeName(programmeId) {
        return this.props.programmes.find(programme => programme.programmeId === programmeId).name
    }

    getProgrammeNames() {
        if (this.state.currentMeeting)
            return this.state.currentMeeting.programmes.map(programme => `${this.getProgrammeName(programme)} `)

        return null
    }

    initState = (props) => {
        const { programmeMeetings } = this.state
        if (!programmeMeetings.length === 0) return
        const foundIndex = this.findIndexFromProps(props)
        const previousMeetingId = foundIndex > 0 ? programmeMeetings[foundIndex - 1].councilmeetingId : undefined
        const currentMeeting = programmeMeetings[foundIndex]
        const nextMeetingId = foundIndex === programmeMeetings.length - 1 ?
            undefined : programmeMeetings[foundIndex + 1].councilmeetingId
        this.setState({
            previousMeetingId,
            currentMeeting,
            nextMeetingId
        })
    }

    filterThesesByMeeting = (theses, councilmeetingId) =>
        theses.filter(thesis => thesis.councilmeetingId === councilmeetingId)

    findIndexFromProps = (props) => {
        const { match } = props
        const { programmeMeetings } = this.state
        let foundIndex
        if (match.params && match.params.id) {
            const councilmeetingId = Number(match.params.id)
            foundIndex = programmeMeetings.findIndex(meeting => meeting.councilmeetingId === councilmeetingId)
        } else {
            foundIndex = this.findNextMeeting(new Date(), programmeMeetings)
        }
        return foundIndex
    }

    /**
     * Finds the index of closest date including today from sorted list of CouncilMeetings
     */
    findNextMeeting = (starting, meetings = []) => meetings.findIndex((meeting) => {
        const date = new Date(meeting.date)
        return (date >= starting || date.toDateString() === starting.toDateString())
    })

    handleDownload = (attachmentIds) => {
        this.props.downloadAttachments([...attachmentIds, `cm${this.state.currentMeeting.councilmeetingId}`])
    }

    formatProgrammes = programmes => (
        programmes.filter(programme => !programme.name.includes('OLD'))
            .map(programme => ({
                key: programme.programmeId,
                value: programme.programmeId,
                text: programme.name
            }))
    )

    selectProgramme = (e, data) => {
        if (data.value !== this.state.selectedProgramme) {
            this.setState({ selectedProgramme: data.value })
            this.filterMeetingsByProgramme(data.value)
        }
    }

    filterMeetingsByProgramme = async (programmeId) => {
        const programmeMeetings = this.props.councilMeetings.filter(meeting => meeting.programmes.includes(programmeId))
        await this.setState({ programmeMeetings })
        this.initState(this.props)
    }

    renderCouncilMeetingTitle = () => {
        if (this.state.currentMeeting) {
            return `Councilmeeting of ${moment(this.state.currentMeeting.date).format('DD.MM.YYYY')}`
        }

        return 'No Councilmeeting found'
    }

    render() {
        const councilMeetingId = this.state.currentMeeting ? this.state.currentMeeting.councilmeetingId : 0
        const { programmes, theses } = this.props
        const formattedProgrammes = this.formatProgrammes(programmes)
        const selectedProgramme = this.state.selectedProgramme ? programmes.find(programme => programme.programmeId === this.state.selectedProgramme) : undefined
        const meetingTheses = this.filterThesesByMeeting(theses, councilMeetingId)
        return (
            <Grid columns="equal">
                <Grid.Row verticalAlign="bottom">
                    <Grid.Column width={5}>
                        <Dropdown selection fluid value={this.state.selectedProgramme} options={formattedProgrammes} onChange={this.selectProgramme} />
                    </Grid.Column>
                    <Grid.Column>
                        <Button.Group color="blue">
                            {this.state.previousMeetingId ?
                                <Button as={Link} to={`/councilmeeting/${this.state.previousMeetingId}`}>
                                    Previous
                                </Button>
                                :
                                <Button disabled>Previous</Button>
                            }
                            {this.state.nextMeetingId ?
                                <Button as={Link} to={`/councilmeeting/${this.state.nextMeetingId}`}>
                                    Next
                                </Button>
                                :
                                <Button disabled>Next</Button>
                            }
                        </Button.Group>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={5}>
                        <h3>{selectedProgramme ? selectedProgramme.name : 'no unit selected'}</h3>
                    </Grid.Column>
                    <Grid.Column>
                        <h2 className="ui dividing header" style={{ marginTop: '1%' }}>
                            <span>
                                {this.renderCouncilMeetingTitle()}
                            </span>
                        </h2>
                    </Grid.Column>
                </Grid.Row>
                <ThesisList
                    theses={meetingTheses}
                    downloadSelected={this.handleDownload}
                    markPrinted={this.props.markPrinted}
                    councilMeetingId={councilMeetingId}
                    showButtons
                    selectable
                />
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    councilMeetings: state.councilmeetings,
    theses: state.theses,
    agreements: state.agreements,
    programmes: state.programmes
})

const mapDispatchToProps = dispatch => ({
    downloadAttachments(attachmentIds) {
        dispatch(downloadAttachments(attachmentIds))
    },
    markPrinted(thesisIds) {
        dispatch(markPrinted(thesisIds))
    }
})

CouncilmeetingViewPage.propTypes = {
    theses: arrayOf(thesisType).isRequired,
    downloadAttachments: func.isRequired,
    agreements: arrayOf(agreementType).isRequired,
    markPrinted: func.isRequired,
    programmes: arrayOf(programmeType).isRequired,
    match: shape({
        params: shape({
            id: string
        })
    }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(CouncilmeetingViewPage)
