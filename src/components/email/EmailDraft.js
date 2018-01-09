import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { emailType, studyfieldType } from '../../util/types';

export default class EmailDraft extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            draft: this.props.draft,
            deleteConfirmation: false,
        };
    }

    saveEdit = () => {
        this.props.updateDraft(this.state.draft);
    }

    cancelEdit = () => {
        this.setState({ editing: false })
    }

    startEdit = () => {
        this.setState({ editing: true })
    }

    delete = () => {
        if (this.state.deleteConfirmation) {
            this.props.sendDeleteRequest(this.props.draft);
            this.setState({ deleteConfirmation: false });
        } else {
            this.setState({ deleteConfirmation: true });
        }
    }

    changeTitle = (event) => {
        const draft = Object.assign({}, this.state.draft);
        draft.title = event.target.value;
        this.setState({ draft })
    }

    changeBody = (event) => {
        const draft = Object.assign({}, this.state.draft);
        draft.body = event.target.value;
        this.setState({ draft })
    }

    changeStudyfield = (event) => {
        const draft = Object.assign({}, this.state.draft);
        draft.studyfield = Number(event.target.value);
        this.setState({ draft })
    }

    renderButtons() {
        if (this.state.editing) {
            return (
                <div>
                    <button className="ui button blue" onClick={this.saveEdit}>Save</button>
                    <button className="ui button orange" onClick={this.cancelEdit}>Stop editing</button>
                    <div style={{ width: '10em', display: 'inline-block' }}>
                    <select className="ui dropdown" onChange={this.changeStudyfield} value={this.state.draft.studyfield}>
                        <option value="null">No studyfield</option>
                        {this.props.studyfields.map(studyfield => (
                            <option
                                key={studyfield.studyfieldId}
                                value={studyfield.studyfieldId}>
                                    {studyfield.name}
                                </option>
                        ))}
                    </select>
                    </div>
                    <button className="ui inverted right floated red button" onClick={this.delete}>
                        {this.state.deleteConfirmation ? 'Click again to confirm' : 'Delete this draft'}
                    </button>
                </div>
            );
        } else {
            return (
                <div className="field">
                    <button className="ui green button" onClick={this.startEdit}>Edit</button>
                </div>
            );
        }
    }

    getStudyfieldName(draft) {
        if (draft.studyfield) {
            return `${this.props.studyfields.filter(field => draft.studyfield === field.studyfieldId)[0].name}:`;
        }
        return '';
    }

    render() {
        const editing = this.state.editing;
        if (!this.state.draft) {
            return <div />;
        }
        return (
            <div className="m-bot">
                <h3 className="ui dividing header">
                    {editing ? 'Editing draft: ' : ''}{`${this.getStudyfieldName(this.props.draft)} ${this.props.draft.type}`}
                </h3>
                <div className="field">
                    <label>Title</label>
                    <input
                        type="text"
                        value={this.state.draft.title}
                        placeholder="Title"
                        readOnly={!editing}
                        onChange={this.changeTitle}
                    />
                </div>
                <div className="field">
                    <label>Body</label>
                    <textarea
                        value={this.state.draft.body}
                        readOnly={!editing}
                        onChange={this.changeBody}
                    />
                </div>

                {this.renderButtons()}
            </div>
        );
    }
}

const { func } = PropTypes;
EmailDraft.propTypes = {
    draft: emailType.isRequired,
    updateDraft: func.isRequired,
    sendDeleteRequest: func.isRequired,
    studyfields: PropTypes.arrayOf(studyfieldType).isRequired
};
