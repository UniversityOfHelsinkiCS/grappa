import React, { Component } from 'react';
import { arrayOf } from 'prop-types'
import { connect } from 'react-redux';

import { agreementType, personType, thesisType } from '../../util/types';
import { downloadAttachments } from '../attachment/attachmentActions'

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
        return theses.map(thesis => {
            const agreement = this.props.agreements.find(agreement => agreement.thesisId === thesis.thesisId);
            const person = agreement ? persons.find(person => person.personId === agreement.authorId) : {};
            const formattedThesis = Object.assign({}, thesis);

            formattedThesis.email = person.email || 'No user';
            formattedThesis.authorFirstname = person.firstname || 'Keplo';
            formattedThesis.authorLastname = person.lastname || 'Leutokalma';

            return formattedThesis
        });
    }

    search = (event) => {
        if (!event.target.value) {
            this.setState({ filteredTheses: this.state.formattedTheses })
            return;
        }
        const searchValue = event.target.value.toLowerCase();
        //if searchTerm is empty set filteredTheses = theses, else filter theses based on searchTerm
        const filteredTheses = this.state.formattedTheses.filter(thesis => {
            return Object.keys(thesis).find(key => {
                return typeof thesis[key] === 'string' && thesis[key].toLowerCase().includes(searchValue)
            })
        });
        this.setState({ filteredTheses });
    }

    downloadTheses = (thesisIds, cover) => {
        //TODO: Move to backend
        const attachmentIds = this.props.agreements.map(agreement => {
            if (thesisIds.find(id => id === agreement.thesisId)) {
                return this.props.attachments.filter(attachment => {
                    if (attachment.agreementId === agreement.agreementId) {
                        //Pick correct files;
                        if (attachment.label === 'thesisFile' || attachment.label === 'reviewFile') {
                            return true;
                        }
                    }
                    return false;
                })
                    .sort((a, b) => {
                        if (a.label === 'thesisFile') { // Thesis comes before review.
                            return -1
                        }
                        return 1
                    })

            }
        }).reduce((acc, cur) => { // Flatten thesis, review pairs.
            return acc.concat(cur.map(attachment => attachment.attachmentId)); //Take only ids
        },
            cover ? ['cover'] : [] // Add cover if it's chosen.
            );
        this.props.downloadAttachments(attachmentIds);
    }

    render() {
        return (
            <div>
                <br />
                <div className="ui fluid category search">
                    <div className="ui icon input">
                        <input className="prompt" type="text" placeholder="Filter theses" onChange={this.search} />
                        <i className="search icon" />
                    </div>
                </div>
                <br />
                <ThesisList
                    downloadSelected={this.downloadTheses}
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
    attachments: state.attachments,
});

const mapDispatchToProps = (dispatch) => ({
    downloadAttachments(attachmentIds) {
        dispatch(downloadAttachments(attachmentIds));
    }
});

ThesisListPage.propTypes = {
    persons: arrayOf(personType).isRequired,
    user: personType.isRequired,
    theses: arrayOf(thesisType).isRequired,
    agreements: arrayOf(agreementType).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ThesisListPage);
