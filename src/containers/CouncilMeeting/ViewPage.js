import React, { Component } from 'react'
import { arrayOf, func, shape, string } from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router-dom'
import isEqual from 'lodash/isEqual'

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
            nextMeetingId: undefined
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
        const { councilMeetings } = props
        const foundIndex = this.findIndexFromProps(props)
        const previousMeetingId = foundIndex > 0 ? councilMeetings[foundIndex - 1].councilmeetingId : undefined
        const currentMeeting = councilMeetings[foundIndex]
        const nextMeetingId = foundIndex === councilMeetings.length - 1 ?
            undefined : councilMeetings[foundIndex + 1].councilmeetingId
        this.setState({
            previousMeetingId,
            currentMeeting,
            nextMeetingId
        })
    };

    filterThesesByMeeting = (theses, meeting) =>
        theses.filter(thesis => thesis.councilmeetingId === meeting.councilmeetingId);

    findIndexFromProps = (props) => {
        const { match, councilMeetings } = props
        let foundIndex
        if (match.params && match.params.id) {
            const councilmeetingId = Number(match.params.id)
            foundIndex = councilMeetings.findIndex(meeting => meeting.councilmeetingId === councilmeetingId)
        } else {
            foundIndex = this.findNextMeeting(new Date(), councilMeetings)
        }
        return foundIndex
    };

    /**
     * Finds the index of closest date including today from sorted list of CouncilMeetings
     */
    findNextMeeting = (starting, meetings = []) => meetings.findIndex((meeting) => {
        const date = new Date(meeting.date)
        return (date >= starting || date.toDateString() === starting.toDateString())
    });

    handleDownload = (attachmentIds) => {
        this.props.downloadAttachments([...attachmentIds, `cm${this.state.currentMeeting.councilmeetingId}`])
    };

    renderCouncilMeetingTitle() {
        if (this.state.currentMeeting) {
            return `Councilmeeting of ${moment(this.state.currentMeeting.date).format('DD.MM.YYYY')}`
        }

        return 'No Councilmeeting found'
    }

    render() {
        const councilMeetingId = this.state.currentMeeting ? this.state.currentMeeting.councilmeetingId : 0
        return (
            <div>
                <div>
                    {this.state.previousMeetingId ?

                        <Link to={`/councilmeeting/${this.state.previousMeetingId}`} className="ui button blue">
                            Previous
                        </Link>
                        :
                        <button className="ui button blue" disabled>Previous</button>
                    }
                    {this.state.nextMeetingId ?
                        <Link to={`/councilmeeting/${this.state.nextMeetingId}`} className="ui button blue">Next</Link>
                        :
                        <button className="ui button blue" disabled>Next</button>
                    }
                    <h2 className="ui dividing header" style={{ marginTop: '1%' }}>
                        <span>
                            {this.renderCouncilMeetingTitle()}
                        </span>
                    </h2>
                </div>
                <div style={{ marginTop: '1em', marginBottom: '1em' }}>{this.getProgrammeNames()}</div>
                <ThesisList
                    downloadSelected={this.handleDownload}
                    markPrinted={this.props.markPrinted}
                    councilMeetingId={councilMeetingId}
                    showButtons
                    selectable
                />
            </div>
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
