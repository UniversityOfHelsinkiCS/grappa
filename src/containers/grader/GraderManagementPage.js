import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import service from "../../util/apiConnection.js";
import GraderEditor from "../../components/grader/GraderEditor.js"

import { connect } from "react-redux";
import { saveAddedGrader, saveUpdatedGrader, getGraders } from "../../components/grader/GraderActions.js";

export class GraderManagementPage extends Component {
    /*constructor(props) {
        super(props);
        this.state = {
            //something
        }
    }
    */

    componentDidMount() {
        document.title = "Grappa: Grader and Supervisor Management";
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
                <div className="ui inverted segment">
                    <h2>Thesis Supervisor Management</h2>
                </div>

                <div className="ui segment">
                    <p>
                        Add supervisors and edit the list of supervisors here. This page will be displayed to studyfields' professors and admins only.
                    </p>

                    <GraderEditor saveGrader={this.handleSaveGrader} updateGrader={this.handleUpdateGrader} graders={[{
                        //mockdata so that updateGrader doesn't crash before back end really gives data
                        title: "Dr.",
                        name: "Nimi",
                        id: 1
                    },
                    {
                        title: "Prof.",
                        name: "Nimi2",
                        id: 2
                    }]} />

                </div>

                <div className="ui segment">
                    <p><Link to="/"> Go back to homepage</Link></p>
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