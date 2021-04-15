import React, { Component } from 'react'
import { string, shape, bool, func } from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import * as queryString from 'query-string'

import { acceptThesis, acceptRole } from './services/inviteAction'
import { getToken } from '../../util/common'

export class InvitePage extends Component {
    state = {
        loaded: false
    }

    componentWillReceiveProps(newProps) {
        if (!this.state.loaded && getToken()) {
            this.setState({ loaded: true },
                this.acceptToken(newProps))
        }
    }

    acceptToken = (props) => {
        const { acceptThesisAction, acceptRoleAction, location, status } = props
        const { type, token } = queryString.parse(location.search)
        if (!status && type === 'thesis') {
            acceptThesisAction(token)
        }

        if (!status && type === 'role') {
            acceptRoleAction(token)
        }
    }

    render() {
        const { status } = this.props
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
                    If this application behaves in a strange way contact grp-toska@helsinki.fi
                </p>

            </div>
        )
    }
}

const mapStateToProps = ({ invite, user }) => ({
    status: invite,
    user
})

const mapDispatchToProps = dispatch => ({
    acceptThesisAction: token => dispatch(acceptThesis(token)),
    acceptRoleAction: token => dispatch(acceptRole(token))
})

InvitePage.propTypes = {
    location: shape({
        search: string.isRequired
    }).isRequired,
    status: bool.isRequired,
    acceptThesisAction: func.isRequired,
    acceptRoleAction: func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(InvitePage)
