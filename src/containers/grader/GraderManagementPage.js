import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import service from "../../util/apiConnection.js";
import GraderEditor from "../../components/grader/GraderEditor.js"

import { connect, subscribe } from "react-redux";
import { saveAddedGrader, saveUpdatedGrader, getGraders } from "../../components/grader/GraderActions.js";

class GraderManagementPage extends Component {
    /*constructor(props) {
        super(props);
        this.state = {
            //something
        }
    }
    */

    componentDidMount() {
        document.title = "Grappa: Grader Management";
    }

    getLastGraderAction() {
        const forReturn = this.props.graders[this.props.graders.length - 1];

        return (forReturn === undefined ? {} : forReturn);
    }

    handleSaveGrader = (grader) => {
        //console.log(grader);
        this.props.saveAddedGrader(grader);
    }

    handleUpdateGrader = (grader) => {
        this.props.saveUpdatedGrader(grader);
    }

    render() {
        return (
            <div className="App">
                <div className="ui inverted segment">
                    <h2>Grader Management</h2>
                </div>

                <div className="ui segment">
                    <p>
                        Thesis has to have a minimum of two graders and if
                        one of them isn't at least a professor and the other a doctor an evaluation of
                        the graders will be done by the thesis' studyfield's professor.
                    </p>

                    <GraderEditor saveGrader={this.handleSaveGrader} updateGrader={this.handleUpdateGrader} graders={[{
                        //mockdata so that updateGrader doesn't crash
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
//export default GraderManagementPage;