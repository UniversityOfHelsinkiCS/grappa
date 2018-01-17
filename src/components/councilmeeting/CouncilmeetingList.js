import React from 'react';
import { arrayOf, func, bool } from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';
import { councilmeetingType } from '../../util/types';

const dateFormat = 'DD.MM.YYYY';

function filterMeetings(meetings, showOld) {
    if (!showOld) {
        const today = moment();
        return meetings.filter(meeting => moment(meeting.date).isAfter(today));
    }

    return meetings;
}

const CouncilmeetingList = ({ meetings, selectMeeting, deleteMeeting, showOld }) => (
    <table className="ui celled table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Instructor deadline</th>
                <th>Student deadline</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody>
            {filterMeetings(meetings, showOld).map(councilmeeting => (
                <tr key={councilmeeting.councilmeetingId} onClick={() => selectMeeting(councilmeeting)}>
                    <td>
                        <Link to={`/councilmeeting/${councilmeeting.councilmeetingId}`}>
                            {moment(councilmeeting.date).format(dateFormat)}
                        </Link>
                    </td>
                    <td>
                        <Link to={`/councilmeeting/${councilmeeting.councilmeetingId}`}>
                            {moment(councilmeeting.instructorDeadline).format(dateFormat)}
                        </Link>
                    </td>
                    <td>
                        <Link to={`/councilmeeting/${councilmeeting.councilmeetingId}`}>
                            {moment(councilmeeting.studentDeadline).format(dateFormat)}
                        </Link>
                    </td>
                    <td>
                        <i className="write icon green" onClick={() => selectMeeting(councilmeeting)} />
                    </td>
                    <td>
                        <i className="remove icon red" onClick={() => deleteMeeting(councilmeeting)} />
                    </td>
                </tr>)
            )}
        </tbody>
    </table>
);

CouncilmeetingList.propTypes = {
    meetings: arrayOf(councilmeetingType).isRequired,
    selectMeeting: func.isRequired,
    deleteMeeting: func.isRequired,
    showOld: bool.isRequired
};

export default CouncilmeetingList;
