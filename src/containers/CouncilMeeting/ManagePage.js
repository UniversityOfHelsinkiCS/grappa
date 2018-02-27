import React, { Component } from 'react'
import { arrayOf, func } from 'prop-types'
import { Container, Header, Button, Radio, Confirm, Message } from 'semantic-ui-react'
import { connect } from 'react-redux'
import {
    getCouncilmeetings,
    deleteCouncilmeeting
} from './services/councilmeetingActions'

import { councilmeetingType } from '../../util/types'
import { isDateSameOrAfterAsToday, sortDates } from '../../util/common'
import CouncilMeetingTable from './components/CouncilMeetingTable'
import CouncilMeetingDetails from './components/CouncilMeetingDetails'
import { makeAndGetMeetingsWithProgramNames } from '../../selectors/councilMeetings'


class CouncilMeetingManagePage extends Component {
  static propTypes = {
      councilMeetings: arrayOf(councilmeetingType).isRequired,
      getCouncilMeetings: func.isRequired,
      deleteCouncilMeeting: func.isRequired
  }

  state = {
      showOld: false,
      openMeetingId: null,
      addNewMeeting: false,
      removableMeetingId: false,
      isConfirmRemove: false
  }

  componentDidMount() {
      this.props.getCouncilMeetings()
  }

  handleShowOldUnitsChange = () => {
      this.setState({ showOld: !this.state.showOld })
  };

  confirmDeleteMeeting = (removableMeetingId) => {
      this.setState({ isConfirmRemove: true, removableMeetingId })
  }

  cancelConfirm = () => {
      this.setState({ isConfirmRemove: false, removableMeetingId: undefined })
  }
  removeMeeting = () => {
      const { removableMeetingId } = this.state
      this.props.deleteCouncilMeeting(removableMeetingId)
      this.setState({ isConfirmRemove: false, removableMeetingId: undefined })
      this.closeMeetingRow()
  }

  openMeetingRow = (openMeetingId) => {
      this.setState({ openMeetingId, addNewMeeting: false })
  }

  closeMeetingRow = () => {
      this.setState({ openMeetingId: null, addNewMeeting: false })
  }

  addNewMeetingRow = () => {
      this.setState({ openMeetingId: null, addNewMeeting: true })
  }

  renderMeetingTables = () => {
      const { councilMeetings } = this.props
      const { showOld, openMeetingId, addNewMeeting } = this.state

      const components = []
      let meetings = showOld ? councilMeetings : councilMeetings.filter(m => isDateSameOrAfterAsToday(m.date))
      const isVisibleMeetings = meetings.length > 0

      if (!isVisibleMeetings) {
          components.push(
              <Message key="warning" warning style={{ width: '800px' }}>
                  <Message.Header>No scheduled meetings</Message.Header>
              </Message>
          )
      }

      meetings.sort((a, b) => sortDates(a.date, b.date))

      if (addNewMeeting || !isVisibleMeetings) {
          components.push(
              <CouncilMeetingDetails
                  key="new-meeting"
                  closeRowFn={this.closeMeetingRow}
                  newMeeting
              />)
      } else if (openMeetingId) {
          const indexOfOpen = meetings.findIndex(meeting => meeting.councilmeetingId === openMeetingId)
          const openMeeting = meetings[indexOfOpen]
          const meetingsRest = meetings.slice(indexOfOpen + 1)
          meetings = meetings.slice(0, indexOfOpen + 1)
          components.push(<CouncilMeetingDetails
              key="edit-meeting"
              meeting={openMeeting}
              closeRowFn={this.closeMeetingRow}
          />)
          components.push(<CouncilMeetingTable
              key="bottom-rows"
              meetings={meetingsRest}
              openRowFn={this.openMeetingRow}
              removeMeetingFn={this.confirmDeleteMeeting}
              attached="bottom"
              noHeader
          />)
      }

      if (!addNewMeeting && !openMeetingId && isVisibleMeetings) {
          components.push(
              <Button
                  key="add-btn"
                  positive
                  style={{ marginTop: '5px' }}
                  disabled={addNewMeeting}
                  icon="plus"
                  content="Schedule new meeting"
                  onClick={this.addNewMeetingRow}
              />
          )
      }

      return [<CouncilMeetingTable
          key="top-rows"
          meetings={meetings}
          openRowFn={this.openMeetingRow}
          removeMeetingFn={this.confirmDeleteMeeting}
          openMeetingId={openMeetingId}
          attached="top"
      />, ...components]
  }

  render() {
      const { showOld, isConfirmRemove } = this.state
      return (
          <Container text>
              <Header as="h2" dividing>Council Meetings</Header>
              <Radio
                  toggle
                  label="Show past meetings"
                  checked={showOld}
                  onChange={this.handleShowOldUnitsChange}
              />
              { this.renderMeetingTables() }
              <Confirm
                  open={isConfirmRemove}
                  onCancel={this.cancelConfirm}
                  onConfirm={this.removeMeeting}
                  header="Confirm remove meeting"
                  content="You can delete any meeting that has no theses linked to it.
                  Otherwise you have to remove/move them before you can delete the meeting."
                  cancelButton="Cancel"
                  confirmButton={<Button negative content="Delete meeting" />}
              />
          </Container>
      )
  }
}

const getCouncilMeetingsWithProgramNames = makeAndGetMeetingsWithProgramNames()

const mapStateToProps = state => ({
    councilMeetings: getCouncilMeetingsWithProgramNames(state)
})

const mapDispatchToProps = dispatch => ({
    getCouncilMeetings() {
        dispatch(getCouncilmeetings())
    },
    deleteCouncilMeeting(data) {
        dispatch(deleteCouncilmeeting(data))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(CouncilMeetingManagePage)
