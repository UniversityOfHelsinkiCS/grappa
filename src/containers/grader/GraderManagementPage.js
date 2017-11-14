import React, { Component } from 'react';
import { connect } from "react-redux";
import { saveAddedGrader, getSupervisors, deleteSupervisor } from "./graderActions.js";

import Review from "../../components/grader/Review.js";
import GraderEditor from "../../components/grader/GraderEditor.js"

export class GraderManagementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agreementPersons: [],
            personToBeReviewed: null,
            showReview: false
        }
                
    }

    componentDidMount() {
       this.props.getSupervisors();
       document.title = "Grader and Supervisor Management";
    }
    
    handleSaveGrader = (grader) => {
        this.props.saveAddedGrader(grader);
    }

    handleUpdateGrader = (grader) => {
        this.props.saveUpdatedGrader(grader);
    }

    removeSupervisor = (grader) => (e) => {
        console.log("removed", grader);
        this.props.removeSupervisor(grader);
    }

    toggleEditModal = (e, person) => {
        let newValue = !this.state.showReview;
        this.setState(
            {
                showReview: newValue,
                personToBeReviewed: person
            }
        );
    }

    render() {
        return (
            <div className="ui segment">
                <p>
                    Add and edit supervisor list here or review thesis projects. This page will be displayed to studyfields' professors and admins only.
                </p>
                <h2>List of thesis supervisors (atm showing all, in future those needing approval)</h2>
                <div>{this.props.graders.map(person => (
                    <div className="two fields">
                        <div className="ui field">{person.title} {person.firstname} {person.lastname} studyfield: {person.studyfieldId}
                            &nbsp;&nbsp;
                        </div>
                        <div className="ui field">
                            <button key={person.personId} className="ui button" onClick={(e) => this.toggleEditModal(e, person)} >
                                Review Supervisor
                            </button>
                            <button key={person.personId + "key"} className="ui negative disabled button" onClick={this.removeSupervisor(person)} >
                                Remove Supervisor
                            </button>
                        </div>
                        <br/>
                    </div>
                    
                ))
                }
                </div>
                <Review showModal={this.state.showReview} closeModal={this.toggleEditModal} person={this.state.personToBeReviewed} reviewSupervisor={this.props.reviewSupervisor} />
                <h2>Edit supervisor list</h2>
                <GraderEditor saveGrader={this.handleSaveGrader} updateGrader={this.handleUpdateGrader} graders={this.props.graders}/>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    saveAddedGrader(data) {
        dispatch(saveAddedGrader(data));
    },
    getSupervisors(data) {
        dispatch(getSupervisors());
    },
    removeSupervisor(data) {
        dispatch(deleteSupervisor(data));
    },
    reviewSupervisor(data) {
        dispatch(reviewSupervisor(data));
    }
});

const mapStateToProps = (state) => {
    return { 
        graders: state.grader,
        personToBeReviewed: state.person
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(GraderManagementPage);