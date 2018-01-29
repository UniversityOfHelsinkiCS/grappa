import React, { Component } from 'react';
import { arrayOf, array, func } from 'prop-types';
import { connect } from 'react-redux';
import { updateThesis, deleteThesis } from './thesisActions';
import { createAttachment, deleteAttachment, downloadAttachments } from '../attachment/attachmentActions';
import { sendReminder } from '../email/emailActions';
import { agreementType, personType, roleType, programmeType, thesisType, councilmeetingType, studyfieldType } from '../../util/types';

import ThesisInformation from '../../components/thesis/ThesisInformation';
import AttachmentAdder from '../../components/attachment/AttachmentAdder';
import AttachmentList from '../../components/attachment/AttachmentList';
import PersonSelector from '../../components/person/PersonSelector';
import ThesisCouncilmeetingPicker from '../../components/thesis/ThesisCouncilmeetingPicker';
import { emptyThesisData, formatThesis, thesisValidation } from '../../util/theses';

export class ThesisEditPage extends Component {
    /**
     *  If allowEdit is false, we are viewing a thesis
     *  If allowEdit is true, we are editing a thesis
     */
    constructor(props) {
        super(props);
        this.state = {
            thesis: emptyThesisData,
            attachments: [],
            newAttachments: [],
            allowEdit: true,
            validationErrors: {}
        }
    }

    componentDidMount() {
        this.init(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.init(newProps);
    }

    init(props) {
        const { theses, persons, agreements, roles } = props;

        if (props.match.params && props.match.params.id) {
            const thesisId = parseInt(props.match.params.id, 10);
            const thesis = this.findAndFormatThesis(theses, persons, agreements, roles, thesisId);
            if (thesis) {
                const attachments = props.attachments.filter((attachment) => {
                    const agreement = props.agreements.find(agreement => agreement.agreementId === attachment.agreementId
                        && agreement.thesisId === thesis.thesisId);
                    return agreement && agreement.agreementId === attachment.agreementId
                });

                this.setState({ thesis, attachments })
            }
        }
    }

    findAndFormatThesis = (theses, persons, agreements, roles, thesisId) => {
        try {
            const thesis = Object.assign({}, theses.find(thesis => thesis.thesisId === thesisId));
            return formatThesis(thesis, agreements, persons, roles);
        } catch (error) {
            return undefined
        }
    };


    handleSaveThesis = () => {
        const thesis = Object.assign({}, this.state.thesis);
        delete thesis.programmeId;
        this.props.updateThesis(thesis);
    };

    deleteThesis = () => {
        this.props.deleteThesis(this.state.thesis.id);
    };

    toggleEditing = () => {
        this.setState({ allowEdit: !this.state.allowEdit });
    };

    handleChange = (fieldName, fieldValue) => {
        const thesis = Object.assign({}, this.state.thesis);
        thesis[fieldName] = fieldValue;
        this.setState({ thesis });

        this.validateThesis(thesis)
            .then(() => this.setState({ thesis, validationErrors: {} }))
            .catch(res => this.setState({ thesis, validationErrors: res.errors }));
    };

    editAttachmentList = (attachments) => {
        this.setState({ newAttachments: attachments });
    };

    uploadAttachments = () => {
        const form = new FormData();
        // agreementId needed to link the attachment to.
        const agreement = this.props.agreements.find(agreement => agreement.thesisId === this.state.thesis.thesisId);
        form.append('json', JSON.stringify(agreement));
        this.state.newAttachments.forEach((attachment) => {
            if (!attachment.label) {
                attachment.label = 'otherFile';
            }
            form.append(attachment.label, attachment);
        });
        this.props.createAttachment(form)
    };

    downloadAttachment = (attachmentId) => {
        this.props.downloadAttachments([attachmentId])
    };

    validateThesis(thesis = this.state.thesis) {
        return thesisValidation.run(thesis);
    }

    renderControlButtons() {
        // Admin controls
        if (this.props.user.roles && this.props.user.roles.find(programmeRole => programmeRole.role === 'admin')) {
            return (
                <div className="field">
                    {this.state.allowEdit ?
                        <div className="ui red button" onClick={this.toggleEditing}>Stop editing</div>
                        :
                        <div className="ui green button" onClick={this.toggleEditing}>Edit</div>
                    }
                    <div className="ui blue button" onClick={this.saveThesis}>Save</div>
                    <div className="ui red button" onClick={this.deleteThesis}>Delete</div>
                    <button className="ui violet button" onClick={this.downloadThesis}>Download as PDF</button>
                </div>
            );
        }

        return <div />;
    }

    renderGraderSelecter() {
        const programmeGraders = this.props.persons.filter(person =>
            this.props.roles.find(role =>
                role.name === 'grader'
                && role.personId === person.personId
                && role.programmeId === parseInt(this.state.thesis.programmeId, 10)
            )
        );
        return (
            <div className="field">
                <label>
                    Select graders
                    <PersonSelector
                        persons={programmeGraders}
                        selected={this.state.thesis.graders}
                        changeList={list => this.handleChange('graders', list)}
                        validationError={Object.keys(this.state.validationErrors).includes('graders')}
                    />
                </label>
            </div>
        );
    }

    render() {
        return (
            <div>
                <br />
                <div className="ui form">
                    {this.renderControlButtons()}
                    <ThesisInformation
                        sendChange={this.handleChange}
                        thesis={this.state.thesis}
                        studyfields={this.props.studyfields}
                        programmes={this.props.programmes}
                        allowEdit={this.state.allowEdit}
                        validationErrors={this.state.validationErrors}
                    />
                    {this.renderGraderSelecter()}
                    <AttachmentAdder
                        attachments={this.state.newAttachments}
                        changeList={this.editAttachmentList}
                        uploadAttachments={this.uploadAttachments}
                    />
                    <AttachmentList
                        attachments={this.state.attachments}
                        downloadAttachment={this.downloadAttachment}
                        deleteAttachment={this.props.deleteAttachment}
                    />
                    <br />
                    {(this.state.allowEdit) ? <ThesisCouncilmeetingPicker
                        sendChange={this.handleChange}
                        chosenMeetingId={this.state.thesis.councilmeetingId}
                        councilmeetings={this.props.councilmeetings}
                        programmeId={this.state.thesis.programmeId}
                    /> : undefined}
                </div>
                <br />
                <button className="ui positive button" onClick={this.handleSaveThesis}>
                    Submit
                </button>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    updateThesis(thesis) {
        dispatch(updateThesis(thesis));
    },
    deleteThesis(thesisId) {
        dispatch(deleteThesis(thesisId));
    },
    createAttachment(attachment) {
        dispatch(createAttachment(attachment));
    },
    deleteAttachment(attachmentId) {
        dispatch(deleteAttachment(attachmentId));
    },
    downloadAttachments(attachmentIds) {
        dispatch(downloadAttachments(attachmentIds));
    },
    sendReminder(thesisId, type) {
        dispatch(sendReminder(thesisId, type));
    }
});

const mapStateToProps = state => ({
    agreements: state.agreements,
    attachments: state.attachments,
    councilmeetings: state.councilmeetings,
    persons: state.persons,
    roles: state.roles,
    programmes: state.programmes,
    studyfields: state.studyfields,
    theses: state.theses,
    user: state.user
});

ThesisEditPage.propTypes = {
    agreements: arrayOf(agreementType).isRequired,
    attachments: array.isRequired,
    councilmeetings: arrayOf(councilmeetingType).isRequired,
    persons: arrayOf(personType).isRequired,
    roles: arrayOf(roleType).isRequired,
    programmes: arrayOf(programmeType).isRequired,
    studyfields: arrayOf(studyfieldType).isRequired,
    theses: arrayOf(thesisType).isRequired,
    user: personType.isRequired,
    updateThesis: func.isRequired,
    deleteThesis: func.isRequired,
    createAttachment: func.isRequired,
    deleteAttachment: func.isRequired,
    downloadAttachments: func.isRequired,
    sendReminder: func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ThesisEditPage);
