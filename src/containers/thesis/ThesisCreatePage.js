import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { saveThesis } from './thesisActions';
import { personType, roleType, studyfieldType, councilmeetingType } from '../../util/types';

import ThesisConfirmModal from '../../components/thesis/ThesisConfirmModal';
import ThesisInformation from '../../components/thesis/ThesisInformation';
import AttachmentAdder from '../../components/attachment/AttachmentAdder';
import PersonSelector from '../../components/person/PersonSelector';
import ThesisCouncilmeetingPicker from '../../components/thesis/ThesisCouncilmeetingPicker';

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
                urkund: '',
                grade: '',
                graders: [],
                graderEval: '',
                studyfieldId: '',
                councilmeetingId: '',
                printDone: undefined,
                thesisEmails: {
                    graderEvalReminder: undefined,
                    printReminder: undefined,
                },
            },
            attachments: [],
            showModal: false,
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

    deleteThesis = () => {
        this.props.deleteThesis(this.state.thesis.id);
    };

    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    };

    toggleEditing = () => {
        this.setState({ allowEdit: !this.state.allowEdit });
    };

    handleChange = (fieldName, fieldValue) => {
        console.log(`thesis.${fieldName} = ${fieldValue}`);
        const thesis = this.state.thesis;
        thesis[fieldName] = fieldValue;
        this.setState({ thesis });
    };

    editAttachmentList = (attachments) => {
        this.setState({ attachments });
    };

    renderGraderSelecter() {
        const studyfieldGraders = this.props.persons.filter(person =>
            this.props.roles.find(role =>
                (role.name === 'grader' || role.name === 'supervisor')
                && role.personId === person.personId
                && role.studyfieldId === parseInt(this.state.thesis.studyfieldId, 10)
            )
        );
        return <PersonSelector
            persons={studyfieldGraders}
            selected={this.state.thesis.graders}
            changeList={(list) => this.handleChange('graders', list)}
        />
    }

    render() {
        return (
            <div>
                <br />
                <ThesisConfirmModal sendSaveThesis={this.handleSaveThesis} closeModal={this.toggleModal} showModal={this.state.showModal} />
                <div className="ui form">
                    <ThesisInformation sendChange={this.handleChange}
                        thesis={this.state.thesis}
                        studyfields={this.props.studyfields}
                        allowEdit />
                    {this.renderGraderSelecter()}
                    <AttachmentAdder attachments={this.state.attachments} changeList={this.editAttachmentList} />
                    <br />
                    <ThesisCouncilmeetingPicker
                        sendChange={this.handleChange}
                        chosenMeetingId={this.state.thesis.councilmeetingId}
                        councilmeetings={this.props.councilmeetings} />
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
    studyfields: state.studyfields,
    roles: state.roles,
    persons: state.persons,
});

const { arrayOf, func } = PropTypes;
ThesisCreatePage.propTypes = {
    councilmeetings: arrayOf(councilmeetingType).isRequired,
    studyfields: arrayOf(studyfieldType).isRequired,
    roles: arrayOf(roleType).isRequired,
    persons: arrayOf(personType).isRequired,
    saveThesis: func.isRequired,
    deleteThesis: func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ThesisCreatePage);