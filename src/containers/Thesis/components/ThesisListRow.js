import React from 'react'
import { arrayOf, number, bool, func } from 'prop-types'
import { Checkbox, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { thesisType } from '../../../util/types'

const renderStatusIcons = field =>
    (field ? <Icon color="green" name="checkmark" /> : <Icon color="red" name="remove" />)

const ThesisListRow = ({ thesis, showButtons, selectable, toggleThesis, selectedThesesIds }) => (
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
            {thesis.authorLastname ? `${thesis.authorLastname}, ${thesis.authorFirstname}` : thesis.authorEmail}
        </td>
        <td>{thesis.councilMeeting ? thesis.councilMeeting : null}</td>
        <td>{renderStatusIcons(thesis.authorLastname)}</td>
        <td>{renderStatusIcons(thesis.gradersApproved)}</td>
        <td>{renderStatusIcons(thesis.printDone)}</td>
    </tr>
)

ThesisListRow.propTypes = {
    thesis: thesisType.isRequired,
    toggleThesis: func.isRequired,
    showButtons: bool.isRequired,
    selectable: bool.isRequired,
    selectedThesesIds: arrayOf(number).isRequired
}

export default ThesisListRow
