import React, { Component } from 'react';
import { connect } from "react-redux";
import { saveAddedGrader, getSupervisors, deleteSupervisor, reviewSupervisor, updateSupervisor } from "./graderActions.js";

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

    handleUpdateSupervisor = (grader) => {
        this.props.updateSupervisor(grader);
    }

    handleDeleteGrader = (grader) => {
        this.props.deleteGrader(grader);
    }

    /*removeSupervisor = (grader) => (e) => {
        console.log("removed", grader);
        this.props.removeSupervisor(grader);
    }
    */

    toggleEditModal = (e, person) => {
        let newValue = !this.state.showReview;
        this.setState(
            {
                showReview: newValue,
                personToBeReviewed: person
            }
        );
    }

    renderList() {
        return (
            <div>
                <h2>List of thesis supervisors </h2>
                <div>At the moment showing all who are supervising a thesis now, in future only those needing approval?</div>
                <div>{this.props.graders.map((person, index) => (
                    <div key={index} className="two fields">
                        <div className="ui field">{person.title} {person.firstname} {person.lastname} studyfield: {person.studyfieldId}
                        </div>
                        <div className="ui field">
                            <button key={"review" + index} className="ui button" onClick={(e) => this.toggleEditModal(e, person)} >
                                Review Supervisor
                            </button>
                        </div>
                        <br />
                    </div>
                ))
                }
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="ui segment">
                Add and edit supervisor list here or review thesis projects. This page will be displayed to studyfields' professors and admins only.
                {this.renderList()}
                <Review showModal={this.state.showReview} closeModal={this.toggleEditModal} person={this.state.personToBeReviewed} reviewSupervisor={this.props.reviewSupervisor} />
                <h2>Edit supervisor list</h2>
                <GraderEditor saveGrader={this.handleSaveGrader} updateSupervisor={this.handleUpdateSupervisor} deleteGrader={this.handleDeleteGrader} graders={this.props.graders} />
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
    updateSupervisor(data) {
        dispatch(updateSupervisor(data));
    },
    deleteSupervisor(data) {
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