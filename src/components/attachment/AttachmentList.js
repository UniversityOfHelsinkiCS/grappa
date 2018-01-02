import React, { Component } from 'react';

export default class AttachmentList extends Component {

    download = (attachmentId) => () => {
        this.props.downloadAttachment(attachmentId);
    }

    delete = (attachmentId) => () => {
        this.props.deleteAttachment(attachmentId);
    }

    render() {
        return (
            <table className="ui celled table">
                <thead>
                    <tr>
                        <th>Filename</th>
                        <th>Download</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.attachments.map(attachment =>
                        <tr key={attachment.attachmentId}>
                            <td>{attachment.filename}</td>
                            <td><button className="ui primary button" onClick={this.download(attachment.attachmentId)}>Download</button></td>
                            <td><button className="ui primary button" onClick={this.delete(attachment.attachmentId)}>Delete</button></td>
                        </tr>
                    )}
                </tbody>
            </table>
        )
    }
}