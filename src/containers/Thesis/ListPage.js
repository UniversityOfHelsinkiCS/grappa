import React, { Component } from 'react'
import { func } from 'prop-types'
import { connect } from 'react-redux'

import { downloadAttachments } from '../Attachment/services/attachmentActions'

import ThesisList from './ThesisList'

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
                    theses={this.props.theses}
                    downloadSelected={this.handleDownload}
                    showButtons={false}
                    markPrinted={() => ({})}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    theses: state.theses
})

const mapDispatchToProps = dispatch => ({
    downloadAttachments(attachmentIds) {
        dispatch(downloadAttachments(attachmentIds))
    }
})

ThesisListPage.propTypes = {
    downloadAttachments: func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ThesisListPage)
