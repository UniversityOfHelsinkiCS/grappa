import React, { Component } from 'react';

import { connect } from 'react-redux';
import { updateThesis, getTheses, downloadTheses, moveTheses } from '../thesis/thesisActions';

import ThesisList from '../../components/thesis/ThesisList';

class ThesisListPage extends Component {
    constructor(props) {
        super(props);
        const theses = this.formatTheses(this.props.theses);
        this.state = {
            formattedTheses: theses,
            filteredTheses: theses,
        }
    }

    componentDidMount() {
        document.title = 'Thesis List';
    }

    formatTheses(theses) {
        const persons = this.props.persons;
        if (!theses || !persons) return;
        const formatted = theses.map(thesis => {
            const agreement = this.props.agreements.find(agreement => agreement.thesisId === thesis.thesisId);
            const person = agreement ? persons.find(person => person.personId === agreement.authorId) : {};
            const formattedThesis = Object.assign({}, thesis);

            formattedThesis.email = person.email || 'No user';
            formattedThesis.authorFirstname = person.firstname || 'Keplo';
            formattedThesis.authorLastname = person.lastname || 'Leutokalma';

            return formattedThesis
        })
        return formatted;
    }

    search = (event) => {
        if (!event.target.value) {
            this.setState({ filteredTheses: this.state.formattedTheses })
            return;
        }
        const searchValue = event.target.value.toLowerCase();
        //if searchTerm is empty set filteredTheses = theses, else filter theses based on searchTerm
        const filteredTheses = this.state.formattedTheses.filter(thesis => {
            const values = [
                thesis.authorLastname.toLowerCase(),
                thesis.authorFirstname.toLowerCase(),
                thesis.thesisTitle.toLowerCase(),
                thesis.grade.toString().toLowerCase(),
            ]
            return values.find(value => value.includes(searchValue))
        });
        this.setState({ filteredTheses });
    }

    render() {
        return (
            <div>
                <br />
                <div className="ui fluid category search">
                    <div className="ui icon input">
                        <input className="prompt" type="text" placeholder="Filter theses" onChange={this.search} />
                        <i className="search icon"></i>
                    </div>
                </div>
                <ThesisList
                    theses={this.state.filteredTheses}
                    userRoles={this.props.user.roles}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    persons: state.persons,
    user: state.user,
    theses: state.theses,
    agreements: state.agreements,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ThesisListPage);
