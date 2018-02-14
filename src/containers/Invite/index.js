import React from 'react'
import { string, shape, bool, func } from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'

import { acceptThesis, acceptRole } from './services/inviteAction'

const InvitePage = ({ acceptThesisAction, acceptRoleAction, match, status }) => {
    const { type, token } = match.params

    if (!status && type === 'thesis') {
        acceptThesisAction(token)
    }

    if (!status && type === 'role') {
        acceptRoleAction(token)
    }

    if (status) {
        return <Redirect to="/" />
    }

    return (
        <div />
    )
}

const mapStateToProps = ({ invite }) => ({
    status: invite
})

const mapDispatchToProps = dispatch => ({
    acceptThesisAction: token => dispatch(acceptThesis(token)),
    acceptRoleAction: token => dispatch(acceptRole(token))
})

InvitePage.propTypes = {
    match: shape({
        params: shape({
            token: string.isRequired,
            type: string.isRequired
        }).isRequired
    }).isRequired,
    status: bool.isRequired,
    acceptThesisAction: func.isRequired,
    acceptRoleAction: func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(InvitePage)
