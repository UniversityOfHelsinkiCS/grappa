import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Link } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';

import { connect } from 'react-redux';
import {
    getCouncilmeetings,
    saveCouncilmeeting,
    updateCouncilmeeting,
    deleteCouncilmeeting
} from './councilmeetingActions';

export class CouncilmeetingManagePage extends Component {
    constructor() {
        super();
        this.state = {
            newCouncilmeeting: { instructorDeadlineDays: 8, studentDeadlineDays: 8 },
            updateCouncilmeeting: {},
            shownDates: [],
            formattedDates: [],
            filteredDates: [],
            showOld: false
        };
    }

    initDates(props) {
        const councilmeetings = props.councilmeetings;
        if (!councilmeetings) {
            return;
        }
        const formattedDates = councilmeetings;
        const filteredDates = this.filterOldDates(councilmeetings);
        this.setState({
            shownDates: this.state.showOld ? formattedDates : filteredDates,
            formattedDates,
            filteredDates
        });
    }

    componentDidMount() {
        this.props.getCouncilmeetings();
        this.initDates(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.councilmeetings !== newProps.councilmeetings) {
            this.initDates(newProps);
        }
    }

    filterOldDates(meetings) {
        const today = new Date();
        return meetings.filter((meeting) => {
            const mdate = new Date(meeting.date);
            return mdate >= today;
        });
    }

  handleDateChange = (formname, name) => (date) => {
      const meeting = this.state[formname];
      meeting[name] = date;
      this.setState({ [formname]: meeting });
  }

  handleChange = (formname, name) => (event) => {
      const meeting = this.state[formname];
      meeting[name] = event.target.value;
      this.setState({ [formname]: meeting });
  }

  handleCheckboxChange = () => {
      this.setState({
          shownDates: !this.state.showOld ? this.state.formattedDates : this.state.filteredDates,
          showOld: !this.state.showOld
      });
  }

  saveMeeting = () => {
      // Since users only think about the difference but we want to save the date.
      const date = this.state.newCouncilmeeting.date;
      const instructorDeadline = moment(date).subtract(this.state.newCouncilmeeting.instructorDeadlineDays, 'days');
      const studentDeadline = moment(instructorDeadline).subtract(this.state.newCouncilmeeting.studentDeadlineDays, 'days');
      const councilmeeting = {
          date,
          instructorDeadline,
          studentDeadline
      };
      this.props.saveCouncilmeeting(councilmeeting);
  }

  updateMeeting = () => {
      this.props.updateCouncilmeeting(this.state.updateCouncilmeeting);
  }

  selectMeeting = meeting => () => {
      this.setState({ updateCouncilmeeting: meeting });
  }

  deleteMeeting = meeting => () => {
      this.props.deleteCouncilmeeting(meeting.councilmeetingId);
  }

  renderCreate(newCouncilmeeting) {
      return (
          <div className="field">
              <h2 className="ui dividing header">Create a councilmeeting date</h2>
              <p>
          There can be only one meeting per date. Deadline days is date minus days
          when the deadline is set at 23:59. Eg. if date is 25/11/2016 and instructor
          deadline days is 8 then the deadline is at 23:59 17/11/2016.
              </p>
              <div className="three fields">
                  <div className="field">
                      <label>Date</label>
                      <DatePicker
                          dateFormat="DD/MM/YYYY"
                          selected={newCouncilmeeting.date}
                          onChange={this.handleDateChange('newCouncilmeeting', 'date')}
                      />
                  </div>
                  <div className="field">
                      <label>Instructor deadline days</label>
                      <input
                          type="text"
                          value={newCouncilmeeting.instructorDeadlineDays}
                          onChange={this.handleChange('newCouncilmeeting', 'instructorDeadlineDays')}
                          placeholder="Days"
                      />
                  </div>
                  <div className="field">
                      <label>Student deadline days</label>
                      <input
                          type="text"
                          value={newCouncilmeeting.studentDeadlineDays}
                          onChange={this.handleChange('newCouncilmeeting', 'studentDeadlineDays')}
                          placeholder="Days"
                      />
                  </div>
                  <div className="field">
                      <label>&nbsp;</label>
                      <button className="ui primary button" onClick={this.saveMeeting}>
              Submit
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  renderEdit(updateCouncilmeeting) {
      return (
          <div className="field">
              <h2 className="ui dividing header">
          Change meetings date {updateCouncilmeeting.date
                      ? moment(updateCouncilmeeting.date).format('DD/MM/YYYY') : ''}
              </h2>
              <p>
          Changing the deadline changes it for every thesis connected to the meeting.
          After deadline has passed no more theses can be added to the meeting.
              </p>
              <div className="three fields">
                  <div className="field">
                      <label>Date</label>
                      <DatePicker
                          dateFormat="DD/MM/YYYY"
                          selected={moment(updateCouncilmeeting.date)}
                          onChange={this.handleDateChange('updateCouncilmeeting', 'date')}
                      />
                  </div>
                  <div className="field">
                      <label>Instructor deadline</label>
                      <DatePicker
                          dateFormat="DD/MM/YYYY"
                          selected={moment(updateCouncilmeeting.instructorDeadline)}
                          onChange={this.handleDateChange('updateCouncilmeeting', 'instructorDeadline')}
                      />
                  </div>
                  <div className="field">
                      <label>Student deadline</label>
                      <DatePicker
                          dateFormat="DD/MM/YYYY"
                          selected={moment(updateCouncilmeeting.studentDeadline)}
                          onChange={this.handleDateChange('updateCouncilmeeting', 'studentDeadline')}
                      />
                  </div>
                  <div className="field">
                      <label>&nbsp;</label>
                      <button className="ui green button" onClick={this.updateMeeting}>
              Update
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  renderList(shownDates) {
      return (
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
                  {shownDates.map((councilmeeting, index) =>
                      (<tr key={index} onClick={this.selectMeeting(councilmeeting)}>
                          <td>
                              <Link to={`/councilmeeting/${councilmeeting.id}`}>{moment(councilmeeting.date).format('DD/MM/YYYY')}</Link>
                          </td>
                          <td>
                              <Link to={`/councilmeeting/${councilmeeting.id}`}>{moment(councilmeeting.instructorDeadline).format('DD/MM/YYYY')}</Link>
                          </td>
                          <td>
                              <Link to={`/councilmeeting/${councilmeeting.id}`}>{moment(councilmeeting.studentDeadline).format('DD/MM/YYYY')}</Link>
                          </td>
                          <td>
                              <i className="write icon green" onClick={this.selectMeeting(councilmeeting)} />
                          </td>
                          <td>
                              <i className="remove icon red" onClick={this.deleteMeeting(councilmeeting)} />
                          </td>
                      </tr>)
                  )}
              </tbody>
          </table>
      );
  }
  /*
    renderPrintPersonView() {
      const { shownDates } = this.state;
      return (
        <div className="ui form">
          <div className="field">
            <h2 className="ui dividing header">Upcoming councilmeetings</h2>
            <p>
              Instructor deadline is the last date when new theses can be accepted to the meeting.
              Otherwise they are automatically moved to the next meeting.
              Student deadline is the last date when students can upload their abstract to Grappa.
            </p>
            <div className="ui checkbox">
              <input
                type="checkbox"
                checked={this.state.showOld ? "true" : ""}
                onChange={this.handleCheckboxChange.bind(this, "toggleShowOld")}
              />
              <label>Show also past dates</label>
            </div>
            <table className="ui celled table">
              <thead>
                <tr>
                  <th onClick={this.handleClick.bind(this, "sort", "date")}>Date</th>
                  <th onClick={this.handleClick.bind(this, "sort", "instructorDeadline")}>Instructor deadline</th>
                  <th onClick={this.handleClick.bind(this, "sort", "studentDeadline")}>Student deadline</th>
                </tr>
              </thead>
              <tbody>
                { shownDates.map((item, index) =>
                  <tr key={index} >
                    <td>
                      <Link to={`/councilmeeting/${item.id}`}>{item.date.format("DD/MM/YYYY")}</Link>
                    </td>
                    <td>
                      <Link to={`/councilmeeting/${item.id}`}>{item.instructorDeadline.format("DD/MM/YYYY")}</Link>
                    </td>
                    <td>
                      <Link to={`/councilmeeting/${item.id}`}>{item.studentDeadline.format("DD/MM/YYYY")}</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  */
  renderAdminView() {
      return (
          <div className="ui form">
              <div className="ui two fields">
                  <div className="field">
                      {this.renderCreate(this.state.newCouncilmeeting)}
                      {this.renderEdit(this.state.updateCouncilmeeting)}
                  </div>
                  <div className="field">
                      <h2 className="ui dividing header">Upcoming councilmeetings</h2>
                      <p>
              You can delete any meeting that has no theses linked to it.
              Otherwise you have to remove/move them before you can delete a meeting.
                      </p>
                      <div className="ui checkbox">
                          <input
                              type="checkbox"
                              checked={this.state.showOld ? 'true' : ''}
                              onChange={this.handleCheckboxChange}
                          />
                          <label>Show also past dates</label>
                      </div>
                      {this.renderList(this.state.shownDates)}
                  </div>
              </div>
          </div>
      );
  }

  render() {
      // return this.renderPrintPersonView();
      return this.renderAdminView();
  }
}

const mapStateToProps = state => ({
    councilmeetings: state.councilmeetings
});

const mapDispatchToProps = dispatch => ({
    getCouncilmeetings() {
        dispatch(getCouncilmeetings());
    },
    saveCouncilmeeting(data) {
        dispatch(saveCouncilmeeting(data));
    },
    updateCouncilmeeting(data) {
        dispatch(updateCouncilmeeting(data));
    },
    deleteCouncilmeeting(data) {
        dispatch(deleteCouncilmeeting(data));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CouncilmeetingManagePage);
