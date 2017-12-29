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

export class ThesisEditPage extends Component {
    /**
     *  If allowEdit is false, we are viewing a thesis
     *  If allowEdit is true, we are editing a thesis
     */
    constructor(props) {
        super(props);
        this.state = {
            attachments: [],
            showModal: false,
            allowEdit: true,
        }
    }

    componentDidMount() {
        this.init(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.init(newProps);
    }

    init(props) {
        if (props.match.params && props.match.params.id) {
            const thesisId = props.match.params.id;
            //if there is such thing as "params.id" given as a prop we should be viewing thesis with that id
            const thesis = this.findAndFormatThesis(props.theses, props.persons, props.agreements, thesisId)
            if (thesis) {
                this.setState({ thesis, editMode: true })
            }
        }
    }

    findAndFormatThesis = (theses, persons, agreements, thesisId) => {
        try {
            const thesis = theses.find(thesis => thesis.thesisId == thesisId);
            const agreement = agreements.find(agreement => agreement.thesisId === thesis.thesisId);
            const author = persons.find(person => person.personId === agreement.authorId);

            thesis.authorFirstname = author.firstname;
            thesis.authorLastname = author.lastname;
            thesis.authorEmail = author.email;

            thesis.studyfieldId = agreement.studyfieldId;
            thesis.graders = persons.filter(person =>
                this.props.roles.find(role =>
                    role.personId === person.personId &&
                    role.agreementId === agreement.agreementId
                )
            );
            thesis.thesisEmails = {
                graderEvalReminder: undefined,
                printReminder: undefined,
            }
            return thesis;
        } catch (error) {
            return undefined
        }
    }


    handleSaveThesis = () => {
        const thesisIsNew = !this.state.thesis.id;
        const form = new FormData();
        this.state.attachments.forEach(attachment => {
            form.append("attachment", attachment);
        })
        form.append("json", JSON.stringify(this.state.thesis));
        if (thesisIsNew) {
            this.props.saveThesis(form);
        } else {
            this.props.updateThesis(form);
        }
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

    handleEmail = (reminderType) => {
        this.props.sendReminder(this.state.thesis.id, reminderType);
    }

    renderControlButtons() {
        //Admin controls
        if (this.props.user.roles.find(studyfieldRole => studyfieldRole.role === 'admin')) {
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
    }

    renderEmails() {
        const thesisEmails = this.state.thesis.thesisEmails;
        return undefined;
        /*return <ThesisEmails
            thesisEmails={thesisEmails}
            sendEmail={this.handleEmail}
            sendDone={this.setReminderDone} />
            */
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
                    {this.renderControlButtons()}
                    <ThesisInformation sendChange={this.handleChange}
                        thesis={this.state.thesis}
                        studyfields={this.props.studyfields}
                        allowEdit={this.state.allowEdit} />
                    {this.renderGraderSelecter()}
                    <AttachmentAdder attachments={this.state.attachments} addAttachment={this.addAttachment} removeAttachment={this.removeAttachment} />
                    <br />
                    {(this.state.allowEdit) ? <ThesisCouncilmeetingPicker sendChange={this.handleChange} councilmeetings={this.props.councilmeetings} /> : undefined}
                    {(this.state.allowEdit) ? this.renderEmails() : undefined}
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
    updateThesis(thesis) {
        dispatch(updateThesis(thesis));
    },
    deleteThesis(thesisId) {
        dispatch(deleteThesis(thesisId));
    },
    sendReminder(thesisId, type) {
        dispatch(sendReminder(thesisId, type));
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

export default connect(mapStateToProps, mapDispatchToProps)(ThesisEditPage);