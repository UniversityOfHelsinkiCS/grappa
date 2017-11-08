import React, { Component } from 'react';
//import service from "../../util/apiConnection.js";
import { callApi } from "../../util/apiConnection.js";
import GraderEditor from "../../components/grader/GraderEditor.js"
//import ThesisList from "../../components/thesis/ThesisList.js"
import { connect } from "react-redux";
import { saveAddedGrader, saveUpdatedGrader, getGraders } from "../../components/grader/GraderActions.js";
import Review from "../../components/grader/Review.js";

export class GraderManagementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            supervisors: [],
            agreementPersons: [],
            personToBeReviewed: null,
            showReview: false
        }
    }

    componentDidMount() {
        document.title = "Grader and Supervisor Management";
        callApi("/supervisors").then((resp) => {
            let supervisors = resp.data.map((supervisors) => supervisors);
            this.setState({ supervisors: supervisors });
        }).catch((error) => console.error(error));

        callApi("/supervisors/agreementPersons").then((resp) => {
            let persons = resp.data.map((persons) => persons);
            this.setState({ agreementPersons: persons });
        }).catch((error) => console.error(error));
    }

    handleSaveGrader = (grader) => {
        this.props.saveAddedGrader(grader);
    }

    handleUpdateGrader = (grader) => {
        this.props.saveUpdatedGrader(grader);
    }

    /* <h2>Thesis projects</h2>
                    <ThesisList fields={4} />

                    <h2>List of all supervisors</h2>
                    <ul class="ui list"> {this.state.supervisors.map(supervisor => (
                        <li> {supervisor.title} {supervisor.firstname} {supervisor.lastname} studyfield: {supervisor.studyfieldId}</li>
                    ))
                    }
                    </ul>
     */

    toggleEditModal = () => {
        var newValue = !this.state.showReview;
        this.setState(
            {
                showReview: newValue
            }
        );
    }

    render() {
        return (
            <div className="App">
                <div className="ui left aligned segment">
                    <p>
                        Add and edit supervisor list here or review thesis projects (to be added soon!). This page will be displayed to studyfields' professors and admins only.
                    </p>

                    <h2>List of thesis supervisors needing approval</h2>
                    <ul class="ui list"> {this.state.agreementPersons.map(person => (
                        <li>{person.title} {person.firstname} {person.lastname} studyfield: {person.studyfieldId}
                            &nbsp;&nbsp;
                            <button key={person.personId} className="ui button" onClick={ this.toggleEditModal }>
                                Review Supervisor
                            </button>
                        </li>
                    ))
                    }
                    </ul>

                    <Review showModal={ this.state.showReview } closeModal={this.toggleEditModal}/>

                    <h2>Edit supervisor list</h2>
                    <p>Updating not working on backend yet, sorry</p>
                    <GraderEditor saveGrader={this.handleSaveGrader} updateGrader={this.handleUpdateGrader} graders={
                        this.state.supervisors.map(supervisor => (supervisor))
                    } />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    saveAddedGrader: function (data) {
        dispatch(saveAddedGrader(data));
    },
    saveUpdatedGrader: function (data) {
        dispatch(saveUpdatedGrader(data));
    },
    getGraders: function (data) {
        dispatch(getGraders(data));
    },
});

const mapStateToProps = (state) => {
    return { graders: state.graders };
}

export default connect(mapStateToProps, mapDispatchToProps)(GraderManagementPage);