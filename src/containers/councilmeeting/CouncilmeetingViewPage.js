import React, { Component } from 'react';
import { func } from 'prop-types';
import moment from 'moment';

import { connect } from 'react-redux';
import { updateThesis, getTheses, downloadTheses, moveTheses } from '../thesis/thesisActions';
import { getCouncilmeetings } from './councilmeetingActions';
import { sendReminder } from '../email/emailActions';
import { personType } from '../../util/types';

import ThesisList from '../../components/thesis/ThesisList'

export class CouncilmeetingViewPage extends Component {
    constructor() {
        super();
        this.state = {
            index: '',
            previousMeeting: undefined,
            currentMeeting: undefined,
            nextMeeting: undefined,
            theses: [],
        };
    }

    componentDidMount() {
        this.props.getCouncilmeetings();
        this.initState(this.props);
    }

    componentWillReceiveProps(newProps) {
        // if on different page reset also selected theses
        if (this.props.theses) {
            // have to sort stuff as it is always in disorder
            const currentTheses = this.props.theses.sort((a, b) => a.id - b.id)
            const newTheses = newProps.theses.sort((a, b) => a.id - b.id)
            if (currentTheses === newTheses) {
                return;
            }
        }
        this.initState(newProps);
    }

    //TODO: Remove copypaste
    initState(props) {
        if (!props.councilmeetings) return;
        const foundIndex = this.findIndexFromProps(props);
        const previousMeeting = foundIndex > 0 ? props.councilmeetings[foundIndex - 1] : undefined;
        const currentMeeting = props.councilmeetings[foundIndex];
        const nextMeeting = foundIndex === props.councilmeetings.length - 1 ? undefined : props.councilmeetings[foundIndex + 1];
        const theses = currentMeeting & props.theses ? this.filterThesesByMeeting(props.theses, currentMeeting) : [];
        this.setState({
            index: foundIndex,
            previousMeeting,
            currentMeeting,
            nextMeeting,
            theses,
        });
    }

    incrementIndex(forward) {
        if (!this.props.councilmeetings) return;
        const index = forward ? this.state.index + 1 : this.state.index - 1;
        const previousMeeting = index > 0 ? this.props.councilmeetings[index - 1] : undefined;
        const currentMeeting = this.props.councilmeetings[index];
        const nextMeeting = index === this.props.councilmeetings.length - 1 ? undefined : this.props.councilmeetings[index + 1];
        const theses = currentMeeting & this.props.theses ? this.filterThesesByMeeting(this.props.theses, currentMeeting) : [];
        this.setState({
            index,
            previousMeeting,
            currentMeeting,
            nextMeeting,
            theses,
            selectedTheses: [],
            searchedTheses: [],
        });
    }

    filterThesesByMeeting(theses, meeting) {
        return theses.filter(thesis => thesis.councilmeetingId === meeting.councilmeetingId);
    }

    findIndexFromProps(props) {
        let foundIndex;
        if (props.match.params && props.match.params.id !== 'next') {
            let cmID;
            try {
                cmID = parseInt(props.match.params.id, 10);
            } catch (e) {
                return;
            }
            foundIndex = props.councilmeetings.findIndex(meeting => meeting.councilmeetingId === cmID);
        } else {
            foundIndex = this.findNextMeeting(new Date(), props.councilmeetings);
        }
        return foundIndex;
    }

    /**
     * Finds the index of closest date including today from sorted list of CouncilMeetings
     */
    findNextMeeting(starting, meetings = []) {
        return meetings.findIndex(meeting => {
            const date = new Date(meeting.date);
            return (date >= starting || date.toDateString() === starting.toDateString())
        });
    }

    //TODO: Fix switch case
    changeMeeting = (where) => () => {
        switch (where) {
            case 'previous':
                this.props.history.push('/councilmeeting/' + this.state.previousMeeting.councilmeetingId)
                this.incrementIndex(false);
                return;
            case 'next':
                this.props.history.push('/councilmeeting/' + this.state.nextMeeting.councilmeetingId)
                this.incrementIndex(true);
                return;
            default:
                return;
        }
    }

    moveToPreviousMeeting = (thesisIds) => {
        const meeting = this.state.previousMeeting;
        this.props.moveTheses({
            thesisIds,
            councilmeetingId: meeting.councilmeetingId || 0,
        });
    }

    moveToNextMeeting = (thesisIds) => {
        const meeting = this.state.nextMeeting;
        this.props.moveTheses({
            thesisIds,
            councilmeetingId: meeting.councilmeetingId || 0,
        });
    }

    render() {
        return (
            <div>
                <div>
                    {this.state.previousMeeting !== undefined ?
                        <button className="ui button blue" onClick={this.changeMeeting('previous')}>Previous</button>
                        :
                        <span></span>
                    }
                    {this.state.nextMeeting !== undefined ?
                        <button className="ui button blue" onClick={this.changeMeeting('next')}>Next</button>
                        :
                        <span></span>
                    }
                    <h2 className="ui dividing header" style={{ 'marginTop': '10px' }}>
                        <span>
                            {this.state.currentMeeting !== undefined ?
                                'Councilmeeting of ' + moment(this.state.currentMeeting.date).format('DD/MM/YYYY')
                                :
                                'No Councilmeeting found'
                            }
                        </span>
                    </h2>
                </div>
                <ThesisList
                    theses={this.state.theses}
                    userRoles={this.props.user.roles}
                    moveToPreviousMeeting={this.moveToPreviousMeeting}
                    moveToNextMeeting={this.moveToNextMeeting}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        councilmeetings: state.councilmeetings,
        theses: state.theses,
    };
};

const mapDispatchToProps = (dispatch) => ({
    getCouncilmeetings() {
        dispatch(getCouncilmeetings());
    },
    updateThesis(id, thesis) {
        dispatch(updateThesis(id, thesis));
    },
    getTheses() {
        dispatch(getTheses());
    },
    downloadTheses(theses) {
        dispatch(downloadTheses(theses));
    },
    moveTheses(data) {
        dispatch(moveTheses(data));
    },
});

CouncilmeetingViewPage.propTypes = {
    getCouncilmeetings: func.isRequired,
    updateThesis: func.isRequired,
    getTheses: func.isRequired,
    moveTheses: func.isRequired,
    user: personType.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(CouncilmeetingViewPage);