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


    renderAssesment() {
        return AssesmentInFinnish.map(all => (
            <div>
                <h2>{all.title}</h2>
                <p>{all.text}</p>
                <ul class= "ui list"> {all.list !== undefined &&
                    all.list.map(lista => (
                        <li><b>{lista.title}</b> {lista.text}</li>
                    ))
                }
                </ul>
            </div>
        ))
    }

    renderTitles() {
        return <div>
            <b>
            HELSINGIN YLIOPISTO<br/>
            2.8.2017<br/>
            Opintoasiainneuvosto<br/>
            <h1>Ylempään korkeakoulututkintoon sisältyvän pro gradu -tutkielman arviointi</h1>
            </b>
            </div>
    }

    render() {
        return (
            <div className="App">
                <div className="ui inverted segment">
                    <h2>Assesment of theses</h2>
                </div>
                <NavBar active={"Assesment of theses"} />
                <div className="ui left aligned segment">
                    {this.renderTitles()},
                    {this.renderAssesment()}
                </div>
            </div >
        );
    }
}

export default AssesmentOfTheses;
