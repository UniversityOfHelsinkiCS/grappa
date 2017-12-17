import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ThesisList extends Component {

    render() {
        return (
            <table className="ui celled table">
                <thead>
                    <tr>
                        <th>Author</th>
                        <th>Email</th>
                        <th>Title</th>
                        <th>Grade</th>
                        <th>Print Done</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.theses.map(thesis =>
                        <tr key={thesis.thesisId}>
                            <td>{thesis.authorLastname + ", " + thesis.authorFirstname}</td>
                            <td>{thesis.email}</td>
                            <td><Link to={`/thesis/${thesis.thesisId}`}>{thesis.title}</Link></td>
                            <td>{thesis.grade}</td>
                            <td>{thesis.printDone}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        )
    }
}