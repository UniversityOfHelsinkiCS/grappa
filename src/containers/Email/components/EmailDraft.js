import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { emailType, programmeType } from '../../../util/types'
import ProgrammeSelect from '../../Unit/components/ProgrammeSelect'

export default class EmailDraft extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editing: false,
            draft: this.props.draft,
            deleteConfirmation: false
        }
    }

    getProgrammeName(draft) {
        if (draft.programme) {
            return `${this.props.programmes.filter(field => draft.programme === field.programmeId)[0].name}:`
        }
        return ''
    }

    saveEdit = () => {
        this.props.updateDraft(this.state.draft)
    };

    cancelEdit = () => {
        this.setState({ editing: false })
    };

    startEdit = () => {
        this.setState({ editing: true })
    };

    delete = () => {
        if (this.state.deleteConfirmation) {
            this.props.sendDeleteRequest(this.props.draft)
            this.setState({ deleteConfirmation: false })
        } else {
            this.setState({ deleteConfirmation: true })
        }
    };

    changeTitle = (event) => {
        const draft = Object.assign({}, this.state.draft)
        draft.title = event.target.value
        this.setState({ draft })
    };

    changeBody = (event) => {
        const draft = Object.assign({}, this.state.draft)
        draft.body = event.target.value
        this.setState({ draft })
    };

    changeProgramme = (event) => {
        const draft = Object.assign({}, this.state.draft)
        draft.programme = Number(event.target.value)
        this.setState({ draft })
    };

    renderButtons() {
        if (this.state.editing) {
            return (
                <div>
                    <button className="ui button blue" onClick={this.saveEdit}>Save</button>
                    <button className="ui button orange" onClick={this.cancelEdit}>Stop editing</button>
                    <ProgrammeSelect
                        onChange={this.changeProgramme}
                        programmes={this.props.programmes}
                        value={this.state.draft.programme}
                    />
                    <button className="ui inverted right floated red button" onClick={this.delete}>
                        {this.state.deleteConfirmation ? 'Click again to confirm' : 'Delete this draft'}
                    </button>
                </div>
            )
        }
        return (
            <div className="field">
                <button className="ui green button" onClick={this.startEdit}>Edit</button>
            </div>
        )
    }

    render() {
        const { editing } = this.state
        if (!this.state.draft) {
            return <div />
        }
        return (
            <div className="m-bot">
                <h3 className="ui dividing header">
                    {editing ? 'Editing draft: ' : ''}{`${this.getProgrammeName(this.props.draft)} ${this.props.draft.type}`}
                </h3>
                <div className="field">
                    <label htmlFor="changeDraftTitle">
                        Title
                        <input
                            id="changeDraftTitle"
                            type="text"
                            value={this.state.draft.title}
                            placeholder="Title"
                            readOnly={!editing}
                            onChange={this.changeTitle}
                        />
                    </label>
                </div>
                <div className="field">
                    <label htmlFor="changeDraftBody">
                        Body
                        <textarea
                            id="changeDraftBody"
                            value={this.state.draft.body}
                            readOnly={!editing}
                            onChange={this.changeBody}
                        />
                    </label>
                </div>

                {this.renderButtons()}
            </div>
        )
    }
}

const { func } = PropTypes
EmailDraft.propTypes = {
    draft: emailType.isRequired,
    updateDraft: func.isRequired,
    sendDeleteRequest: func.isRequired,
    programmes: PropTypes.arrayOf(programmeType).isRequired
}
