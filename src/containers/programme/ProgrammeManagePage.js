import React, { Component } from 'react';
import { connect } from 'react-redux';

import StudyfieldList from '../../components/programme/ProgrammeList';
import StudyfieldCreate from '../../components/programme/ProgrammeCreate';
import StudyfieldEdit from '../../components/programme/ProgrammeEdit';
import { deleteProgramme, saveProgramme, updateProgramme } from './programmeActions';

class StudyfieldManagePage extends Component {
    constructor() {
        super();
        this.state = {
            programmes: [],
            newStudyfield: { name: '' },
            updateStudyfield: undefined
        };
    }

    componentDidMount() {
        const programmes = [];// this.setUsersForStudyfields(this.props.studfields, this.props.users);
        this.setState({ programmes });
    }


    componentWillReceiveProps(newProps) {
        if (this.props.studfields !== newProps.studfields || this.props.users !== newProps.users) {
            const programmes = [];// this.setUsersForStudyfields(newProps.studfields, newProps.users);
            this.setState({ programmes });
        }
    }

    setUsersForStudyfields(programmes, users) {
        return programmes.map((field) => {
            field.users = users.filter(user => user.programmeId && parseInt(user.programmeId) === field.id);
            field.professor = users.find(user => user.programmeId && parseInt(user.programmeId) === field.id && user.role === 'professor');
            field.professor = field.professor ? '' : `${field.professor.firstname} ${field.professor.lastname}`;
            return field;
        });
    }

  toggleStudyfieldActive = () => {
      const updateStudyfield = this.state.updateStudyfield;
      updateStudyfield.isActive = !updateStudyfield.isActive;
      this.setState({ updateStudyfield });
  }

  changeStudyfieldName = formname => (name) => {
      const programme = this.state[formname];
      programme.name = name;
      this.setState({ [formname]: programme });
  }

  saveStudyfield = () => {
      console.log('Save');
      // this.props.saveProgramme(this.state.newStudyfield);
  }

  updateStudyfield = () => {
      console.log('Update');
      // this.props.updateProgramme(this.state.updateProgramme);
  }

  deleteStudyfield = () => {
      console.log('Delete');
      // this.props.deleteProgramme(this.state.updateProgramme.id);
  }

  selectStudyfield = (programme) => {
      this.setState({ updateStudyfield: programme });
  }

  render() {
      return (
          <div className="ui form">
              <div className="ui two fields">
                  <div className="field">
                      <StudyfieldCreate
                          sendSave={this.saveStudyfield}
                          sendChange={this.changeStudyfieldName('newStudyfield')}
                      />
                      {this.state.updateStudyfield ?
                          <StudyfieldEdit
                              toggleActive={this.toggleStudyfieldActive}
                              sendDelete={this.deleteStudyfield}
                              sendUpdate={this.updateStudyfield}
                              sendChange={this.changeStudyfieldName('updateStudyfield')}
                              programme={this.state.updateStudyfield}
                          /> : ''}
                  </div>
                  <div className="field">
                      <h2 className="ui dividing header">Studyfields</h2>
                      <p>
              All old and current programmes. Press a programme to start editing it. Note that changing programme&lsquo;s
              name changes it for every thesis connected to that field. If a field is no longer valid set it inactive
              and create a new one rather than change old one&lsquo;s name.
                      </p>
                      <StudyfieldList
                          selectField={this.selectStudyfield}
                          programmes={this.props.studfields}
                      />
                  </div>
              </div>
          </div>
      );
  }
}

const mapStateToProps = state => ({
    user: state.user,
    programmes: state.programmes,
    users: state.users
});

const mapDispatchToProps = dispatch => ({
    saveStudyfield(data) {
        dispatch(saveProgramme(data));
    },
    updateStudyfield(data) {
        dispatch(updateProgramme(data));
    },
    deleteStudyfield(id) {
        dispatch(deleteProgramme(id));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StudyfieldManagePage);
