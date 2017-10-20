import React, { Component } from 'react';
import NavBar from '../../components/NavBar';
import { callApi } from "../../util/apiConnection.js";

class AssesmentOfTheses extends Component {

    componentDidMount() {
        document.title = "Assesment of Theses";

    }

   /* handleFilteringTheses = (e) => {
        var value = e.target.value.toLowerCase();
        //if searchTerm is empty set filteredTheses = theses, else filter theses based on searchTerm
        var filtered = (value === "") ? this.state.theses : this.state.theses.filter((thesis) =>
            (thesis.authorLastname.toLowerCase().includes(value) || thesis.authorFirstname.toLowerCase().includes(value) || thesis.title.toLowerCase().includes(value) || thesis.grade.toString() === value)
        );
        this.setState(
            {
                filteredTheses: filtered,
                searchTerm: value
            }
        );
    }
    */

    render() {
        return (
            <div className="App">
                <div className="ui inverted segment">
                    <h2>Assesment of theses</h2>
                </div>
                <NavBar active={""} />
                <div className="ui fluid category search">
                    
                </div>
            </div>
                );
    }
}

export default AssesmentOfTheses;
