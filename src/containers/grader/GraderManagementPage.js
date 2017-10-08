import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import service from "../../util/apiConnection.js";
import GraderEditor from "../components/grader/GraderEditor"

class GraderManagementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //something
        }
    }

    render() {
        return (
            <GraderEditor />
        );
    }
}




export default GraderManagementPage;