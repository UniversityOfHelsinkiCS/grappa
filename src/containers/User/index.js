import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getUser, switchEmail } from './services/userActions'
import { personType } from '../../util/types'
import PersonSwitcher from '../Person/components/PersonSwitcher'
import RoleExplain from './components/RoleExplain'
import EmailSwitcher from './components/EmailSwitcher'
import { swapDevUser } from '../../util/apiConnection'

export class UserPage extends Component {
    componentDidMount() {
        document.title = 'Grappa: Main page'
    }

    handleRoleChange = async (event) => {
        if (!event.target.value) return
        const uid = event.target.value
        const person = this.props.persons.find(p => p.shibbolethId === uid)
        await swapDevUser({
            uid: person.shibbolethId,
            givenname: person.firstname,
            sn: person.lastname,
            mail: person.email,
            'unique-code': `'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:${person.studentNumber}}`
        })
        this.props.getUser()
    }

    handleEmailUpdate = (event) => {
        this.props.updateEmail(event.target.value)
    }

    render() {
        return (
            <div>
                <div className="ui segment">
                    <h2>{this.props.user.firstname} {this.props.user.lastname}</h2>
                    <div className="ui list">
                        <div className="item">
                            <span className="header">Student number</span> {this.props.user.studentNumber}
                        </div>
                        <div className="item">
                            <span className="header">Email</span>
                            <EmailSwitcher user={this.props.user} update={this.handleEmailUpdate} />
                        </div>
                        <div className="item">
                            <span className="header">Phone</span> {this.props.user.phone}
                        </div>
                    </div>
                </div>
                {process.env.NODE_ENV !== 'production' ?
                    <PersonSwitcher
                        persons={this.props.persons}
                        onChange={this.handleRoleChange}
                    />
                    : null}
                <RoleExplain user={this.props.user} />
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    getUser() {
        dispatch(getUser())
    },
    updateEmail(useSecondaryEmail) {
        dispatch(switchEmail(useSecondaryEmail))
    }
})

const mapStateToProps = state => ({
    user: state.user,
    persons: state.persons
})

const { arrayOf, func } = PropTypes
UserPage.propTypes = {
    user: personType.isRequired,
    persons: arrayOf(personType).isRequired,
    getUser: func.isRequired,
    updateEmail: func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)
