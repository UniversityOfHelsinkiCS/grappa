import React from 'react'
import { arrayOf, func, string, number, bool, shape, object } from 'prop-types'
import { Table, Dropdown } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'

import { formatDisplayDate } from '../../../util/common'
import { councilmeetingType } from '../../../util/types'

const getTableHeaders = () => {
    const headers = ['', 'Date', 'Instructor deadline', 'Student deadline', 'Programmes', 'Controls']
    return (
        <Table.Header>
            <Table.Row>
                {
                    headers.map(header => (
                        <Table.HeaderCell key={header} textAlign="center">
                            {header}
                        </Table.HeaderCell>
                    ))
                }
            </Table.Row>
        </Table.Header>
    )
}

const getControlsDropDown = (meetingId, openRowFn, removeMeetingFn) => (
    <Dropdown icon="ellipsis vertical">
        <Dropdown.Menu style={{ right: '0', left: 'auto' }}>
            <Dropdown.Item
                icon="pencil"
                text="Edit"
                onClick={() => openRowFn(meetingId)}
            />
            <Dropdown.Item
                icon="trash outline"
                text="Remove"
                onClick={() => removeMeetingFn(meetingId)}
            />
        </Dropdown.Menu>
    </Dropdown>
)

const getTableBody = (props) => {
    const { meetings, openMeetingId, openRowFn, removeMeetingFn, history } = props

    return (
        <Table.Body>
            {
                meetings.map((meeting) => {
                    const { councilmeetingId, date, instructorDeadline, studentDeadline, programmes } = meeting
                    if (councilmeetingId === openMeetingId) {
                        return null
                    }
                    const openMeeting = () => history.push(`/councilmeeting/${councilmeetingId}`)

                    return (
                        <Table.Row
                            key={councilmeetingId}
                            style={{ cursor: 'pointer' }}
                            selectable="true"
                        >
                            <Table.Cell
                                textAlign="left"
                                icon="external"
                                onClick={() => openMeeting()}
                            />
                            <Table.Cell textAlign="center" onClick={openMeeting}>
                                {formatDisplayDate(date)}
                            </Table.Cell>
                            <Table.Cell textAlign="center" onClick={openMeeting}>
                                {formatDisplayDate(instructorDeadline)}
                            </Table.Cell>
                            <Table.Cell textAlign="center" onClick={openMeeting}>
                                {formatDisplayDate(studentDeadline)}
                            </Table.Cell>
                            <Table.Cell textAlign="left" singleLine onClick={openMeeting}>
                                {programmes.map(program =>
                                    (program ?
                                        (<div key={program.programmeId}>{program.name}</div>)
                                        : null)
                                )}
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                                {getControlsDropDown(councilmeetingId, openRowFn, removeMeetingFn)}
                            </Table.Cell>
                        </Table.Row>
                    )
                })
            }
        </Table.Body>
    )
}

getTableBody.propTypes = {
    meetings: arrayOf(councilmeetingType).isRequired,
    openRowFn: func.isRequired,
    removeMeetingFn: func.isRequired,
    openMeetingId: number.isRequired,
    history: shape(object).isRequired
}

getTableBody.defaultProps = {
    openMeetingId: null
}


const CouncilMeetingTable = (props) => {
    const { attached, meetings, noHeader } = props
    if (!meetings || meetings.length === 0) {
        return (null)
    }
    return (
        <Table selectable unstackable attached={attached} style={{ minWidth: '800px' }} >
            { !noHeader && getTableHeaders() }
            { getTableBody(props) }
        </Table>)
}

CouncilMeetingTable.propTypes = {
    meetings: arrayOf(councilmeetingType).isRequired,
    attached: string,
    noHeader: bool
}

CouncilMeetingTable.defaultProps = {
    attached: '',
    noHeader: false
}

export default withRouter(CouncilMeetingTable)
