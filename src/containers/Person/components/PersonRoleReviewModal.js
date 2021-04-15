import React, { Component } from 'react'
import { func, object } from 'prop-types'

export default class PersonRoleReviewModal extends Component {
    constructor() {
        super()
        this.state = {
            statement: ''
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.personRole) {
            const statement = newProps.personRole.statement ?
                newProps.personRole.statement : this.defaultStatement(newProps)
            this.setState({ statement })
        }
    }

    defaultStatement = (props) => {
        const { name, role, thesis } = props.personRole
        const { title } = thesis
        return `I approve ${name} to be qualified as a ${role} for the thesis ${title}`
    }

    saveReview = approved => () => {
        this.props.sendReview(this.state.statement, approved, this.props.personRole)
    }

    clearReview = () => {
        this.setState({ statement: '' })
    }

    handleReviewChange = (event) => {
        this.setState({ statement: event.target.value })
    }

    renderTexts() {
        return (
            <div className="scrolling content">
                <div className="description">
                    <div>Name: {this.props.personRole.name}</div>
                    <div>Role: {this.props.personRole.role}</div>
                    <div>Thesis: {this.props.personRole.thesis.title}</div>
                </div>
                <div>
                    <div className="ui form">
                        <div className="field">
                            <label>Write your statement here (required)</label>
                            <textarea
                                rows="8"
                                value={this.state.statement}
                                onChange={this.handleReviewChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        if (!this.props.personRole) {
            return (<div />)
        }
        return (
            <div>
                <div className="ui dimmer modals page transition visible active" onClick={this.props.closeModal()} />
                <div className="ui active modal" style={{ top: 45, border: '7px solid black', borderRadius: '7px' }}>
                    <i className="close icon" onClick={this.props.closeModal()} />
                    <div className="header">Review</div>
                    {this.renderTexts()}
                    <br />
                    <div className="two fields" style={{ margin: '1%' }}>
                        <button className="ui positive button" onClick={this.saveReview(true)}>
                            Approve
                        </button>
                        <button className="ui negative button" onClick={this.saveReview(false)}>
                            Disapprove
                        </button>
                        <button className="ui button" onClick={this.clearReview}>
                            Clear statement field
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

PersonRoleReviewModal.propTypes = {
    sendReview: func.isRequired,
    closeModal: func.isRequired,
    personRole: object.isRequired
}
