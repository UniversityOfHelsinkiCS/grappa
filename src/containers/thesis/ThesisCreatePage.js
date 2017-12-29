import React, { Component } from "react";
import { Link } from "react-router"

import { connect } from "react-redux";
import { saveThesis, updateThesis, deleteThesis } from './thesisActions';
import { sendReminder } from '../email/emailActions';

import ThesisConfirmModal from "../../components/thesis/ThesisConfirmModal";
import ThesisInformation from "../../components/thesis/ThesisInformation";
import AttachmentAdder from "../../components/attachment/AttachmentAdder";
import PersonSelecter from "../../components/person/PersonSelecter";
import ThesisCouncilmeetingPicker from "../../components/thesis/ThesisCouncilmeetingPicker";
import ThesisEmails from "../../components/thesis/ThesisEmails";

export class ThesisCreatePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            thesis: {
                id: undefined,
                authorFirstname: "",
                authorLastname: "",
                authorEmail: "",
                title: "",
                urkund: "",
                grade: "",
                graders: [],
                graderEval: "",
                studyfieldId: "",
                councilmeetingId: "",
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
        this.state.attachments.forEach(attachment => {
            form.append("attachment", attachment);
        })
        form.append("json", JSON.stringify(this.state.thesis));
        this.props.saveThesis(form);
    }

    deleteThesis = () => {
        this.props.deleteThesis(this.state.thesis.id);
    }

    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    }

    toggleEditing = () => {
        this.setState({ allowEdit: !this.state.allowEdit });
    }

    handleChange = (fieldName, fieldValue) => {
        console.log("thesis." + fieldName + " = " + fieldValue);
        const thesis = this.state.thesis;
        thesis[fieldName] = fieldValue;
        this.setState({ thesis });
    }

    addAttachment = (attachment) => {
        this.setState({ attachments: [...this.state.attachments, attachment] });
    }

    removeAttachment = (attachment) => {
        const attachments = this.state.attachments.filter(inList => inList !== attachment)
        this.setState({ attachments });
    }

    renderGraderSelecter() {
        const studyfieldGraders = this.props.persons.filter(person =>
            this.props.roles.find(role =>
                (role.name == 'grader' || role.name == 'supervisor')
                && role.personId == person.personId
                && role.studyfieldId == this.state.thesis.studyfieldId
            )
        )
        return <PersonSelecter
            persons={studyfieldGraders}
            selected={this.state.thesis.graders}
            changeList={(list) => this.handleChange("graders", list)}
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
                        allowEdit={this.state.allowEdit} />
                    {this.renderGraderSelecter()}
                    <AttachmentAdder attachments={this.state.attachments} addAttachment={this.addAttachment} removeAttachment={this.removeAttachment} />
                    <br />
                    <ThesisCouncilmeetingPicker sendChange={this.handleChange} councilmeetings={this.props.councilmeetings} />
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
    user: state.user,
    councilmeetings: state.councilmeetings,
    studyfields: state.studyfields,
    roles: state.roles,
    theses: state.theses,
    persons: state.persons,
    agreements: state.agreements
});

export default connect(mapStateToProps, mapDispatchToProps)(ThesisCreatePage);