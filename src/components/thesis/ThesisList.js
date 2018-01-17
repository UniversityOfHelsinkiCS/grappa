import React, { Component } from 'react';
import { arrayOf, func } from 'prop-types';
import { Link } from 'react-router-dom';
import { thesisType } from '../../util/types';

export default class ThesisList extends Component {

    constructor() {
        super();
        this.state = {
            selectedThesesIds: [],
            cover: true
        }
    }

    toggleThesis = thesis => () => {
        const selectedThesesIds = this.state.selectedThesesIds.includes(thesis.thesisId) ?
            this.state.selectedThesesIds.filter(id => id !== thesis.thesisId) :
            [...this.state.selectedThesesIds, thesis.thesisId];

        this.setState({ selectedThesesIds });
    }

    sendDownloadSelected = () => {
        if (this.state.selectedThesesIds.length > 0) {
            this.props.downloadSelected(this.state.selectedThesesIds, this.state.cover);
        }
    }

    toggleAll = () => {
        if (this.state.selectedThesesIds.length > 0) {
            this.setState({ selectedThesesIds: [] });
        } else {
            this.setState({ selectedThesesIds: this.props.theses.map(thesis => thesis.thesisId) });
        }
    }

    toggleCover = () => {
        this.setState({ cover: !this.state.cover });
    }

    renderButtons() {
        return (
            <div className="ui form">
                <div className="three fields" >
                    <div className="field">
                        <button className="ui orange button" onClick={this.sendDownloadSelected}>Download</button>
                        &nbsp;
                        <div className="ui toggle checkbox">
                            <input
                                type="checkbox"
                                checked={this.state.cover ? 'true' : ''}
                                onChange={this.toggleCover}
                            />
                            <label>Include cover</label>
                        </div>
                    </div>
                    <button className="ui purple button" onClick={this.toggleAll}>Select all</button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderButtons()}
                <table className="ui celled table">
                    <thead>
                        <tr>
                            <th>Select</th>
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
                                <td>
                                    <div className="ui fitted checkbox">
                                        <input
                                            type="checkbox"
                                            checked={this.state.selectedThesesIds.includes(thesis.thesisId) ? 'true' : ''}
                                            onChange={this.toggleThesis(thesis)}
                                        />
                                        <label />
                                    </div>
                                </td>
                                <td>{thesis.authorLastname ? `${thesis.authorLastname}, ${thesis.authorFirstname}` : ''}</td>
                                <td>{thesis.authorEmail}</td>
                                <td><Link to={`/thesis/${thesis.thesisId}`}>{thesis.title}</Link></td>
                                <td>{thesis.grade}</td>
                                <td>{thesis.printDone}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}

ThesisList.propTypes = {
    theses: arrayOf(thesisType).isRequired,
    downloadSelected: func.isRequired
};
