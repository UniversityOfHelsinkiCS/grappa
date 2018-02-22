import React, { Component } from 'react'
import { arrayOf, func } from 'prop-types'
import 'react-datepicker/dist/react-datepicker.css'
import { Container, Header, Button, Radio } from 'semantic-ui-react'
import { connect } from 'react-redux'
import {
    getCouncilmeetings,
    saveCouncilmeeting,
    updateCouncilmeeting,
    deleteCouncilmeeting
} from './services/councilmeetingActions'
import NewCouncilmeetingForm from './components/NewCouncilmeetingForm'
import UpdateCouncilmeetingForm from './components/UpdateCouncilmeetingForm'
import CouncilmeetingList from './components/CouncilmeetingList'
import { councilmeetingType, programmeType } from '../../util/types'
import { isDateAfterNow, sortDates } from '../../util/common'
import CouncilMeetingTable from './components/CouncilMeetingTable'
import CouncilMeetingDetails from './components/CouncilMeetingDetails'


class CouncilMeetingManagePage extends Component {
  static propTypes = {
      councilmeetings: arrayOf(councilmeetingType).isRequired,
      getCouncilMeetings: func.isRequired,
      saveCouncilMeeting: func.isRequired,
      updateCouncilMeeting: func.isRequired,
      deleteCouncilMeeting: func.isRequired,
      programmes: arrayOf(programmeType).isRequired
  }

  state = {
      newCouncilMeeting: { instructorDeadlineDays: 8, studentDeadlineDays: 8 },
      updateCouncilMeeting: {},
      showOld: false,
      openMeetingId: null,
      addNewMeeting: false
  }

  componentDidMount() {
      this.props.getCouncilMeetings()
  }

  handleDateChange = (formname, name) => (date) => {
      const meeting = this.state[formname]
      meeting[name] = date
      this.setState({ [formname]: meeting })
  };

  handleChange = (formname, name) => (event) => {
      const meeting = this.state[formname]
      meeting[name] = event.target.value
      this.setState({ [formname]: meeting })
  };

  handleCheckboxChange = () => {
      this.setState({
          shownDates: !this.state.showOld ? this.state.formattedDates : this.state.filteredDates,
          showOld: !this.state.showOld
      })
  };

  saveMeeting = meeting => this.props.saveCouncilMeeting(meeting);
  updateMeeting = (meeting) => {
      this.props.updateCouncilMeeting(meeting)
      this.setState({ updateCouncilMeeting: {} })
  };
  selectMeeting = meeting => this.setState({ updateCouncilMeeting: meeting });
  deleteMeeting = meeting => this.props.deleteCouncilMeeting(meeting.councilmeetingId);

  openMeetingRow = (openMeetingId) => {
      this.setState({ openMeetingId, addNewMeeting: false })
  }

  closeMeetingRow = () => {
      this.setState({ openMeetingId: null })
  }

  addNewMeetingRow = () => {
      this.setState({ addNewMeeting: true, openMeetingId: null })
  }

  renderMeetingTables = () => {
      const { councilmeetings } = this.props
      const { showOld, openMeetingId, addNewMeeting } = this.state

      const components = []
      let meetings = showOld ? councilmeetings : councilmeetings.filter(m => isDateAfterNow(m.date))
      meetings.sort((a, b) => sortDates(a.date, b.date))
      if (addNewMeeting) {
          components.push(<CouncilMeetingDetails />)
      } else if (openMeetingId) {
          const indexOfOpen = meetings.findIndex(meeting => meeting.councilmeetingId === openMeetingId) + 1
          const openMeeting = meetings[indexOfOpen]
          const meetingsRest = meetings.slice(indexOfOpen)
          meetings = meetings.slice(0, indexOfOpen)
          components.push(<CouncilMeetingDetails meeting={openMeeting} />)
          components.push(<CouncilMeetingTable
              meetings={meetingsRest}
              openRowFn={this.openMeetingRow}
              attached="bottom"
              noHeader
          />)
      }
      return [<CouncilMeetingTable
          meetings={meetings}
          openRowFn={this.openMeetingRow}
          closeRowFn={this.closeMeetingRow}
          openMeetingId={openMeetingId}
          attached="top"
      />, ...components]
  }

  render() {
      const { showOld, addNewMeeting } = this.state
      return (
          <Container text>
              <Header as="h2" dividing>Council Meetings</Header>
              <Radio
                  toggle
                  label="Show past meetings"
                  checked={showOld}
                  onChange={this.handleCheckboxChange}
              />

              { this.renderMeetingTables() }
              <Button
                  style={{ marginTop: '5px' }}
                  disabled={addNewMeeting}
                  icon="plus"
                  content="Schedule meeting"
                  onClick={this.addNewMeetingRow}
              />
              <div className="ui form">
                  <div className="ui two fields">
                      <div className="field">
                          <NewCouncilmeetingForm
                              saveMeeting={this.saveMeeting}
                              programmes={this.props.programmes}
                          />
                          <UpdateCouncilmeetingForm
                              meeting={this.state.updateCouncilMeeting}
                              updateMeeting={this.updateMeeting}
                              programmes={this.props.programmes}
                          />
                      </div>
                      <div className="field">
                          <h2 className="ui dividing header">Upcoming councilmeetings</h2>
                          <p>
                You can delete any meeting that has no theses linked to it.
                Otherwise you have to remove/move them before you can delete a meeting.
                          </p>
                          <div className="ui checkbox">
                              <input
                                  id="showPastDates"
                                  type="checkbox"
                                  checked={this.state.showOld ? 'true' : ''}
                                  onChange={this.handleCheckboxChange}
                              />
                              <label htmlFor="showPastDates">Show also past dates</label>
                          </div>
                          <CouncilmeetingList
                              meetings={this.props.councilmeetings}
                              selectMeeting={this.selectMeeting}
                              deleteMeeting={this.deleteMeeting}
                              showOld={this.state.showOld}
                              programmes={this.props.programmes}
                          />
                      </div>
                  </div>
              </div>
          </Container>
      )
  }
}

const mapStateToProps = ({ councilmeetings, programmes }) => ({
    councilmeetings,
    programmes
})

const mapDispatchToProps = dispatch => ({
    getCouncilMeetings() {
        dispatch(getCouncilmeetings())
    },
    saveCouncilMeeting(data) {
        dispatch(saveCouncilmeeting(data))
    },
    updateCouncilMeeting(data) {
        dispatch(updateCouncilmeeting(data))
    },
    deleteCouncilMeeting(data) {
        dispatch(deleteCouncilmeeting(data))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(CouncilMeetingManagePage)
