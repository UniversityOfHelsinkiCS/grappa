import React, { Component } from 'react';
import { arrayOf, func } from 'prop-types'
import { connect } from 'react-redux';

import { agreementType, personType, thesisType, attachmentType } from '../../util/types';
import { downloadAttachments } from '../attachment/attachmentActions'

import ThesisList from '../../components/thesis/ThesisList';
import { formatTheses } from '../../util/theses';

class ThesisListPage extends Component {
    constructor(props) {
        super(props);
        const theses = formatTheses(props.theses, props.agreements, props.persons);
        this.state = {
            theses
        };
    }

    componentDidMount() {
        document.title = 'Thesis List';
    }

    componentWillReceiveProps(newProps) {
        if (newProps.theses.length > 0 && newProps.persons.length > 0 && newProps.agreements.length > 0) {
            const theses = formatTheses(newProps.theses, newProps.agreements, newProps.persons);
            this.setState({ theses })
        }
    }

    handleDownload = (attachmentIds) => {
        this.props.downloadAttachments(attachmentIds);
    };

    render() {
        return (
            <div>
                <br />

                <ThesisList
                    downloadSelected={this.handleDownload}
                    theses={this.state.theses}
                    userRoles={this.props.user.roles}
                    agreements={this.props.agreements}
                    attachments={this.props.attachments}
                    showButtons={false}
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
    attachments: arrayOf(attachmentType).isRequired,
    downloadAttachments: func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ThesisListPage);
