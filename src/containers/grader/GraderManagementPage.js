import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import service from "../../util/apiConnection.js";
import GraderEditor from "../../components/grader/GraderEditor.js"

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

    render() {
        return (
            <div className="App">
                <p>
                    Thesis has to have a minimun of two graders and if
                    one of them isn't at least a professor and the other a doctor an evaluation of
                    the graders will be done by the thesis' studyfield's professor.
                </p>

                <GraderEditor graders={[{
                    title: "Dr.",
                    name: "Nimi",
                    id: 1
                },
                {
                    title: "Prof.",
                    name: "Nimi2",
                    id: 2
                }]} />

                <div className="ui segment">
                    <p><Link to="/"> Go back to HomePage</Link></p>
                </div>
            </div>
        );
    }
}

export default GraderManagementPage;