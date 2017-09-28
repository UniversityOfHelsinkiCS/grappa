import React, { Component } from "react";
import { browserHistory, Link } from "react-router";

import ThesisConfirmModal from "./components/thesis/ThesisConfirmModal";

import ThesisInformation from "../components/thesis/ThesisInformation";
import ThesisUploadWidget from "../components/thesis/ThesisUploadWidget";

import GraderSelector from "../components/grader/GraderSelector";
import GraderEditor from ".../components/grader/GraderEditor";

import ThesisCouncilmeetingPicker from "../components/thesis/ThesisCouncilmeetingPicker";

import ThesisEmails from "../components/thesis/ThesisEmails"

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
          studyfieldId: "",
          councilmeetingId: "",
          pdfFile: undefined,
      },
      showModal: false,
      loading: false,
    }
  }

  handleAddThesis = () => {
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

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  }

  handleChange = (fieldName, fieldValue) => {
      this.setState({ [fieldName]: [fieldValue] });
  }

  render() {
    return (
      <div>
        <ThesisConfirmModal sendAddThesis={this.handleAddThesis} closeModal={this.toggleModal} showModal={this.state.showModal} />
        <div className="ui form">
          <h2 className="ui dividing header">Create a thesis</h2>
          <ThesisInformation errors={this.state.newThesis.errors} thesis={this.state.newThesis.values} sendChange={this.handleChange} studyFields={this.props.StudyFields} editing />
          <h3 className="ui dividing header">Upload Thesis files</h3>
          <ThesisUploadWidget errors={this.state.newThesis.errors} sendChange={this.handleChange} currentFile={this.state.newThesis.values.PdfFile.name} type={"newThesisReview"} />
          <ThesisGraders errors={this.state.newThesis.errors} updateOrNew={"newThesis"} graders={this.props.Graders} alreadySelected={this.state.newThesis.values.Graders} editing={true} />
          {isProfessor || isAdmin ? <GraderListCreateUpdate editable /> : ""}
          <ThesisCouncilMeetingPicker errors={this.state.newThesis.errors} councilMeetings={this.props.CouncilMeetings} sendChange={this.handleChange} editing={true} />
        </div>
        <button className="ui primary button" onClick={this.toggleModal}>
          Submit
        </button>
      </div>
    );
  }
}

/*
import { connect } from "react-redux";

import { saveThesis, updateThesis, deleteThesis, downloadTheses } from '????';
import { etc. } from 'etc.'

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
    councilMeetings: state.councilMeeting,
    studyFields: state.studyFields,
    graders: state.graders,
    theses: state.theses,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ThesisCreatePage);
*/