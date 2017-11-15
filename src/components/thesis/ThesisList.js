import React, { Component } from 'react';
import { callApi } from "../../util/apiConnection.js";

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
        callApi("/theses").then((resp) => {
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
            (thesis.authorLastname.toLowerCase().includes(value) || thesis.authorFirstname.toLowerCase().includes(value) || thesis.thesisTitle.toLowerCase().includes(value) || thesis.grade.toString() === value)
        );
        this.setState(
            {
                filteredTheses: filtered,
                searchTerm: value
            }
        );
    }

    renderTable() {
        return (
            <table className="ui celled table">
                <thead>
                    <tr>
                        <th>Author</th>
                        <th>Title</th>
                        <th>Grade</th>
                        {this.props.fields === 4 && //is 4 on supervisor management page
                            <th>Action needed, if any</th>
                        }
                    </tr>
                </thead>
                <tbody>{this.state.filteredTheses.map((thesis) =>
                    <tr key={thesis.thesisId}>
                        <td>{thesis.authorLastname + ", " + thesis.authorFirstname}</td>
                        <td>{thesis.thesisTitle}</td>
                        <td>{thesis.grade}</td>
                        {this.props.fields === 4 &&
                            <td>Process needs approval? Needs grader approval?</td>
                        }
                    </tr>
                )}</tbody>
            </table>
        )
    }

    render() {
        return (
            <div>
                <div className="ui fluid category search">
                    <div className="ui icon input">
                        <input className="prompt" value={this.state.searchTerm} type="text" placeholder="Filter theses" onChange={this.handleFilteringTheses} />
                        <i className="search icon"></i>
                    </div>
                </div>
                {this.renderTable()}
                <div className="ui segment">
                </div>
            </div>
        );
    }
}

export default ThesisList;
