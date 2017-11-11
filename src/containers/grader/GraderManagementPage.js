import React, { Component } from 'react';
//import service from "../../util/apiConnection.js";
import { callApi } from "../../util/apiConnection.js";
import GraderEditor from "../../components/grader/GraderEditor.js"
//import ThesisList from "../../components/thesis/ThesisList.js"
import { connect } from "react-redux";
import { saveAddedGrader, getSupervisors, deleteSupervisor } from "../../components/grader/GraderActions.js";
import Review from "../../components/grader/Review.js";

export class GraderManagementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agreementPersons: [],
            personToBeReviewed: null,
            showReview: false
        }
        this.props.getSupervisors();        
    }

    componentDidMount() {
        document.title = "Grader and Supervisor Management";

        /*callApi("/supervisors").then((resp) => {
            let supervisors = resp.data.map((supervisors) => supervisors);
            this.setState({ supervisors: supervisors });
        }).catch((error) => console.error(error));

        callApi("/supervisors/agreementPersons").then((resp) => {
            let persons = resp.data.map((persons) => persons);
            this.setState({ agreementPersons: persons });
        }).catch((error) => console.error(error));
        */
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
                <Review showModal={this.state.showReview} closeModal={this.toggleEditModal} person={this.state.personToBeReviewed} />
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
    }
});

const mapStateToProps = (state) => {
    return { 
        graders: state.grader
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(GraderManagementPage);