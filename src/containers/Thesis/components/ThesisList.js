import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { arrayOf, func, bool } from 'prop-types'
import { Checkbox, Icon } from 'semantic-ui-react'
import { thesisType, agreementType, attachmentType } from '../../../util/types'
import ThesisListButtons from './ThesisListButtons'

class ThesisList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filteredTheses: props.theses,
            formattedTheses: props.theses,
            selectedThesesIds: [],
            cover: true,
            markDone: false
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.theses) {
            this.setState({
                filteredTheses: newProps.theses,
                formattedTheses: newProps.theses,
                selectedThesesIds: []
            })
        }
    }

    toggleThesis = thesis => () => {
        const selectedThesesIds = this.state.selectedThesesIds.includes(thesis.thesisId) ?
            this.state.selectedThesesIds.filter(id => id !== thesis.thesisId) :
            [...this.state.selectedThesesIds, thesis.thesisId]

        this.setState({ selectedThesesIds })
    };

    search = (event) => {
        if (!event.target.value) {
            this.setState({ filteredTheses: this.state.formattedTheses })
            return
        }
        const searchValue = event.target.value.toLowerCase()
        // if searchTerm is empty set filteredTheses = theses, else filter theses based on searchTerm
        const filteredTheses = this.state.filteredTheses
            .filter(thesis => Object.keys(thesis)
                .find(key => typeof thesis[key] === 'string' && thesis[key].toLowerCase().includes(searchValue)))
        this.setState({ filteredTheses })
    }

    sendDownloadSelected = () => {
        if (this.state.selectedThesesIds.length === 0)
            return

        const agreementsToPrint = this.props.agreements
            .filter(agreement => this.state.selectedThesesIds.includes(agreement.thesisId))
            .map(agreement => agreement.agreementId)

        const attachments = this.props.attachments
            .filter(attachment => agreementsToPrint.includes(attachment.agreementId))
            .filter(attachment => ['thesisFile', 'reviewFile'].includes(attachment.label))
            .sort((a, b) => {
                if (a.agreementId === b.agreementId)
                    return a.label === 'thesisFile' ? -1 : 1

                return a.agreementId - b.agreementId
            })
            .map(attachment => attachment.attachmentId)

        this.props.downloadSelected(this.state.cover ? ['cover', ...attachments] : attachments)

        if (this.state.markDone) {
            this.props.markPrinted(this.state.selectedThesesIds)
        }
    };

    toggleAll = () => {
        if (this.state.selectedThesesIds.length > 0) {
            this.setState({ selectedThesesIds: [] })
        } else {
            this.setState({ selectedThesesIds: this.props.theses.map(thesis => thesis.thesisId) })
        }
    };

    toggleCover = () => {
        this.setState({ cover: !this.state.cover })
    };

    toggleMarkDone = () => {
        this.setState({ markDone: !this.state.markDone })
    };

    renderStatusIcons(field) {
        return field ? <Icon color="green" name="checkmark" /> : <Icon color="red" name="remove" />
    }

    render() {
        return (
            <div>
                {this.props.showButtons ? (
                    <ThesisListButtons
                        sendDownloadSelected={this.sendDownloadSelected}
                        toggleCover={this.toggleCover}
                        cover={this.state.cover}
                        markDone={this.state.markDone}
                        toggleMarkDone={this.toggleMarkDone}
                        toggleAll={this.toggleAll}
                    />
                ) : null}
                <div className="ui fluid category search">
                    <div className="ui icon input">
                        <input className="prompt" type="text" placeholder="Filter theses" onChange={this.search} />
                        <i className="search icon" />
                    </div>
                </div>
                <table className="ui celled table">
                    <thead>
                        <tr>
                            {this.props.selectable || this.props.showButtons ? <th>Select</th> : null}
                            <th>Title</th>
                            <th>Author</th>
                            <th>Scheduled council meeting</th>
                            <th>Checked by author</th>
                            <th>Checked by resp. prof</th>
                            <th>Printed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.filteredTheses.map(thesis => (
                            <tr key={thesis.thesisId}>
                                {this.props.selectable || this.props.showButtons ? (
                                    <td>
                                        <Checkbox
                                            checked={this.state.selectedThesesIds.includes(thesis.thesisId)}
                                            onChange={this.toggleThesis(thesis)}
                                            fitted
                                        />
                                    </td>)
                                    : null}
                                <td><Link to={`/thesis/${thesis.thesisId}`}>{thesis.title}</Link></td>
                                <td>
                                    {thesis.authorLastname ?
                                        `${thesis.authorLastname}, ${thesis.authorFirstname}` :
                                        thesis.authorEmail}
                                </td>
                                <td>{thesis.councilMeeting ? thesis.councilMeeting : null}</td>
                                <td>{this.renderStatusIcons(thesis.authorLastname)}</td>
                                <td>{this.renderStatusIcons(thesis.gradersApproved)}</td>
                                <td>{this.renderStatusIcons(thesis.printDone)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

ThesisList.propTypes = {
    theses: arrayOf(thesisType).isRequired,
    downloadSelected: func.isRequired,
    agreements: arrayOf(agreementType).isRequired,
    attachments: arrayOf(attachmentType).isRequired,
    showButtons: bool.isRequired,
    markPrinted: func.isRequired,
    selectable: bool
}

ThesisList.defaultProps = {
    selectable: false
}

export default ThesisList
