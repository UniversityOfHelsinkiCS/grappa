import React from 'react'
import { connect } from 'react-redux'
import { arrayOf, number, bool, func } from 'prop-types'
import { Checkbox, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { thesisType, councilmeetingType } from '../../../util/types'
import { formatDisplayDate } from '../../../util/common'
import InEthesisIcon from './InEthesisIcon'
import { eThesisRoles, printedForMeetingRoles } from '../../../util/constants'

const renderStatusIcons = field =>
    (field ? <Icon color="green" name="checkmark" /> : <Icon color="red" name="remove" />)

const getAuthorName = (thesis) => {
    if (thesis.authors) {
        return thesis.authors.map((author) => {
            if (!author) return 'No name'
            return author.lastname && author.firstname ? `${author.lastname}, ${author.firstname}` : author.email
        })
    }
    return []
}

// This is a pretty basic check and could be improved.
const checkGraders = graders => graders.filter(grader => grader.roleRequestId).length < 1

const ThesisListRow = ({
    councilmeeting,
    thesis,
    showButtons,
    selectable,
    toggleThesis,
    selectedThesesIds,
    onDelete,

    canSeeEthesis,
    canSeePrintedForMeeting,
    canDeleteThesis
}) => {
    const authorName = getAuthorName(thesis)
    return (
        <tr>
            {selectable || showButtons ? (
                <td>
                    <Checkbox
                        checked={selectedThesesIds.includes(thesis.thesisId)}
                        onChange={toggleThesis(thesis)}
                        fitted
                    />
                </td>)
                : null}
            <td><Link to={`/thesis/${thesis.thesisId}`}>{thesis.title}</Link></td>
            <td>
                {authorName.join(' & ')}
            </td>
            <td>{councilmeeting ? formatDisplayDate(councilmeeting.date) : null}</td>
            <td>{renderStatusIcons(!authorName.some(author => author.includes('@')))}</td>
            <td>{renderStatusIcons(checkGraders(thesis.graders))}</td>
            {canSeePrintedForMeeting ? <td>{renderStatusIcons(thesis.printDone)}</td> : null}
            {canSeeEthesis ? <td><InEthesisIcon authors={thesis.authors} title={thesis.title} /></td> : null}
            {canDeleteThesis ?
                <td>
                    <button className="ui button red" onClick={onDelete}>
                        <Icon
                            color="white"
                            name="trash"
                            size="large"
                            style={{ margin: 0 }}
                        />
                    </button>
                </td>
                : null}
        </tr>
    )
}

ThesisListRow.propTypes = {
    councilmeeting: councilmeetingType,
    thesis: thesisType.isRequired,
    toggleThesis: func.isRequired,
    showButtons: bool.isRequired,
    selectable: bool.isRequired,
    selectedThesesIds: arrayOf(number).isRequired,
    onDelete: func.isRequired
}

const mapStateToProps = state => ({
    canSeePrintedForMeeting: Boolean(
        ((state.user || {}).roles || [])
            .find(role => printedForMeetingRoles.includes(role.role)
            )),
    canSeeEthesis: ((state.user || {}).roles || []).find(role => eThesisRoles.includes(role.role)),
    canDeleteThesis: Boolean(
        ((state.user || {}).roles || [])
            .find(role => role.role === 'admin')
    )
})

export default connect(mapStateToProps)(ThesisListRow)
