import React, { Component } from 'react';
import { arrayOf, func } from 'prop-types'
import { connect } from 'react-redux';

import { agreementType, personType, thesisType } from '../../util/types';
import { downloadAttachments } from '../attachment/attachmentActions'

import ThesisList from '../../components/thesis/ThesisList';
import { formatTheses } from '../../util/theses';

class ThesisListPage extends Component {
    constructor(props) {
        super(props);
        const theses = formatTheses(props.theses, props.agreements, props.persons);
        this.state = {
            formattedTheses: theses,
            filteredTheses: theses
        };
    }

    componentDidMount() {
        document.title = 'Thesis List';
    }

    componentWillReceiveProps(newProps) {
        if (newProps.theses.length > 0 && newProps.persons.length > 0 && newProps.agreements.length > 0) {
            const theses = formatTheses(newProps.theses, newProps.agreements, newProps.persons);
            this.setState({ formattedTheses: theses, filteredTheses: theses })
        }
    }

    search = (event) => {
        if (!event.target.value) {
            this.setState({ filteredTheses: this.state.formattedTheses });
            return;
        }
        const searchValue = event.target.value.toLowerCase();
        // if searchTerm is empty set filteredTheses = theses, else filter theses based on searchTerm
        const filteredTheses = this.state.formattedTheses.filter(thesis => Object.keys(thesis).find(key => typeof thesis[key] === 'string' && thesis[key].toLowerCase().includes(searchValue)));
        this.setState({ filteredTheses });
    };

    downloadTheses = (thesisIds, cover) => {
        // TODO: Move to backend
        const attachmentIds = this.props.agreements.map((agreement) => {
            if (thesisIds.find(id => id === agreement.thesisId)) {
                return this.props.attachments.filter((attachment) => {
                    if (attachment.agreementId === agreement.agreementId) {
                        // Pick correct files;
                        if (attachment.label === 'thesisFile' || attachment.label === 'reviewFile') {
                            return true;
                        }
                    }
                    return false;
                })
                    .sort((a) => {
                        if (a.label === 'thesisFile') { // Thesis comes before review.
                            return -1;
                        }
                        return 1;
                    });
            }
        }).reduce((acc, cur) => // Flatten thesis, review pairs.
            acc.concat(cur.map(attachment => attachment.attachmentId)) // Take only ids
            ,
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
    attachments: state.attachments
});

const mapDispatchToProps = dispatch => ({
    downloadAttachments(attachmentIds) {
        dispatch(downloadAttachments(attachmentIds));
    }
});

ThesisListPage.propTypes = {
    persons: arrayOf(personType).isRequired,
    user: personType.isRequired,
    theses: arrayOf(thesisType).isRequired,
    agreements: arrayOf(agreementType).isRequired,
    downloadAttachments: func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ThesisListPage);
