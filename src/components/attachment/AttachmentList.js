import React, { Component } from 'react';
import { func, arrayOf } from 'prop-types';
import { attachmentType } from '../../util/types';

export default class AttachmentList extends Component {
    download = attachmentId => () => {
        this.props.downloadAttachment(attachmentId);
    };

    delete = attachmentId => () => {
        this.props.deleteAttachment(attachmentId);
    };

    labelToText = (label) => {
        switch (label) {
            case 'otherFile':
                return 'Other';
            case 'reviewFile':
                return 'Review';
            case 'thesisFile':
                return 'Thesis';
            default:
                return 'Label not handled'
        }
    };

    render() {
        return (
            <table className="ui celled table">
                <thead>
                    <tr>
                        <th>Filename</th>
                        <th>Label</th>
                        <th>Download</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.attachments.map(attachment =>
                        (<tr key={attachment.attachmentId}>
                            <td>{attachment.originalname}</td>
                            <td>{this.labelToText(attachment.label)}</td>
                            <td>
                                <button
                                    className="ui primary button"
                                    onClick={this.download(attachment.attachmentId)}
                                >
                                    Download
                                </button>
                            </td>
                            <td>
                                <button
                                    className="ui primary button"
                                    onClick={this.delete(attachment.attachmentId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>)
                    )}
                </tbody>
            </table>
        )
    }
}

AttachmentList.propTypes = {
    downloadAttachment: func.isRequired,
    deleteAttachment: func.isRequired,
    attachments: arrayOf(attachmentType).isRequired
};
