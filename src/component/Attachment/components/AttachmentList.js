import React, { Component } from 'react';
import { func, arrayOf } from 'prop-types';
import { attachmentType } from '../../../util/types';
import { labelToText } from '../../../util/theses';

export default class AttachmentList extends Component {
    download = attachmentId => () => {
        this.props.downloadAttachment(attachmentId);
    };

    delete = attachmentId => () => {
        this.props.deleteAttachment(attachmentId);
    };

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
                            {this.props.deleteAttachment ? (
                                <td>
                                    <button
                                        className="ui primary button"
                                        onClick={this.delete(attachment.attachmentId)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            ) : null}
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
};

AttachmentList.defaultProps = {
    deleteAttachment: undefined
};
