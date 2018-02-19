import React from 'react'
import { string, shape, bool, func } from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
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
        return <Redirect to="/theses" />
    }
    // Error:
    return (
        <div>
            <h3>Welcome, do not panic</h3>
            <p>
                You should not see this page if there was not an error message above.
                You came here through a link and the link was already used, you probably clicked it once before.
            </p>
            <p>
                If you are a student, check the <Link to="/theses">Thesis List</Link> page.
                You should see one thesis and by clicking that thesis you should see correct data.
            </p>
            <p>
                If the data is not correct, contact your supervisor.
            </p>
            <p>
                If you are not a student:
                you should see your information on the <Link to="/">Homepage</Link> which has been updated accordingly
            </p>
            <p>
                If Grappa (this application) behaves in a strange way contact grp-toska@helsinki.fi
            </p>

        </div>
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
