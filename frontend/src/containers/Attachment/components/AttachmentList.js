import React, { Component } from 'react'
import { func, arrayOf } from 'prop-types'
import { attachmentType } from '../../../util/types'
import { labelToText } from '../../../util/theses'

export default class AttachmentList extends Component {
    state = {
        confirmId: undefined
    }

    download = attachmentId => () => {
        this.props.downloadAttachment(attachmentId)
    };

    delete = attachmentId => () => {
        if (this.state.confirmId === attachmentId) {
            this.props.deleteAttachment(attachmentId)
        } else {
            this.setState({ confirmId: attachmentId })
        }
    };

    renderDeleteButton = (attachmentId) => {
        const primed = this.state.confirmId === attachmentId
        const buttonColor = primed ? 'red' : 'blue'
        return (
            <td>
                <button
                    className={`ui ${buttonColor} button`}
                    onClick={this.delete(attachmentId)}
                >
                    {primed ? 'Confirm delete' : 'Delete'}
                </button>
            </td>
        )
    }

    render() {
        return (
            <table className="ui celled table">
                <thead>
                    <tr>
                        <th>Filename</th>
                        <th>Label</th>
                        <th>Download</th>
                        {this.props.deleteAttachment ? <th>Delete</th> : null}
                    </tr>
                </thead>
                <tbody>
                    {this.props.attachments.map(attachment => (
                        <tr key={attachment.attachmentId}>
                            <td>{attachment.originalname}</td>
                            <td>{labelToText(attachment.label)}</td>
                            <td>
                                <button
                                    className="ui primary button"
                                    onClick={this.download(attachment.attachmentId)}
                                >
                                    Download
                                </button>
                            </td>
                            {this.props.deleteAttachment ?
                                this.renderDeleteButton(attachment.attachmentId) : null}
                        </tr>)
                    )}
                </tbody>
            </table>
        )
    }
}

AttachmentList.propTypes = {
    downloadAttachment: func.isRequired,
    deleteAttachment: func,
    attachments: arrayOf(attachmentType).isRequired
}

AttachmentList.defaultProps = {
    deleteAttachment: undefined
}
