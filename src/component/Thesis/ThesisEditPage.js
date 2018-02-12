import React, { Component } from 'react';
import { arrayOf, array, func } from 'prop-types';
import { connect } from 'react-redux';
import { updateThesis, deleteThesis } from './thesisActions';
import { createAttachment, deleteAttachment, downloadAttachments } from '../Attachment/attachmentActions';
import {
    agreementType, personType, roleType, programmeType, thesisType, councilmeetingType, studyfieldType
} from '../../util/types';

import ThesisInformation from './components/ThesisInformation';
import AttachmentAdder from '../Attachment/components/AttachmentAdder';
import AttachmentList from '../Attachment/components/AttachmentList';
import PersonSelector from '../Person/components/PersonSelector';
import ThesisCouncilmeetingPicker from './components/ThesisCouncilmeetingPicker';
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
        const { theses, persons, agreements, roles, studyfields, user } = props;

        if (!user.roles)
            this.setState({ allowEdit: false });

        if (props.match.params && props.match.params.id) {
            const thesisId = parseInt(props.match.params.id, 10);
            const thesis = this.findAndFormatThesis(theses, persons, agreements, roles, thesisId);

            if (thesis) {
                const attachments = props.attachments.filter((attachment) => {
                    const agreement = agreements.find(agreement => agreement.agreementId === attachment.agreementId
                        && agreement.thesisId === thesis.thesisId);
                    return agreement && agreement.agreementId === attachment.agreementId
                });

                const selectedProgrammeId = studyfields
                    .find(studyfield => studyfield.programmeId === thesis.studyfieldId);

                if (selectedProgrammeId)
                    thesis.programmeId = selectedProgrammeId.programmeId;

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
        thesis.graders = thesis.graders.map(person => person.personId);
        this.props.updateThesis(thesis);
    };

    deleteThesis = () => {
        this.props.deleteThesis(this.state.thesis.id);
    };

    toggleEditing = () => {
        this.setState({ allowEdit: !this.state.allowEdit });
    };

    handleChange = (changedValues) => {
        const thesis = Object.assign({}, this.state.thesis, changedValues);
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
                        changeList={list => this.handleChange({ graders: list })}
                        validationError={Object.keys(this.state.validationErrors).includes('graders')}
                        allowEdit={this.state.allowEdit}
                    />
                </label>
            </div>
        );
    }

    render() {
        // Don't render page if thesis with no access is opened.
        if (!this.state.thesis.thesisId) {
            return null;
        }

        return (
            <div>
                <br />
                <div className="ui form">
                    <ThesisInformation
                        sendChange={this.handleChange}
                        thesis={this.state.thesis}
                        studyfields={this.props.studyfields}
                        programmes={this.props.programmes}
                        allowEdit={this.state.allowEdit}
                        validationErrors={this.state.validationErrors}
                    />
                    {this.renderGraderSelecter()}
                    {this.state.allowEdit ? <AttachmentAdder
                        attachments={this.state.newAttachments}
                        changeList={this.editAttachmentList}
                        uploadAttachments={this.uploadAttachments}
                    /> : null}
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
                        programmes={this.props.programmes}
                    /> : undefined}
                </div>
                <br />
                <button className="ui positive button" onClick={this.handleSaveThesis} disabled={!this.state.allowEdit}>
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
    downloadAttachments: func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ThesisEditPage);
