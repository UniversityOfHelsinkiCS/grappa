import React, { Component } from "react";

import Dropzone from "react-dropzone";

export default class AttachmentAdder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attachments: [],
        }
    }

    onDrop = (files) => {
        const droppedFile = files[0];
        this.addAttachment(droppedFile);
        this.props.sendChange(droppedFile);
        console.log("attachment size " + this.state.attachments.length);
    }

    addAttachment = (attachment) => {
        const newAttachmentsList = this.state.attachments;
        newAttachmentsList.push(attachment);
        this.setState({ attachments: newAttachmentsList });
    }

    removeAttachment = (attachment) => {
        const newAttachmentsList = this.state.attachments;
        const index =  newAttachmentsList.indexOf(attachment);
        newAttachmentsList.splice(index, 1);
        this.setState({attachments: newAttachmentsList});
    }

    getFileList = () => {
        return (
            <div className="ui form">
                {this.getFileNumberLabel()}
                {this.state.attachments.map(attachment =>

                    <div>
                        <button 
                            className="negative ui icon button "
                            onClick= { () =>this.removeAttachment(attachment)}>
                            <i className="remove icon"></i>
                        </button>
                        &nbsp;
                        {attachment.name}
                        <hr />
                    </div>
                )}
            </div>
        );

    }

    getHeader = () => {
        if (this.props.attachmentCount === undefined) {
            return <h1>Upload attachments as much as you want</h1>
        }
        return <h1>Upload maximum {this.props.attachmentCount} attachments</h1>
    }



    getFileNumberLabel = () => {
        const attachmentsUploaded = this.state.attachments.length;
        if (attachmentsUploaded === 0) {
            return <h2>No attachments uploaded</h2>;
        }
        else if (attachmentsUploaded === 1) {
            return <h2>One attachment uploaded:</h2>
        }
        return (<h2>
            {attachmentsUploaded + " attachments uploaded:"}
        </h2>);
    }

    render() {
        return (
            <div>
                {this.getHeader()}
                <div className="field" style={{ borderStyle: 'dashed' }}>
                    <label>Add attachments</label>
                    <Dropzone className="field upload-box"
                        onDrop={this.onDrop}
                        multiple={false}>
                        <p className="upload-p">Click to navigate to the file or drop them from your file system.</p>
                    </Dropzone>
                </div>
                {this.getFileList()}
            </div>

        );
    }
}