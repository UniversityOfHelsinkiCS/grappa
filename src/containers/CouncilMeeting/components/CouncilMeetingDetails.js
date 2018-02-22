import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Segment, Form, Button, Dropdown, Radio } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { councilmeetingType, programmeType } from '../../../util/types'
import { DISPLAY_DATE_FORMAT } from '../../../util/common'
import { arrayOf } from 'prop-types'

const INSTRUCTOR_DAYS_DEFAULT = 8
const STUDENT_DAYS_DEFAULT = 6

class CouncilMeetingDetails extends Component {
  static propTypes = {
      programmes: arrayOf(programmeType).isRequired,
      meeting: councilmeetingType

  }
  static defaultProps = {
      meeting: {}
  }
  state = {
      meeting: {},
      useOldUnits: false
  }

  componentDidMount() {
      this.setState({ meeting: this.props.meeting })
  }

  onMeetingDateChange = (d) => {
      const { meeting } = this.state
      const date = moment(d)
      const instructorDeadline = moment(d).subtract(INSTRUCTOR_DAYS_DEFAULT, 'days')
      const studentDeadline = moment(d).subtract(STUDENT_DAYS_DEFAULT, 'days')

      this.setState({ meeting: { ...meeting, date, instructorDeadline, studentDeadline } })
  }

  onUseOldUnitsChange = () => this.setState({ useOldUnits: !this.state.useOldUnits })

  renderDateInputGroup = () => {
      const { date, instructorDeadline, studentDeadline } = this.state.meeting
      return (
          <Form.Group>
              <Form.Input
                  control={DatePicker}
                  placeholderText="dd.mm.yyyy"
                  dateFormat={DISPLAY_DATE_FORMAT}
                  selected={moment(date)}
                  fluid
                  label="Date"
                  onChange={d => this.onMeetingDateChange(d)}
              />
              <Form.Input
                  control={DatePicker}
                  placeholderText="dd.mm.yyyy"
                  dateFormat={DISPLAY_DATE_FORMAT}
                  selected={moment(instructorDeadline)}
                  fluid
                  label="Instructor deadline"
                  disabled
              />
              <Form.Input
                  control={DatePicker}
                  placeholderText="dd.mm.yyyy"
                  dateFormat={DISPLAY_DATE_FORMAT}
                  selected={moment(studentDeadline)}
                  fluid
                  label="Student deadline"
                  disabled
              />
          </Form.Group>
      )
  }

  renderProgrammeSelectGroup = () => {
      const { programmes } = this.props
      const { useOldUnits } = this.state

      return (
          <Form.Group>
              <Form.Field width="6">
                  <label>Units</label>
                  <Dropdown
                      placeholder="Select units"
                      multiple
                      search
                      fluid
                      selection
                      noResultsMessage="No units found."
                      options={programmes}
                  />
              </Form.Field>
              <Form.Field>
                  <label>Use old units</label>
                  <Radio
                      toggle
                      style={{ marginTop: '10px' }}
                      label={useOldUnits ? 'On' : 'Off'}
                      checked={useOldUnits}
                      onChange={this.onUseOldUnitsChange}
                  />
              </Form.Field>
          </Form.Group>
      )
  }

  renderInputForm = () => (
      <Form className="attached fluid">
          { this.renderDateInputGroup() }
          { this.renderProgrammeSelectGroup() }
          <Button color="blue">Submit</Button>
      </Form>
  )


  render() {
      return (
          <Segment attached clearing >
              { this.renderInputForm() }
          </Segment>
      )
  }
}

const mapStateToProps = ({ programmes }) => ({
    // TODO: move to middleware
    programmes: programmes.map(p => (
        {
            key: p.programmeId, value: p.programmeId, text: p.name
        }))
})


export default connect(mapStateToProps)(CouncilMeetingDetails)
