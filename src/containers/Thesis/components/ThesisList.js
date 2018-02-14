import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { arrayOf, func, bool } from 'prop-types'
import { thesisType, agreementType, attachmentType } from '../../../util/types'
import LoadingIndicator from '../../LoadingIndicator'

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

        this.search = this.search.bind(this)
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

    search(event) {
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
        if (this.state.selectedThesesIds.length > 0) {
            const attachmentIds = this.props.agreements.map((agreement) => {
                if (this.state.selectedThesesIds.find(id => id === agreement.thesisId)) {
                    return this.props.attachments.filter((attachment) => {
                        if (attachment.agreementId === agreement.agreementId) {
                            // Pick correct files;
                            if (attachment.label === 'thesisFile' || attachment.label === 'reviewFile') {
                                return true
                            }
                        }
                        return false
                    })
                        .sort((a) => {
                            if (a.label === 'thesisFile') { // Thesis comes before review.
                                return -1
                            }
                            return 1
                        })
                }
                return false
            }).reduce((acc, cur) => { // Flatten thesis, review pairs.
                if (cur) {
                    return acc.concat(cur.map(attachment => attachment.attachmentId)) // Take only ids
                }
                return acc
            }, this.state.cover ? ['cover'] : [] // Add cover if it's chosen.
            )
            this.props.downloadSelected(attachmentIds)
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

    renderButtons() {
        if (!this.props.showButtons) {
            return null
        }

        return (
            <div className="ui form">
                <div className="two fields" >
                    <div className="field">
                        <LoadingIndicator type="DOWNLOAD" />
                        <button className="ui orange button" onClick={this.sendDownloadSelected}>Download</button>
                        &nbsp;
                        <div className="ui toggle checkbox">
                            <input
                                type="checkbox"
                                checked={this.state.cover ? 'true' : ''}
                                onChange={this.toggleCover}
                            />
                            <label>Include cover</label>
                        </div>
                        &nbsp;
                        <div className="ui toggle checkbox">
                            <input
                                type="checkbox"
                                checked={this.state.markDone ? 'true' : ''}
                                onChange={this.toggleMarkDone}
                            />
                            <label>Mark print done</label>
                        </div>
                    </div>
                    <div className="field">
                        <button className="ui purple button" onClick={this.toggleAll}>Select all</button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderButtons()}
                <div className="ui fluid category search">
                    <div className="ui icon input">
                        <input className="prompt" type="text" placeholder="Filter theses" onChange={this.search} />
                        <i className="search icon" />
                    </div>
                </div>
                <table className="ui celled table">
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Author</th>
                            <th>Email</th>
                            <th>Title</th>
                            <th>Grade</th>
                            <th>Print Done</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.filteredTheses.map(thesis => (
                            <tr key={thesis.thesisId}>
                                <td>
                                    <div className="ui fitted checkbox">
                                        <input
                                            type="checkbox"
                                            checked={
                                                this.state.selectedThesesIds.includes(thesis.thesisId) ? 'true' : ''
                                            }
                                            onChange={this.toggleThesis(thesis)}
                                        />
                                        <label />
                                    </div>
                                </td>
                                <td>
                                    {thesis.authorLastname ? `${thesis.authorLastname}, ${thesis.authorFirstname}` : ''}
                                </td>
                                <td>{thesis.authorEmail}</td>
                                <td><Link to={`/thesis/${thesis.thesisId}`}>{thesis.title}</Link></td>
                                <td>{thesis.grade}</td>
                                <td>{thesis.printDone.toString()}</td>
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
    markPrinted: func.isRequired
}


export default ThesisList
