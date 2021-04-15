import React from 'react'
import { func } from 'prop-types'
import { personType } from '../../../util/types'

const EmailSwitcher = ({ user, update }) => {
    if (!user.secondaryEmail || user.secondaryEmail === user.email)
        return <span>{user.email}</span>

    return (
        <div>
            <select value={user.useSecondaryEmail.toString()} onChange={update}>
                <option value="true">{user.secondaryEmail}</option>
                <option value="false">{user.email}</option>
            </select>
        </div>
    )
}

EmailSwitcher.propTypes = {
    user: personType.isRequired,
    update: func.isRequired
}

export default EmailSwitcher
