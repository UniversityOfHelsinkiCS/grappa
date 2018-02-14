import React, { Component } from 'react'
import { arrayOf, func, shape, string } from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router-dom'
import isEqual from 'lodash/isEqual'

import { connect } from 'react-redux'
import { downloadAttachments } from '../Attachment/services/attachmentActions'
import { markPrinted } from '../Thesis/services/thesisActions'
import { personType, thesisType, agreementType, attachmentType, programmeType } from '../../util/types'
import { formatTheses } from '../../util/theses'

import ThesisList from '../Thesis/components/ThesisList'

export class CouncilmeetingViewPage extends Component {
    constructor() {
        super()
        this.state = {
            previousMeetingId: undefined,
            currentMeeting: undefined,
            nextMeetingId: undefined,
            theses: []
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
        const { councilmeetings, theses, agreements, persons } = props
        const foundIndex = this.findIndexFromProps(props)
        const previousMeetingId = foundIndex > 0 ? councilmeetings[foundIndex - 1].councilmeetingId : undefined
        const currentMeeting = councilmeetings[foundIndex]
        const nextMeetingId = foundIndex === councilmeetings.length - 1 ?
            undefined : councilmeetings[foundIndex + 1].councilmeetingId
        const filteredTheses = currentMeeting && theses ? this.filterThesesByMeeting(theses, currentMeeting) : []
        this.setState({
            previousMeetingId,
            currentMeeting,
            nextMeetingId,
            theses: formatTheses(filteredTheses, agreements, persons)
        })
    };

    filterThesesByMeeting = (theses, meeting) =>
        theses.filter(thesis => thesis.councilmeetingId === meeting.councilmeetingId);

    findIndexFromProps = (props) => {
        let foundIndex
        if (props.match.params && props.match.params.id !== 'next') {
            const councilmeetingId = Number(props.match.params.id)
            foundIndex = props.councilmeetings.findIndex(meeting => meeting.councilmeetingId === councilmeetingId)
        } else {
            foundIndex = this.findNextMeeting(new Date(), props.councilmeetings)
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
        this.props.downloadAttachments(attachmentIds)
    };

    renderCouncilMeetingTitle() {
        if (this.state.currentMeeting) {
            return `Councilmeeting of ${moment(this.state.currentMeeting.date).format('DD.MM.YYYY')}`
        }

        return 'No Councilmeeting found'
    }

    render() {
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
                    theses={this.state.theses}
                    userRoles={this.props.user.roles}
                    attachments={this.props.attachments}
                    agreements={this.props.agreements}
                    markPrinted={this.props.markPrinted}
                    showButtons
                />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    persons: state.persons,
    user: state.user,
    councilmeetings: state.councilmeetings,
    theses: state.theses,
    attachments: state.attachments,
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
    user: personType.isRequired,
    theses: arrayOf(thesisType).isRequired,
    downloadAttachments: func.isRequired,
    agreements: arrayOf(agreementType).isRequired,
    attachments: arrayOf(attachmentType).isRequired,
    markPrinted: func.isRequired,
    programmes: arrayOf(programmeType).isRequired,
    match: shape({
        params: shape({
            id: string.isRequired
        })
    }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(CouncilmeetingViewPage)
