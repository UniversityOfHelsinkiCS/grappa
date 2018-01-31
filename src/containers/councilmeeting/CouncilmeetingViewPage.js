import React, { Component } from 'react';
import { arrayOf, func } from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom'

import { connect } from 'react-redux';
import { downloadAttachments } from '../attachment/attachmentActions'
import { personType, thesisType, agreementType, attachmentType } from '../../util/types';
import { formatTheses } from '../../util/theses';

import ThesisList from '../../components/thesis/ThesisList'

export class CouncilmeetingViewPage extends Component {
    constructor() {
        super();
        this.state = {
            previousMeetingId: undefined,
            currentMeeting: undefined,
            nextMeetingId: undefined,
            theses: []
        };
    }

    componentDidMount() {
        this.initState(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.match.params.id !== newProps.match.params.id || !this.state.currentMeeting) {
            this.initState(newProps);
        }
    }

    initState = (props) => {
        const { councilmeetings, theses, persons, agreements } = props;
        if (councilmeetings.length < 1 || theses.length < 1 || persons.length < 1 || agreements.length < 1) return;
        const foundIndex = this.findIndexFromProps(props);
        const previousMeetingId = foundIndex > 0 ? councilmeetings[foundIndex - 1].councilmeetingId : undefined;
        const currentMeeting = councilmeetings[foundIndex];
        const nextMeetingId = foundIndex === councilmeetings.length - 1 ?
            undefined : councilmeetings[foundIndex + 1].councilmeetingId;
        const filteredTheses = currentMeeting && theses ? this.filterThesesByMeeting(theses, currentMeeting) : [];
        this.setState({
            previousMeetingId,
            currentMeeting,
            nextMeetingId,
            theses: formatTheses(filteredTheses, props.agreements, props.persons)
        });
    };

    filterThesesByMeeting = (theses, meeting) =>
        theses.filter(thesis => thesis.councilmeetingId === meeting.councilmeetingId);

    findIndexFromProps = (props) => {
        let foundIndex;
        if (props.match.params && props.match.params.id !== 'next') {
            const councilmeetingId = Number(props.match.params.id);
            foundIndex = props.councilmeetings.findIndex(meeting => meeting.councilmeetingId === councilmeetingId);
        } else {
            foundIndex = this.findNextMeeting(new Date(), props.councilmeetings);
        }
        return foundIndex;
    };

    /**
     * Finds the index of closest date including today from sorted list of CouncilMeetings
     */
    findNextMeeting = (starting, meetings = []) => meetings.findIndex((meeting) => {
        const date = new Date(meeting.date);
        return (date >= starting || date.toDateString() === starting.toDateString())
    });

    handleDownload = (attachmentIds) => {
        this.props.downloadAttachments(attachmentIds);
    };

    render() {
        return (
            <div>
                <div>
                    {this.state.previousMeetingId ?

                        <Link to={`/councilmeeting/${this.state.previousMeetingId}`} className="ui button blue">
                            Previous
                        </Link>
                        :
                        <span />
                    }
                    {this.state.nextMeetingId ?
                        <Link to={`/councilmeeting/${this.state.nextMeetingId}`} className="ui button blue">Next</Link>
                        :
                        <span />
                    }
                    <h2 className="ui dividing header" style={{ marginTop: '1%' }}>
                        <span>
                            {this.state.currentMeeting !== undefined ?
                                `Councilmeeting of ${moment(this.state.currentMeeting.date).format('DD/MM/YYYY')}`
                                :
                                'No Councilmeeting found'
                            }
                        </span>
                    </h2>
                </div>
                <ThesisList
                    downloadSelected={this.handleDownload}
                    theses={this.state.theses}
                    userRoles={this.props.user.roles}
                    attachments={this.props.attachments}
                    agreements={this.props.agreements}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    persons: state.persons,
    user: state.user,
    councilmeetings: state.councilmeetings,
    theses: state.theses,
    attachments: state.attachments,
    agreements: state.agreements
});

const mapDispatchToProps = dispatch => ({
    downloadAttachments(attachmentIds) {
        dispatch(downloadAttachments(attachmentIds))
    }
});

CouncilmeetingViewPage.propTypes = {
    user: personType.isRequired,
    theses: arrayOf(thesisType).isRequired,
    downloadAttachments: func.isRequired,
    agreements: arrayOf(agreementType).isRequired,
    attachments: arrayOf(attachmentType).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(CouncilmeetingViewPage);
