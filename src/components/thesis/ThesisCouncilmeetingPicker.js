import React, { Component } from 'react';
import { number, func, arrayOf } from 'prop-types';
import moment from 'moment';
import { councilmeetingType } from '../../util/types';

export default class ThesisCouncilmeetingPicker extends Component {

    formatMeetings = () => {
        const { programmeId, councilmeetings } = this.props;

        if (!councilmeetings)
            return [];

        const meetings = councilmeetings.filter((meeting) => {
            return moment(meeting.instructorDeadline).isAfter(moment()) && meeting.programmeId === programmeId;
        }).map(meeting => ({
            id: meeting.councilmeetingId,
            content: `${moment(meeting.date).format('DD.MM.YYYY')} Deadline: ${moment(meeting.instructorDeadline).format('HH:mm DD.MM.YYYY')}`
        }));

        return [{ id: '', content: 'Select Date' }, ...meetings];
    };

    chooseMeeting = (event) => {
        if (event.target.value) {
            this.props.sendChange('councilmeetingId', event.target.value);
        }
    };

    render() {
        const chosenMeeting = this.props.chosenMeetingId !== null ? this.props.chosenMeetingId : '';

        return (
            <div>
                <h3 className="ui dividing header">Choose the Councilmeeting date</h3>
                <p>
                    Deadline tells when Grappa stops accepting new theses for that date. If the deadline has passed
                    you have to either contact admin or submit thesis to another Councilmeeting.
                </p>
                <select
                    className="ui fluid search dropdown"
                    onChange={this.chooseMeeting}
                    value={chosenMeeting}
                >
                    {this.formatMeetings().map(meeting => (
                        <option key={meeting.id} value={meeting.id} >
                            {meeting.content}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
}

ThesisCouncilmeetingPicker.propTypes = {
    councilmeetings: arrayOf(councilmeetingType).isRequired,
    chosenMeetingId: number,
    sendChange: func.isRequired,
    programmeId: number
};

ThesisCouncilmeetingPicker.defaultProps = {
    programmeId: undefined,
    chosenMeetingId: undefined
};
