import React, { Component } from "react";
import { Link } from "react-router"

import { connect } from "react-redux";
import { saveThesis, updateThesis, deleteThesis } from './thesisActions';
import { getGraders } from '../grader/graderActions';
import { getCouncilmeetings } from '../councilmeeting/councilmeetingActions';
import { sendReminder } from '../email/emailActions';
import { getStudyfields } from '../studyfield/studyfieldActions';

import ThesisConfirmModal from "../../components/thesis/ThesisConfirmModal";
import ThesisInformation from "../../components/thesis/ThesisInformation";
import AttachmentAdder from "../../components/attachment/AttachmentAdder";
import GraderSelecter from "../../components/supervisor/GraderSelecter";
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
                printDone: undefined,
                thesisEmails: {
                    graderEvalReminder: undefined,
                    printReminder: undefined,
                },
                attachments: [],
            },
            showModal: false,
            loading: false,
            editMode: false,
            allowEdit: true,
            allowGrading: false,
        }
    }

    componentDidMount() {
        this.props.getStudyfields();
        this.props.getCouncilmeetings();
        this.props.getGraders();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.params && newProps.params.id) {
            //if there is such thing as "params.id" given as a prop we should be editing thesis with that id
            const thesis = newProps.theses.find(thesis => thesis.id === newProps.params.id)
            if (thesis) {
                this.setState({ thesis, editMode: true })
            }
        }
    }

    handleSaveThesis = () => {
        const thesis = this.state.thesis;
        this.props.saveThesis(thesis);
    }

    deleteThesis = () => {
        this.props.deleteThesis(this.state.thesis.id);
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

    addAttachment = (attachment) => {
        const thesis = this.state.thesis;
        thesis.attachments = [...thesis.attachments, attachment];
        this.setState({ thesis });
    }

    removeAttachment = (attachment) => {
        const thesis = this.state.thesis;
        thesis.attachments = thesis.attachments.filter(inList => inList !== attachment)
        this.setState({ thesis });
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

    renderEmails() {
        return <ThesisEmails thesisProgress={this.state.thesis.thesisProgress} sendEmail={this.handleEmail} sendDone={this.setReminderDone} />
    }

    renderGraderSelecter() {
        const studyfieldGraders = this.props.graders
        return <GraderSelecter graders={studyfieldGraders}/>        
    }

    render() {
        return (
            <div>
                <br />
                <ThesisConfirmModal sendSaveThesis={this.handleSaveThesis} closeModal={this.toggleModal} showModal={this.state.showModal} />
                <div className="ui form">
                    {this.state.editMode ? this.renderControlButtons() : undefined}
                    <ThesisInformation sendChange={this.handleChange} thesis={this.state.thesis} studyfields={this.props.studyfields ? this.props.studyfields : []} allowEdit={this.state.allowEdit} />
                    {this.renderGraderSelecter()}
                    <AttachmentAdder attachments={this.state.thesis.attachments} addAttachment={this.addAttachment} removeAttachment={this.removeAttachment} />
                    <br />
                    {(this.state.allowEdit || !this.state.editMode) ? <ThesisCouncilmeetingPicker sendChange={this.handleChange} councilmeetings={this.props.councilmeetings} /> : undefined}
                    {(this.state.allowEdit && this.state.editMode) ? this.renderEmails() : undefined}
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
    updateThesis(thesis) {
        dispatch(updateThesis(thesis));
    },
    deleteThesis(thesisId) {
        dispatch(deleteThesis(thesisId));
    },
    getCouncilmeetings() {
        dispatch(getCouncilmeetings());
    },
    getStudyfields() {
        dispatch(getStudyfields());
    },
    getGraders() {
        dispatch(getGraders());
    },
    sendReminder(thesisId, type) {
        dispatch(sendReminder(thesisId, type));
    },
});

const mapStateToProps = (state) => {
    return {
        user: state.user,
        councilmeetings: state.councilmeeting,
        studyfields: state.studyfield,
        graders: state.graders,
        theses: state.theses,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ThesisManagePage);