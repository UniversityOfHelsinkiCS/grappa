import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { arrayOf, func, number } from 'prop-types';
import { attachmentType } from '../../../util/types';


export default class AttachmentAdder extends Component {
    onDrop = (files) => {
        const droppedFile = files[0];
        if (!this.props.attachments.find(a => a.name === droppedFile.name)) {
            const selected = [...this.props.attachments, droppedFile];
            this.props.changeList(selected);
        }
    }

    // TODO: Add/change labels in a better way
    setLabel = attachment => (event) => {
        attachment.label = event.target.value;
    }

    getFileList = () => (
        <div className="ui form">
            {this.getFileNumberLabel()}
            {this.props.attachments ? this.props.attachments.map(attachment => (
                <div className="ui two fields" key={attachment.name}>
                    <select
                        className="ui field dropdown"
                        onChange={this.setLabel(attachment)}
                    >
                        <option value="">Choose file label</option>
                        <option value="thesisFile">Thesis</option>
                        <option value="reviewFile">Review</option>
                        <option value="otherFile">Other</option>
                    </select>
                    <div className="field">
                        <button
                            className="negative ui icon button"
                            onClick={this.removeAttachment(attachment)}
                        >
                            <i className="remove icon" />
                        </button>
                        &nbsp;
                        {attachment.name}
                    </div>
                    <hr />
                </div>)
            ) : undefined}
        </div>
    )

    getFileNumberLabel = () => {
        if (!this.props.attachments || this.props.attachments.length < 1) {
            return <h3>No attachments to be uploaded</h3>
        }
        return (
            <h3>
                {(this.props.attachments.length === 1) ? 'One attachment to be uploaded:' :
                    `${this.props.attachments.length} attachments to be uploaded:`}
            </h3>
        )
    }

    removeAttachment = attachment => () => {
        const removed = this.props.attachments.filter(att => att !== attachment);
        this.props.changeList(removed);
    }

    thereIsNoLimit = () => !this.props.limit

    thereIsRoomForAttachment = () => this.props.attachments.length < this.props.limit

    canAttachmentBeUploaded = () => this.thereIsNoLimit() || this.thereIsRoomForAttachment()

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

    render() {
        return (
            <div>
                <h3>Upload attachments</h3>
                {this.renderDropzone()}
                {this.props.attachments ? this.getFileList() : undefined}
                {this.props.uploadAttachments && this.props.attachments.length > 0 ?
                    <button
                        className="ui green button"
                        onClick={this.props.uploadAttachments}
                    >
                        Upload attachments
                    </button>
                    : undefined}
            </div>
        );
    }
}

AttachmentAdder.propTypes = {
    attachments: arrayOf(attachmentType).isRequired,
    changeList: func.isRequired,
    uploadAttachments: func,
    limit: number
};

AttachmentAdder.defaultProps = {
    uploadAttachments: undefined,
    limit: undefined
}
