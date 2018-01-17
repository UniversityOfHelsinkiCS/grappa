import React from 'react';
import { func } from 'prop-types';
import DatePicker from 'react-datepicker';
import { councilmeetingType } from '../../util/types';

const dateFormat = 'DD/MM/YYYY';

const NewCouncilmeetingForm = (props) => {
    const {
        newCouncilmeeting,
        handleDateChange,
        handleInstructorChange,
        handleStudentChange,
        saveMeeting
    } = props;

    return (
        <div className="field">
            <h2 className="ui dividing header">Create a councilmeeting date</h2>
            <p>
                There can be only one meeting per date. Deadline days is date minus days
                when the deadline is set at 23:59. Eg. if date is 25/11/2016 and instructor
                deadline days is 8 then the deadline is at 23:59 17/11/2016.
            </p>
            <div className="ui form">
                <div className="three fields">
                    <div className="field">
                        <label htmlFor="newCouncilmeetingDate">Date</label>
                        <DatePicker
                            id="newCouncilmeetingDate"
                            dateFormat={dateFormat}
                            selected={newCouncilmeeting.date}
                            onChange={handleDateChange}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="newCouncilmeetingInstructorDeadlineDays">Instructor deadline days</label>
                        <input
                            id="newCouncilmeetingInstructorDeadlineDays"
                            type="text"
                            value={newCouncilmeeting.instructorDeadlineDays}
                            onChange={handleInstructorChange}
                            placeholder="Days"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="newCouncilmeetingStudentDeadlineDays">Student deadline days</label>
                        <input
                            id="newCouncilmeetingStudentDeadlineDays"
                            type="text"
                            value={newCouncilmeeting.studentDeadlineDays}
                            onChange={handleStudentChange}
                            placeholder="Days"
                        />
                    </div>
                </div>
                <button className="ui primary button" onClick={saveMeeting}>
                    Submit
                </button>
            </div>
        </div>
    );
};

NewCouncilmeetingForm.propTypes = {
    newCouncilmeeting: councilmeetingType.isRequired,
    handleDateChange: func.isRequired,
    handleInstructorChange: func.isRequired,
    handleStudentChange: func.isRequired,
    saveMeeting: func.isRequired
};

export default NewCouncilmeetingForm;
