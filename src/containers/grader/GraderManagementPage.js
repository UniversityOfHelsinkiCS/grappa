import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import service from "../../util/apiConnection.js";
import { callApi } from "../../util/apiConnection.js";
import GraderEditor from "../../components/grader/GraderEditor.js"
import ThesisList from "../../components/thesis/ThesisList.js"
import { connect } from "react-redux";
import { saveAddedGrader, saveUpdatedGrader, getGraders } from "../../components/grader/GraderActions.js";

export class GraderManagementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            supervisors: []
        }
    }

    componentDidMount() {
        document.title = "Grader and Supervisor Management";
        callApi("/supervisors").then((resp) => {
            let supervis = resp.data.map((superviso) => superviso);
            this.setState(
                {
                    supervisors: supervis
                }
            );
        }).catch((error) => console.error(error));
    }

    handleSaveGrader = (grader) => {
        this.props.saveAddedGrader(grader);
    }

    handleUpdateGrader = (grader) => {
        this.props.saveUpdatedGrader(grader);
    }

    render() {
        return (
            <div className="App">
                <div className="ui left aligned segment">
                    <p>
                        Add and edit supervisor list here or review thesis projects (to be added soon!). This page will be displayed to studyfields' professors and admins only.
                    </p>

                    <h2>Thesis projects</h2>
                    {<ThesisList />}

                    <h2>List of all supervisors</h2>
                    <ul class="ui list"> {this.state.supervisors.map(supervisor => (
                        <li> {supervisor.title} {supervisor.firstname} {supervisor.lastname} studyfield: {supervisor.studyfieldId}</li>
                    ))
                    }
                    </ul>

                    <h2>Edit supervisor list</h2>
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