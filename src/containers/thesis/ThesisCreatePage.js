import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { saveThesis } from './thesisActions';
import { personType, roleType, programmeType, councilmeetingType } from '../../util/types';

import ThesisConfirmModal from '../../components/thesis/ThesisConfirmModal';
import ThesisInformation from '../../components/thesis/ThesisInformation';
import AttachmentAdder from '../../components/attachment/AttachmentAdder';
import PersonSelector from '../../components/person/PersonSelector';
import ThesisCouncilmeetingPicker from '../../components/thesis/ThesisCouncilmeetingPicker';
import {thesisValidation} from '../../util/theses';

export class ThesisCreatePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thesis: {
                id: undefined,
                authorFirstname: '',
                authorLastname: '',
                authorEmail: '',
                title: '',
                urkund: 'http://',
                grade: '',
                graders: [],
                graderEval: '',
                programmeId: '',
                councilmeetingId: '',
                printDone: undefined,
                thesisEmails: {
                    graderEvalReminder: undefined,
                    printReminder: undefined,
                },
            },
            attachments: [],
            showModal: false,
            validationErrors: {}
        }
    }

    handleSaveThesis = () => {
        const form = new FormData();
        //TODO: If no review & thesis, then don't save
        this.state.attachments.forEach(attachment => {
            if (!attachment.label) {
                attachment.label = 'otherFile';
            }
            form.append(attachment.label, attachment);
        });
        form.append('json', JSON.stringify(this.state.thesis));
        this.props.saveThesis(form);
    };

    toggleModal = () => {
        this.validateThesis()
            .then(() => this.setState({ showModal: !this.state.showModal }))
            .catch(res => this.setState({ validationErrors: res.errors }));
    };

    handleChange = (fieldName, fieldValue) => {
        const newState = {};
        newState[fieldName] = fieldValue;
        const thesis = Object.assign({}, this.state.thesis, newState);

        this.validateThesis(thesis)
            .then(() => this.setState({ thesis, validationErrors: {} }))
            .catch(res => this.setState({ thesis, validationErrors: res.errors }));
    };

    editAttachmentList = (attachments) => {
        this.setState({ attachments });
    };

    validateThesis(thesis = this.state.thesis) {
        return thesisValidation.run(thesis);
    }

    renderGraderSelecter() {
        const programmeGraders = this.props.persons.filter(person =>
            this.props.roles.find(role =>
                (role.name === 'grader' || role.name === 'supervisor')
                && role.personId === person.personId
                && role.programmeId === parseInt(this.state.thesis.programmeId, 10)
            )
        );
        return (
            <PersonSelector
                persons={programmeGraders}
                selected={this.state.thesis.graders}
                changeList={(list) => this.handleChange('graders', list)}
            />
        );
    }

    render() {
        return (
            <div>
                <br />
                <ThesisConfirmModal
                    sendSaveThesis={this.handleSaveThesis}
                    closeModal={this.toggleModal}
                    showModal={this.state.showModal}
                />
                <div className="ui form">
                    <ThesisInformation
                        sendChange={this.handleChange}
                        allowEdit
                        programmes={this.props.programmes}
                        thesis={this.state.thesis}
                        validationErrors={this.state.validationErrors}
                    />
                    {this.renderGraderSelecter()}
                    <AttachmentAdder
                        attachments={this.state.attachments}
                        changeList={this.editAttachmentList}
                    />
                    <br />
                    <ThesisCouncilmeetingPicker
                        sendChange={this.handleChange}
                        chosenMeetingId={this.state.thesis.councilmeetingId}
                        councilmeetings={this.props.councilmeetings}
                    />
                </div>
                <br />
                <button className="ui positive button" onClick={this.toggleModal}>
                    Submit
                </button>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    saveThesis(thesis) {
        dispatch(saveThesis(thesis));
    },
});

const mapStateToProps = (state) => ({
    councilmeetings: state.councilmeetings,
    programmes: state.programmes,
    roles: state.roles,
    persons: state.persons,
});

const { arrayOf, func } = PropTypes;
ThesisCreatePage.propTypes = {
    councilmeetings: arrayOf(councilmeetingType).isRequired,
    programmes: arrayOf(programmeType).isRequired,
    roles: arrayOf(roleType).isRequired,
    persons: arrayOf(personType).isRequired,
    saveThesis: func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ThesisCreatePage);
