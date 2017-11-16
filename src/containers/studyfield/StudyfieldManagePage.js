import React, { Component } from "react";

import StudyfieldList from "../../components/studyfield/StudyfieldList";
import StudyfieldCreate from "../../components/studyfield/StudyfieldCreate";
import StudyfieldEdit from "../../components/studyfield/StudyfieldEdit";

export default class StudyfieldManagePage extends Component {

  constructor() {
    super();
    this.state = {
      studyfields: [],
      newStudyfield: { name: "" },
      updateStudyfield: undefined, 
    };
  }

  componentDidMount() {
    const studyfields = []//this.setUsersForStudyfields(this.props.Studyfields, this.props.Users);
    this.setState({ studyfields });
  }


  componentWillReceiveProps(newProps) {
    if (this.props.Studyfields !== newProps.Studyfields || this.props.Users !== newProps.Users) {
      const studyfields = []//this.setUsersForStudyfields(newProps.Studyfields, newProps.Users);
      this.setState({ studyfields });
    }
  }

  setUsersForStudyfields(studyfields, users) {
    return studyfields.map(field => {
      field.Users = users.filter(user => user.studyfieldId && parseInt(user.studyfieldId) === field.id);
      field.professor = users.find(user => user.studyfieldId && parseInt(user.studyfieldId) === field.id && user.role === "professor");
      field.professor = field.professor ? "" : `${field.professor.firstname} ${field.professor.lastname}`;
      return field;
    });
  }

  toggleStudyfieldActive = () => {
    const updateStudyfield = this.state.updateStudyfield;
    updateStudyfield.isActive = !updateStudyfield.isActive;
    this.setState({ updateStudyfield });
  }

  changeStudyfieldName = (formname) => (name) => {
    const studyfield = this.state[formname];
    studyfield.name = name;
    this.setState({ [formname]: studyfield });
  }

  saveStudyfield = () => {
    console.log("Save");
      //this.props.saveStudyfield(this.state.newStudyfield);
  }

  updateStudyfield = () => {
    console.log("Update");
      //this.props.updateStudyfield(this.state.updateStudyfield);
  }

  deleteStudyfield = () => {
    console.log("Delete")  
    //this.props.deleteStudyfield(this.state.updateStudyfield.id);
  }

  selectStudyfield = (studyfield) => {
      this.setState({ updateStudyfield: studyfield });
  }

  render() {
    return (
      <div className="ui form">
        <div className="ui two fields">
          <div className="field">
            <StudyfieldCreate
              sendSave={this.saveStudyfield}
              sendChange={this.changeStudyfieldName("newStudyfield")}
            />
            {this.state.updateStudyfield ?
              <StudyfieldEdit
                toggleActive={this.toggleStudyfieldActive}
                sendDelete={this.deleteStudyfield}
                sendUpdate={this.updateStudyfield}
                sendChange={this.changeStudyfieldName("updateStudyfield")}
                studyfield={this.state.updateStudyfield}
              /> : ''}
          </div>
          <div className="field">
            <h2 className="ui dividing header">Studyfields</h2>
            <p>
              All old and current studyfields. Press a studyfield to start editing it. Note that changing studyfield's
              name changes it for every thesis connected to that field. If a field is no longer valid set it inactive
              and create a new one rather than change old one's name.
            </p>
            <StudyfieldList
              selectField={this.selectStudyfield}
              studyfields={this.props.Studyfields}
            />
          </div>
        </div>
      </div>
    );
  }
}
import { connect } from "react-redux";
import { getStudyfields, saveStudyfield, updateStudyfield, deleteStudyfield } from "./studyfield.actions";

const mapStateToProps = (state) => {
  return {
    user: state.user,
    Studyfields: state.Studyfields,
    Users: state.users,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getStudyfields() {
    dispatch(getStudyfields());
  },
  saveStudyfield(data) {
    dispatch(saveStudyfield(data));
  },
  updateStudyfield(data) {
    dispatch(updateStudyfield(data));
  },
  deleteStudyfield(id) {
    dispatch(deleteStudyfield(id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StudyfieldListPage);
*/