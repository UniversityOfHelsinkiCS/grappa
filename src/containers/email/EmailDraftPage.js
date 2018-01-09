import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EmailDraft from '../../components/email/EmailDraft'

import { connect } from 'react-redux';
import { saveEmailDraft, deleteEmailDraft, updateEmailDraft } from './emailActions';
import { emailType, studyfieldType } from '../../util/types';

export class EmailDraftPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newDraftName: '',
        };
    }

    componentDidMount() {
        if (this.props.emails) {
            this.setState({ draftList: this.sortDraftList(this.props.emails) });
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.EmailDrafts) {
            this.setState({ draftList: this.sortDraftList(newProps.emailDrafts) });
        }
    }

    sortDraftList = (draftList) => {
        return draftList.sort((a, b) => a.id > b.id);
    }

    editName = (event) => {
        this.setState({ newDraftName: event.target.value });
    }


    handleUpdateDraft = (draft) => {
        this.props.updateEmailDraft(draft);
    }

    handleDeleteDraft = (draft) => {
        this.props.deleteEmailDraft(draft);
    }

    handleAddDraft = () => {
        if (this.state.newDraftName) {
            const draft = {
                body: '',
                title: '',
                type: this.state.newDraftName,
            };
            this.props.saveEmailDraft(draft);
            this.setState({ newDraftName: '' });
        }
    }

    render() {
        const drafts = this.props.emails;
        return (
            <div className="ui form">
                <h2 className="ui dividing header">Email drafts</h2>
                <p>
                    Drafts for the emails that are being sent by Grappa. Title is the email's title and body the text.
                    Different variables are indicated with double dollars eg. $LINK$ which differ from draft to draft.
                </p>
                {drafts ? drafts.map((draft, index) =>
                    <EmailDraft
                        draft={draft}
                        key={draft.emailDraftId}
                        updateDraft={this.handleUpdateDraft}
                        sendDeleteRequest={this.handleDeleteDraft}
                        studyfields={this.props.studyfields}
                    />
                ) : undefined}

                <div className="ui input focus">
                    <input type="text" value={this.state.newDraftName} onChange={this.editName} placeholder="Name of the Draft" />
                </div>
                <button className="ui green button" onClick={this.handleAddDraft}>Create A New Draft</button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        emails: state.emails,
        studyfields: state.studyfields
    };
};

const mapDispatchToProps = (dispatch) => ({
    updateEmailDraft(draft) {
        dispatch(updateEmailDraft(draft));
    },
    saveEmailDraft(draft) {
        dispatch(saveEmailDraft(draft));
    },
    deleteEmailDraft(draft) {
        dispatch(deleteEmailDraft(draft));
    },
});

const { func, arrayOf } = PropTypes;
EmailDraftPage.propTypes = {
    updateEmailDraft: func.isRequired,
    deleteEmailDraft: func.isRequired,
    saveEmailDraft: func.isRequired,
    emails: arrayOf(emailType.isRequired).isRequired,
    studyfields: arrayOf(studyfieldType).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailDraftPage);
