import React, { Component } from 'react';
import { arrayOf, func } from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';

import { connect } from 'react-redux';
import {
    getCouncilmeetings,
    saveCouncilmeeting,
    updateCouncilmeeting,
    deleteCouncilmeeting
} from './councilmeetingActions';
import NewCouncilmeetingForm from '../../components/councilmeeting/NewCouncilmeetingForm';
import UpdateCouncilmeetingForm from '../../components/councilmeeting/UpdateCouncilmeetingForm';
import CouncilmeetingList from '../../components/councilmeeting/CouncilmeetingList';
import { councilmeetingType, programmeType } from '../../util/types';

export class CouncilmeetingManagePage extends Component {
    constructor() {
        super();
        this.state = {
            newCouncilmeeting: { instructorDeadlineDays: 8, studentDeadlineDays: 8 },
            updateCouncilmeeting: {},
            showOld: false
        };
    }

    componentDidMount() {
        this.props.getCouncilmeetings();
    }

    handleDateChange = (formname, name) => (date) => {
        const meeting = this.state[formname];
        meeting[name] = date;
        this.setState({ [formname]: meeting });
    };

   handleChange = (formname, name) => (event) => {
       const meeting = this.state[formname];
       meeting[name] = event.target.value;
       this.setState({ [formname]: meeting });
   };

   handleCheckboxChange = () => {
       this.setState({
           shownDates: !this.state.showOld ? this.state.formattedDates : this.state.filteredDates,
           showOld: !this.state.showOld
       });
   };

   saveMeeting = meeting => this.props.saveCouncilmeeting(meeting);
   updateMeeting = meeting => this.props.updateCouncilmeeting(meeting);
   selectMeeting = meeting => this.setState({ updateCouncilmeeting: meeting });
   deleteMeeting = meeting => this.props.deleteCouncilmeeting(meeting.councilmeetingId);

   render() {
       return (
           <div className="ui form">
               <div className="ui two fields">
                   <div className="field">
                       <NewCouncilmeetingForm
                           saveMeeting={this.saveMeeting}
                           programmes={this.props.programmes}
                       />
                       <UpdateCouncilmeetingForm
                           meeting={this.state.updateCouncilmeeting}
                           updateMeeting={this.updateMeeting}
                           programmes={this.props.programmes}
                       />
                   </div>
                   <div className="field">
                       <h2 className="ui dividing header">Upcoming councilmeetings</h2>
                       <p>
                          You can delete any meeting that has no theses linked to it.
                          Otherwise you have to remove/move them before you can delete a meeting.
                       </p>
                       <div className="ui checkbox">
                           <input
                               id="showPastDates"
                               type="checkbox"
                               checked={this.state.showOld ? 'true' : ''}
                               onChange={this.handleCheckboxChange}
                           />
                           <label htmlFor="showPastDates">Show also past dates</label>
                       </div>
                       <CouncilmeetingList
                           meetings={this.props.councilmeetings}
                           selectMeeting={this.selectMeeting}
                           deleteMeeting={this.deleteMeeting}
                           showOld={this.state.showOld}
                           programmes={this.props.programmes}
                       />
                   </div>
               </div>
           </div>
       );
   }
}

const mapStateToProps = state => ({
    councilmeetings: state.councilmeetings,
    programmes: state.programmes
});

const mapDispatchToProps = dispatch => ({
    getCouncilmeetings() {
        dispatch(getCouncilmeetings());
    },
    saveCouncilmeeting(data) {
        dispatch(saveCouncilmeeting(data));
    },
    updateCouncilmeeting(data) {
        dispatch(updateCouncilmeeting(data));
    },
    deleteCouncilmeeting(data) {
        dispatch(deleteCouncilmeeting(data));
    }
});

CouncilmeetingManagePage.propTypes = {
    councilmeetings: arrayOf(councilmeetingType).isRequired,
    getCouncilmeetings: func.isRequired,
    saveCouncilmeeting: func.isRequired,
    updateCouncilmeeting: func.isRequired,
    deleteCouncilmeeting: func.isRequired,
    programmes: arrayOf(programmeType).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(CouncilmeetingManagePage);
