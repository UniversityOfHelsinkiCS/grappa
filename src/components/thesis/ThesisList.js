import React, { Component } from 'react';
import { Link } from 'react-router-dom';
const service = require("../../util/apiConnection.js");

class ThesisList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theses: [],
            filteredTheses: [],
            searchTerm: ""
        }
    }

    componentDidMount() {
        document.title = "Thesis List Page";
        service.oldGet("/theses").then((resp) => {
            var theses = resp.data.map((thesis) => thesis);
            this.setState(
                {
                    theses: theses,
                    filteredTheses: theses
                }
            );
        }).catch((error) => console.error(error));
    }

    handleFilteringTheses = (e) => {
        var value = e.target.value.toLowerCase();
        //if searchTerm is empty set filteredTheses = theses, else filter theses based on searchTerm
        var filtered = (value === "") ? this.state.theses : this.state.theses.filter((thesis) =>
            (thesis.authorLastname.toLowerCase().includes(value) || thesis.authorFirstname.toLowerCase().includes(value) ||  thesis.title.toLowerCase().includes(value) || thesis.grade.toString() === value)
        );
        this.setState(
            {
                filteredTheses: filtered,
                searchTerm: value
            }
        );
    }

    render() {
        return (
            <div className="App">
                <div className="ui inverted segment">
                    <h2>Thesis List</h2>
                </div>
                <div className="ui fluid category search">
                    <div className="ui icon input">
                        <input className="prompt" value={this.state.searchTerm} type="text" placeholder="Filter theses" onChange={this.handleFilteringTheses} />
                        <i className="search icon"></i>
                    </div>
                </div>
                <table className="ui celled table">
                    <thead>
                        <tr>
                            <th>Author</th>
                            <th>Title</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>{this.state.filteredTheses.map((thesis) =>
                        <tr key={thesis.id}><td>{thesis.authorLastname + ", " + thesis.authorFirstname}</td><td>{thesis.title}</td><td>{thesis.grade}</td></tr>
                    )}</tbody>
                </table>
                <div className="ui segment">
                    <p><Link to="/"> Go back to HomePage</Link></p>
                </div>
            </div>
        );
    }
}

export default ThesisList;
