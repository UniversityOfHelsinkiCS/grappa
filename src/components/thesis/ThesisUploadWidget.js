import React, { Component } from "react";

import Dropzone from "react-dropzone";

export default class ThesisUploadWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attachments: [],
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.currentFile) {
        }
    }

    getLabel = () => {
        switch (this.props.type) {
            case "reviewFile":
                return "Upload Thesis review as PDF (max. 1 MB)";
            case "abstractFile":
                return "Upload Thesis with abstract on 2nd page (max. 40 MB)";
            case "attachment":
                return "Upload attachments"
            default:
                return "Error ThesisUploadWidget getLabel";
        }
    }

    onDrop = (files) => {
        this.state.attachments.push(files[0]);
        this.props.sendChange(this.props.type, files[0]);
    }

    getFileList = () => {
        const attachmentElements = [];
        for (let i = 0; i < this.state.attachments.length; i++) {
            console.log("filu: " + this.state.attachments[i].name);
            const element = <p>{this.state.attachments[i].name}</p>
            attachmentElements.push(element);
        }
        return (
            <div className="fileList">
                {this.getFileNumberLabel()}
                {attachmentElements}
            </div>
        );

    }

    getFileNumberLabel = () => {
        if (this.state.attachments.length === 0) {
            return "No attachments uploaded";
        }
        return this.state.attachments.length + " attachments uploaded:";
    }

    render() {
        return (
            <div>
                <div className="field" style={{ borderStyle: 'dashed' }}>
                    <label>{this.getLabel()}</label>
                    <Dropzone className="field upload-box" onDrop={this.onDrop} multiple={false}>
                        <p className="upload-p">Click to navigate to the file or drop them from your file system.</p>
                    </Dropzone>
                </div>
                {this.getFileList()}
            </div>

        );
    }
}