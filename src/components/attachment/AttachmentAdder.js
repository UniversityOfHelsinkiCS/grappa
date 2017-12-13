import React, { Component } from "react";

import Dropzone from "react-dropzone";

export default class AttachmentAdder extends Component {

    onDrop = (files) => {
        const droppedFile = files[0];
        this.props.addAttachment(droppedFile);
    }

    removeAttachment = (attachment) => () => {
        this.props.removeAttachment(attachment);
    }

    getFileList = () => { 
        return (
            <div className="ui form">
                {this.getFileNumberLabel()}
                {this.props.attachments ? this.props.attachments.map((attachment, index) =>
                    <div key={index}>
                        <button
                            className="negative ui icon button "
                            onClick={this.removeAttachment(attachment)}>
                            <i className="remove icon"></i>
                        </button>
                        &nbsp;
                        {attachment.name}
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
                {!this.props.attachments ? "No attachments uploaded" :
                    (this.props.attachments.length === 1) ? "One attachment uploaded:" :
                        this.props.attachments.length + " attachments uploaded:"}
            </h3>
        )

    }

    renderDropzone = () => {
        if (this.canAttachmentBeUploaded()) {
            return (
                <div className="field" style={{ borderStyle: 'dashed' }}>
                    <Dropzone className="field upload-box" onDrop={this.onDrop} multiple={false}>
                        <p className="upload-p">
                            Click to navigate to the file or drop them from your file system.
                        </p>
                    </Dropzone>
                </div>
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
                {this.getFileList()}
            </div>

        );
    }
}