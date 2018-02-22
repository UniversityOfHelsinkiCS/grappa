import React from 'react'
import { arrayOf, func, string, number, bool } from 'prop-types'
import { Table, Icon } from 'semantic-ui-react'
import { formatDisplayDate } from '../../../util/common'
import { councilmeetingType } from '../../../util/types'


const getTableHeaders = () => {
    const headers = ['', 'Date', 'Instructor deadline', 'Student deadline', 'Programmes']
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

const getOpenMeetingRow = (closeRowFn, meetingId) => (
    <Table.Row
        active
        key={meetingId}
        style={{ cursor: 'pointer' }}
    >
        <Table.Cell textAlign="left" colSpan="4" onClick={closeRowFn} icon="minus" />
        <Table.Cell textAlign="right">
            <Icon size="large" name="pencil" style={{ marginLeft: '15px' }} />
            <Icon size="large" name="trash outline" style={{ marginLeft: '15px' }} />
        </Table.Cell>
    </Table.Row>
)

const getTableBody = (props) => {
    const { meetings, openRowFn, closeRowFn, openMeetingId } = props
    return (
        <Table.Body>
            {
                meetings.map((meeting) => {
                    const { councilmeetingId, date, instructorDeadLine, studentDeadline, programmes } = meeting
                    if (councilmeetingId === openMeetingId) {
                        return getOpenMeetingRow(closeRowFn, councilmeetingId)
                    }
                    return (
                        <Table.Row
                            key={councilmeetingId}
                            onClick={() => openRowFn(councilmeetingId)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Table.Cell textAlign="left" icon="plus" />
                            <Table.Cell textAlign="center">
                                {formatDisplayDate(date)}
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                                {formatDisplayDate(instructorDeadLine)}
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                                {formatDisplayDate(studentDeadline)}
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                                {programmes}
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
    openMeetingId: number.isRequired,
    closeRowFn: func
}

getTableBody.defaultProps = {
    openMeetingId: null,
    closeRowFn: () => null
}


const CouncilMeetingTable = (props) => {
    const { attached, meetings, noHeader } = props
    if (!meetings || meetings.length === 0) {
        return (null)
    }

    return (
        <Table selectable unstackable attached={attached}>
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

export default CouncilMeetingTable
