import React, { Component } from 'react';
import NavBar from '../../components/NavBar';
import { callApi } from "../../util/apiConnection.js";
import AssesmentInFinnish from '../../resources/assesmentInFinnish.json'

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

    renderAssesmentText() {
        //let assesment = JSON.stringify(AssesmentInFinnish, 1, '\n\n');
        let printable = "";
        let lista = [];
        for (var i = 0; i<AssesmentInFinnish.length; i++) {
            printable += "<h2>" + AssesmentInFinnish[i].title + "</h2>\n\n";
            lista[i] = AssesmentInFinnish[i].title;
            //console.log(AssesmentInFinnish[i]);
        }
        return "tähän perään assesment: " + lista;
    }

   // <tbody>{this.state.filteredTheses.map((thesis) =>
     //   <tr key={thesis.id}><td>{thesis.authorLastname}</td><td>{thesis.title}</td></tr>
       // )}</tbody>

    render() {
        return (
            <div className="App">
                <div className="ui inverted segment">
                    <h2>Assesment of theses</h2>
                </div>
                <NavBar active={"Assesment of theses"} />
                <div className="ui segment">
                    <p> tähän pitäisi palauttaa alle tekstiä <br/>
                        <h2>{ this.renderAssesmentText() }</h2>
                        
                    </p>
                </div>
            </div>
        );
    }
}

export default AssesmentOfTheses;
