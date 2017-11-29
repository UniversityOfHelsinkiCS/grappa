import React, { Component } from "react";
import { Link } from "react-router"

import { connect } from "react-redux";
import { saveThesis, updateThesis, deleteThesis, downloadTheses } from './thesisActions';
import { updateGraders } from '../supervisor/supervisorActions';
import { getCouncilmeetings } from '../councilmeeting/councilmeetingActions';
import { sendReminder } from '../email/emailActions';
import { getStudyfields } from '../studyfield/studyfieldActions';

import ThesisConfirmModal from "../../components/thesis/ThesisConfirmModal";
import ThesisInformation from "../../components/thesis/ThesisInformation";
import ThesisUploadWidget from "../../components/thesis/ThesisUploadWidget";
import GraderSelecter from "../../components/supervisor/GraderSelecter";
import SupervisorEditor from "../../components/supervisor/SupervisorEditor";
import ThesisCouncilmeetingPicker from "../../components/thesis/ThesisCouncilmeetingPicker";
import ThesisEmails from "../../components/thesis/ThesisEmails"

export class ThesisManagePage extends Component {
    /**
     *  If editMode is false we are creating a new thesis
     *  If editMode is true and allowEdit is false, we are viewing a thesis
     *  If editMode is true and allowEdit is true, we are editing a thesis
     */
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
                studyfieldId: "",
                councilmeetingId: "",
                reviewFile: undefined,
                thesisProgress: {
                    ethesisReminder: undefined,
                    graderEvalReminder: undefined,
                    printReminder: undefined,
                    studentRegistrationNotification: undefined,
                    supervisingProfessorNotification: undefined,
                    ethesisDone: undefined,
                    graderEvalDone: undefined,
                    printDone: undefined,
                },
            },
            showModal: false,
            loading: false,
            editMode: true,
            allowEdit: true,
            allowGrading: false,
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.params.id) {
            //if there is such thing as "params.id" given as a prop we should be editing thesis with that id
            const thesis = newProps.theses.find(thesis => thesis.id === newProps.params.id)
            if (thesis) {
                this.setState({ thesis, editMode: true })
            }
        }
    }

    handleSaveThesis = () => {
        const form = new FormData();
        const file = this.state.pdfFile
        form.append("file", file);
        const thesis = this.state.thesis;
        //The pdf is appended to the form as a file, so we don't want it with the valuegroup
        thesis.pdfFile = undefined;
        form.append("json", JSON.stringify(thesis));

        console.log("saved thesis")
        console.log(thesis);
        //this.props.saveThesis(form);
    }

    deleteThesis = () => {
        console.log("Deleting");
        //this.props.deleteThesis(this.state.thesis.id);
    }

    handleAddGrader = (grader) => {
        const thesis = this.state.thesis;
        thesis.graders = [...thesis.graders, grader];
        this.setState({ thesis });
    }

    handleRemoveGrader = (grader) => {
        const thesis = this.state.thesis;
        thesis.graders = thesis.graders.filter(grdr => grdr !== grader);
        this.setState({ thesis });
    }

    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    }

    toggleEditing = () => {
        this.setState({ allowEdit: !this.state.allowEdit });
    }

    toggleGrading = () => {
        this.setState({ allowGrading: !this.state.allowGrading });
    }

    handleChange = (fieldName, fieldValue) => {
        console.log("thesis." + fieldName + " = " + fieldValue);
        const thesis = this.state.thesis;
        thesis[fieldName] = fieldValue;
        this.setState({ thesis });
    }

    handleEmail = (reminderType) => {
        console.log("sent email")
        console.log(reminderType);
        //this.props.sendReminder(this.state.thesis.id, reminderType);
    }

    setReminderDone = (reminderType) => {
        const thesisProgress = this.state.thesis.thesisProgress;
        if (reminderType === "EthesisReminder") {
            thesisProgress.ethesisDone = true;
        } else if (reminderType === "GraderEvalReminder") {
            thesisProgress.graderEvalDone = true;
        } else if (reminderType === "PrintReminder") {
            thesisProgress.printDone = true;
        }
        console.log("updated progress")
        console.log(thesisProgress);
        //this.props.updateThesisProgress(thesisProgress);
    }

    renderControlButtons() {
        //Admin controls
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
        /* Depending on user access state do stuff:
        return (
            <div className="field">
                {this.state.grading ?
                    <div className="ui blue button" onClick={this.saveThesis}>Save</div>
                    :
                    <div className="ui green button" onClick={this.toggleGrading}>Evaluate graders</div>
                }
                <button className="ui violet button" onClick={this.downloadThesis}>Download as PDF</button>
            </div>
        );
        return (
            <div className="field">
                <button className="ui violet button" onClick={this.downloadThesis}>Download as PDF</button>
            </div>
        );
        */
    }

    renderThesisFileButtons() {
        return (
            <div className="m-bot">
                <h3 className="ui dividing header">Thesis Files</h3>
                <p>
                    Click to open the pdf-document in a new tab.
                </p>
                <div className="three fields">
                    <div className="field">
                        <Link className="ui orange button" to={`/thesis/${this.state.updateThesis.values.id}/review`} target="_blank">
                            <i className="external icon"></i>
                            Review
                        </Link>
                    </div>
                    <div className="field">
                        <Link className="ui orange button" to={`/thesis/${this.state.updateThesis.values.id}/abstract`} target="_blank">
                            <i className="external icon"></i>
                            Abstract
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    renderUploadFile() {
        if (!this.state.editMode) {
            return (
                <div>
                    <h3 className="ui dividing header">Upload Thesis files</h3>
                    <ThesisUploadWidget sendChange={this.handleChange} currentFile={this.state.thesis.reviewFile} type={"reviewFile"} />
                </div>
            )
        } else if (this.state.allowEdit && this.state.editMode) {
            return (
                <div>
                    <h3 className="ui dividing header">Upload Thesis files</h3>
                    <div className="two fields">
                        <ThesisUploadWidget sendChange={this.handleChange} currentFile={this.state.thesis.reviewFile} type={"reviewFile"} />
                        <ThesisUploadWidget sendChange={this.handleChange} currentFile={this.state.thesis.abstractFile} type={"abstractFile"} />
                    </div>
                </div>
            )
        }
    }

    //GraderEditor ei tule olemaan tällä sivulla vaan GraderManagement-sivulla
    //TODO: Grader Editor + Supervisor Editor fix
    renderGraderControl() {
        return (
            <div>
                <p>
                    Thesis has to have a minimun of two graders and if
                    one of them isn't at least a professor and the other a doctor an evaluation of
                    the graders will be done by the thesis' studyfield's professor.
                </p>
                <GraderSelecter graders={this.props.graders ? this.props.graders : []} alreadySelected={this.state.thesis.graders} addSupervisor={this.handleAddGrader} removeGrader={this.handleRemoveGrader} allowEdit={this.state.allowEdit || !this.state.editMode} />
                {(this.state.allowEdit || !this.state.editMode) ? <SupervisorEditor supervisors={this.props.supervisor ? this.props.supervisors : []} /> : undefined}
            </div>
        )
    }

    renderEmails() {
        return (
            <ThesisEmails thesisProgress={this.state.thesis.thesisProgress} sendEmail={this.handleEmail} sendDone={this.setReminderDone} />
        )
    }

    render() {
        const meetings = [{ id: 1, date: new Date(), instructorDeadline: new Date() }, { id: 2, date: new Date(), instructorDeadline: new Date() }]
        return (
            <div>
                <ThesisConfirmModal sendSaveThesis={this.handleSaveThesis} closeModal={this.toggleModal} showModal={this.state.showModal} />
                <div className="ui form">
                    {this.state.editMode ? this.renderControlButtons() : undefined}
                    <ThesisInformation sendChange={this.handleChange} thesis={this.state.thesis} studyfields={this.props.studyfields ? this.props.studyfields : []} allowEdit={this.state.allowEdit} />
                    {this.renderUploadFile()}
                    {this.renderGraderControl()}
                    {(this.state.allowEdit || !this.state.editMode) ? <ThesisCouncilmeetingPicker sendChange={this.handleChange} councilMeetings={meetings} /> : undefined}
                    {(this.state.allowEdit && this.state.editMode) ? this.renderEmails() : undefined}
                </div>
                <button className="ui primary button" onClick={this.toggleModal}>
                    Submit
                </button>
            </div>
        )
    }
}
/*
  render() {
    return (
      <div>
        <ThesisConfirmModal sendAddThesis={this.handleSaveThesis} closeModal={this.toggleModal} showModal={this.state.showModal} />
        <div className="ui form">
          <h2 className="ui dividing header">{this.state.editMode ? "Edit " + this.state.thesis.title : "Create a thesis" }</h2>
          <ThesisInformation thesis={this.state.thesis} sendChange={this.handleChange} studyFields={this.props.StudyFields} editing={this.state.allowEdit} />
          {this.renderUploadFile()}
          {this.renderGraderControl()}
          <ThesisCouncilMeetingPicker councilMeetings={this.props.councilMeetings} sendChange={this.handleChange} editing={this.state.allowEdit} />
          {this.state.editMode ? this.renderEmails() : ""}
        </div>
        <button className="ui primary button" onClick={this.toggleModal}>
          Submit
        </button>
      </div>
    );
  }
}*/

const mapDispatchToProps = (dispatch) => ({
    saveThesis(thesis) {
        dispatch(saveThesis(thesis));
    },
    updateThesis(thesis) {
        dispatch(updateThesis(thesis));
    },
    deleteThesis(thesisId) {
        dispatch(deleteThesis(thesisId));
    },
    downloadTheses(theses) {
        dispatch(downloadTheses(theses));
    },
    getCouncilmeetings() {
        dispatch(getCouncilmeetings());
    },
    getStudyfields() {
        dispatch(getStudyfields());
    },
    updateGraders(graders) {
        dispatch(updateGraders(graders));
    },
    sendReminder(thesisId, type) {
        dispatch(sendReminder(thesisId, type));
    },
});

const mapStateToProps = (state) => {
    return {
        user: state.user,
        councilmeetings: state.councilmeeting,
        studyfields: state.studyfields,
        graders: state.graders,
        theses: state.theses,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ThesisManagePage);