import React, { Component } from 'react';

import Dropzone from 'react-dropzone';

export default class AttachmentAdder extends Component {

    onDrop = (files) => {
        const droppedFile = files[0];
        const selected = [...this.props.attachments, droppedFile];
        this.props.changeList(selected);
    }

    removeAttachment = (attachment) => () => {
        const removed = this.props.attachments.filter(att => att !== attachment);
        this.props.changeList(removed);
    }

    //TODO: Add/change labels in a better way
    setLabel = (attachment) => (event) => {
        attachment.label = event.target.value;
    }

    getFileList = () => {
        return (
            <div className="ui form">
                {this.getFileNumberLabel()}
                {this.props.attachments ? this.props.attachments.map((attachment, index) =>
                    <div className="ui two fields" key={index}>
                        <select
                            className="ui field dropdown"
                            onChange={this.setLabel(attachment)}>
                            <option value="">Choose file label</option>
                            <option value="thesisFile">Thesis</option>
                            <option value="reviewFile">Review</option>
                            <option value="otherFile">Other</option>
                        </select>
                        <div className="field">
                            <button
                                className="negative ui icon button"
                                onClick={this.removeAttachment(attachment)}>
                                <i className="remove icon" />
                            </button>
                            &nbsp;
                        {attachment.name}
                        </div>
                        <hr />
                    </div>
                ) : undefined}
            </div>
        );

    }

    getHeader = () => {
        if (!this.props.limit) {
            return <h2>Upload attachments as much as you want</h2>
        }
        return <h2>Upload maximum {this.props.limit} attachments</h2>
    }



    getFileNumberLabel = () => {
        return (
            <h3>
                {!this.props.attachments ? 'No attachments to be uploaded' :
                    (this.props.attachments.length === 1) ? 'One attachment to be uploaded:' :
                        this.props.attachments.length + ' attachments to be uploaded:'}
            </h3>
        )

    }

    renderDropzone = () => {
        if (this.canAttachmentBeUploaded()) {
            return (
                <Dropzone className="field upload-box" onDrop={this.onDrop} multiple={false}>
                    <div className="field" style={{ borderStyle: 'dashed' }}>
                        <p className="upload-p">
                            Click to navigate to the file or drop them from your file system.
                        </p>
                        <br />
                    </div>
                </Dropzone>
            );
        }
        return <br />;

    }

    thereIsNoLimit = () => {
        return !this.props.limit;
    }

    thereIsRoomForAttachment = () => {
        return this.props.attachments.length < this.props.limit;
    }

    canAttachmentBeUploaded = () => {
        return this.thereIsNoLimit() || this.thereIsRoomForAttachment();
    }

    render() {
        return (
            <div>
                {this.getHeader()}
                {this.renderDropzone()}
                {this.props.attachments ? this.getFileList() : undefined}
                {this.props.uploadAttachments && this.props.attachments.length > 0 ?
                    <button className='ui green button' onClick={this.props.uploadAttachments}>Upload attachments</button>
                    : undefined}
            </div>
        );
    }
}