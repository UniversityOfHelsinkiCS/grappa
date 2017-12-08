import React, { Component } from 'react';
import { connect } from "react-redux";
import { saveAddedSupervisor, getSupervisors, getAgreementPersons, deleteSupervisor, reviewSupervisor, updateSupervisor } from "./supervisorActions.js";

import Review from "../../components/supervisor/Review.js";
import SupervisorEditor from "../../components/supervisor/SupervisorEditor.js"

export class SupervisorManagementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agreementPersons: [],
            personToBeReviewed: null,
            showReview: false
        }
    }

    componentDidMount() {
        this.props.getAgreementPersons();
        document.title = "Supervisor Management";
    }

    handleSaveSupervisor = (supervisor) => {
        this.props.saveAddedSupervisor(supervisor);
    }

    handleUpdateSupervisor = (supervisor) => {
        this.props.updateSupervisor(supervisor);
    }

    handleDeleteSupervisor = (supervisor) => {
        this.props.deleteSupervisor(supervisor);
    }

    /*removeSupervisor = (supervisor) => (e) => {
        console.log("removed", supervisor);
        this.props.removeSupervisor(supervisor);
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
                <div>{this.props.supervisors.map((person, index) => (
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
        if (!this.props.supervisors) {
            return <div>nothing here</div>
        }
        return (
            <div className="ui segment">
                Add and edit supervisor list here or review thesis projects. This page will be displayed to studyfields' professors and admins only.
                {this.renderList()}
                <Review showModal={this.state.showReview} closeModal={this.toggleEditModal} person={this.state.personToBeReviewed} reviewSupervisor={this.props.reviewSupervisor} />
                <h2>Edit supervisor list</h2>
                <SupervisorEditor saveSupervisor={this.handleSaveSupervisor} updateSupervisor={this.handleUpdateSupervisor} deleteSupervisor={this.handleDeleteSupervisor} supervisors={this.props.supervisors} />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    saveAddedSupervisor(data) {
        dispatch(saveAddedSupervisor(data));
    },
    getSupervisors(data) {
        dispatch(getSupervisors());
    },
    getAgreementPersons(data) {
        dispatch(getAgreementPersons(data));
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
        supervisors: state.supervisors,
        personToBeReviewed: state.person
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SupervisorManagementPage);