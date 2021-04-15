import React, { Component } from 'react'
import { connect } from 'react-redux'
import { arrayOf, func } from 'prop-types'

import PersonRoleReviewModal from './components/PersonRoleReviewModal'
import { updateRole } from '../Role/services/roleActions'
import { roleType } from '../../util/types'

export class PersonRoleReviewPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            agreementPersons: this.filterAndFormatPersons(props),
            personRoleInReview: undefined
        }
    }

    componentDidMount() {
        document.title = 'Grader Management'
    }

    componentWillReceiveProps(newProps) {
        if (newProps.programmes.length > 0
            && newProps.agreements.length > 0
            && newProps.roles.length > 0
            && newProps.persons.length > 0
            && newProps.theses.length > 0) {
            this.setState({
                agreementPersons: this.filterAndFormatPersons(newProps)
            })
        }
    }

    filterAndFormatPersons = props => props.roles
        .filter(role => role.name === 'grader')
        .map((role) => {
            const person = props.persons.find(p => p.personId === role.personId)
            if (!person) {
                return undefined
            }
            return {
                personId: person.personId,
                personRoleId: role.personRoleId,
                agreementId: role.agreementId,
                name: `${person.firstname} ${person.lastname}`,
                role: role.name,
                statement: role.statement,
                approved: role.approved,
                programme: props.programmes.find(programme => programme.programmeId === role.programmeId).name,
                thesis: props.theses.find(thesis => props.agreements.find(agreement =>
                    thesis.thesisId === agreement.thesisId && role.agreementId === agreement.agreementId
                ))
            }
        }).sort((a, b) => {
            if (!a.statement === !b.statement) {
                return a.name.toLowerCase() > b.name.toLowerCase()
            }
            return !a.statement ? -1 : 1
        });

    reviewAgreementPerson = (statement, approved, personRole) => {
        if (statement && personRole) {
            const agreementPersonRole = this.props.roles.find(role =>
                role.personRoleId === personRole.personRoleId && role.agreementId === personRole.agreementId)
            agreementPersonRole.statement = statement
            agreementPersonRole.approved = approved
            this.props.updateRole(agreementPersonRole)
            this.setState({ personRoleInReview: undefined })
        }
    };

    toggleEditModal = personRoleToReview => () => {
        this.setState({ personRoleInReview: personRoleToReview })
    };

    renderReviewButton(rolePerson) {
        let text = 'Review'
        let buttonClass = 'ui button'
        if (rolePerson.statement) {
            if (rolePerson.approved) {
                text = 'Approved'
                buttonClass += ' green'
            } else {
                text = 'Rejected'
                buttonClass += ' red'
            }
        } else {
            buttonClass += ' blue'
        }
        // Approved, Rejected and not yet reviewed look different.
        return (
            <button className={buttonClass} onClick={this.toggleEditModal(rolePerson)} >
                {text}
            </button>
        )
    }

    renderList() {
        return (
            <table className="ui celled table">
                <thead>
                    <tr>
                        <th>Person</th>
                        <th>Unit</th>
                        <th>Role</th>
                        <th>Thesis</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.agreementPersons.filter(rolePerson => rolePerson.thesis).map(rolePerson => (
                        <tr
                            key={parseInt(`${rolePerson.personRoleId}${rolePerson.thesis ?
                                rolePerson.thesis.thesisId : rolePerson.thesis}`, 10)}
                        >
                            <td>{rolePerson.name}</td>
                            <td>{rolePerson.programme}</td>
                            <td>{rolePerson.role}</td>
                            <td>{rolePerson.thesis ? rolePerson.thesis.title : rolePerson.thesis}</td>
                            <td>{this.renderReviewButton(rolePerson)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    render() {
        return (
            <div className="ui segment">
                <PersonRoleReviewModal
                    closeModal={this.toggleEditModal}
                    personRole={this.state.personRoleInReview}
                    sendReview={this.reviewAgreementPerson}
                />
                <p>
                    Review and approve graders here.
                </p>
                <p>
                    Blue action means that you have not yet reviewed them, press the button to open a review dialog.
                </p>
                <p>
                    Green action means that you have approved them.
                    Red action means that you have rejected them.
                    You can also edit your review by pressing the button, which opens the review dialog again.
                </p>
                <p>
                    You can also review a thesis by going back to the thesis list and clicking the thesis title.
                </p>
                <h2>List of theses & graders </h2>
                {this.renderList()}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    updateRole(data) {
        dispatch(updateRole(data))
    }
})

const mapStateToProps = state => ({
    theses: state.theses,
    agreements: state.agreements,
    user: state.user,
    roles: state.roles,
    persons: state.persons,
    programmes: state.programmes
})

PersonRoleReviewPage.propTypes = {
    updateRole: func.isRequired,
    roles: arrayOf(roleType).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonRoleReviewPage)
