import React, { Component } from 'react';

import { connect } from "react-redux";
import { updateThesis, getTheses, downloadTheses, moveTheses } from "../thesis/thesisActions";

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
        document.title = "Thesis List";
    }

    formatTheses(theses) {
        const persons = this.props.persons;
        if (!theses || !persons) return;
        const formatted = theses.map(thesis => {
            const person = persons.find(person => person.personId === thesis.userId)
            let formattedThesis = thesis
            if (!person) {
                formattedThesis.email = "No user"
                formattedThesis.authorFirstname = "Keplo"
                formattedThesis.authorLastname = "Leutokalma"
            } else {
                formattedThesis.email = person.email
                formattedThesis.authorFirstname = person.firstname
                formattedThesis.authorLastname = person.lastname
            }
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

const mapStateToProps = (state) => {
    return {
        persons: state.persons,
        user: state.user,
        theses: state.theses,
    };
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ThesisListPage);
