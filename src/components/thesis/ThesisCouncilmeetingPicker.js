import React, { Component } from "react";

import moment from "moment";

export default class ThesisCouncilmeetingPicker extends Component {
    constructor() {
        super();
        this.state = {
            filteredMeetings: [{ id: "", content: "Select Date" }],
        }
    }

    componentDidMount() {
        if (this.props.councilMeetings) {
            this.setState({ filteredMeetings: [{ id: "", content: "Select Date" }, ...this.formatMeetings(this.props.councilMeetings)] });
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.councilMeetings) {
            const formatted = this.formatMeetings(newProps.councilMeetings);
            this.setState({ filteredMeetings: [{ id: "", content: "Select Date" }, ...formatted] });
        }
    }

    formatMeetings = (councilmeetings) => {
        const today = new Date();
        return councilmeetings.filter(meeting => {
            const mdate = new Date(meeting.date);
            return mdate >= today;
        }).map(meeting => {
            return {
                id: meeting.id,
                content: `${moment(meeting.date).format("DD/MM/YYYY")} Deadline: ${moment(meeting.instructorDeadline).format("HH:mm DD/MM/YYYY")}`,
            };
        });
    }

    chooseMeeting = (event) => {
        const chosenMeetingId = event.target.value;
        if (chosenMeetingId) {
            this.props.sendChange("councilmeetingId", chosenMeetingId);
        }
    }

    render() {
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
                    value={this.props.chosenMeetingId}>
                    {this.state.filteredMeetings.map((meeting, index) =>
                        <option key={index} value={meeting.id} >
                            {meeting.content}
                        </option>
                    )}
                </select>
            </div>
        );
    }
}