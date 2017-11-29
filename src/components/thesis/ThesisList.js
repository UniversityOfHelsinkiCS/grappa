import React, { Component } from 'react';

export default class ThesisList extends Component {

    render() {
        return (
            <table className="ui celled table">
                <thead>
                    <tr>
                        <th>Author</th>
                        <th>Title</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                {this.props.theses.map(thesis =>
                    <tr key={thesis.thesisId}>
                        <td>{thesis.authorLastname + ", " + thesis.authorFirstname}</td>
                        <td>{thesis.thesisTitle}</td>
                        <td>{thesis.grade}</td>
                    </tr>
                )}
                </tbody>
            </table>
        )
    }
}