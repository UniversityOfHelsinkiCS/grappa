import React, { Component } from 'react'
import { arrayOf, func } from 'prop-types'
import { connect } from 'react-redux'

import { agreementType, personType, thesisType, attachmentType } from '../../util/types'
import { downloadAttachments } from '../Attachment/services/attachmentActions'
import { makeGetFormatTheses } from '../../selectors/thesisList'

import ThesisList from './components/ThesisList'

class ThesisListPage extends Component {
    componentDidMount() {
        document.title = 'Thesis List'
    }

    handleDownload = (attachmentIds) => {
        this.props.downloadAttachments(attachmentIds)
    };

    render() {
        return (
            <div>
                <br />

                <ThesisList
                    downloadSelected={this.handleDownload}
                    theses={this.props.theses}
                    userRoles={this.props.user.roles}
                    agreements={this.props.agreements}
                    attachments={this.props.attachments}
                    showButtons={false}
                    markPrinted={() => ({})}
                />
            </div>
        )
    }
}

const getFormatTheses = makeGetFormatTheses()

const mapStateToProps = state => ({
    user: state.user,
    theses: getFormatTheses(state),
    agreements: state.agreements,
    attachments: state.attachments
})

const mapDispatchToProps = dispatch => ({
    downloadAttachments(attachmentIds) {
        dispatch(downloadAttachments(attachmentIds))
    }
})

ThesisListPage.propTypes = {
    user: personType.isRequired,
    theses: arrayOf(thesisType).isRequired,
    agreements: arrayOf(agreementType).isRequired,
    attachments: arrayOf(attachmentType).isRequired,
    downloadAttachments: func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ThesisListPage)
