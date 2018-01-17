import React from 'react';
import { func } from 'prop-types';
import moment from 'moment/moment';
import DatePicker from 'react-datepicker';
import { councilmeetingType } from '../../util/types';

const dateFormat = 'DD.MM.YYYY';

const UpdateCouncilmeetingForm = (props) => {
    const {
        meeting,
        updateMeeting,
        updateDate,
        updateInstructorDeadline,
        updateStudentDeadline
    } = props;

    return (
        <div className="field">
            <h2 className="ui dividing header">
                Change meetings date {meeting.date ? moment(meeting.date).format(dateFormat) : ''}
            </h2>
            <p>
                Changing the deadline changes it for every thesis connected to the meeting.
                After deadline has passed no more theses can be added to the meeting.
            </p>
            <div className="ui form">
                <div className="fields">
                    <div className="field">
                        <label htmlFor="updateMeetingDate">Date</label>
                        <DatePicker
                            id="updateMeetingDate"
                            dateFormat={dateFormat}
                            selected={moment(meeting.date)}
                            onChange={updateDate}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="updateMeetingInstructorDeadline">Instructor deadline</label>
                        <DatePicker
                            id="updateMeetingInstructorDeadline"
                            dateFormat={dateFormat}
                            selected={moment(meeting.instructorDeadline)}
                            onChange={updateInstructorDeadline}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="updateStudentDeadline">Student deadline</label>
                        <DatePicker
                            id="updateMeetingStudentDeadline"
                            dateFormat={dateFormat}
                            selected={moment(meeting.studentDeadline)}
                            onChange={updateStudentDeadline}
                        />
                    </div>
                </div>
                <button className="ui green button" onClick={updateMeeting}>
                    Update
                </button>
            </div>
        </div>
    );
};

UpdateCouncilmeetingForm.propTypes = {
    meeting: councilmeetingType.isRequired,
    updateMeeting: func.isRequired,
    updateDate: func.isRequired,
    updateInstructorDeadline: func.isRequired,
    updateStudentDeadline: func.isRequired
};

export default UpdateCouncilmeetingForm;
