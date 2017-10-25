import React, { Component } from "react";

import Dropzone from "react-dropzone";

export default class AttachmentAdder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attachments: [{ name: "asd" }],
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.currentFile) {
        }
    }

    onDrop = (files) => {
        const droppedFile = files[0];
        this.addAttachment(droppedFile);
        this.props.sendChange(droppedFile);
        console.log("attachment size " + this.state.attachments.length);
    }

    addAttachment = (file) => {
        const newList = this.state.attachments;
        newList.push(file);
        this.setState({ attachments: newList });
    }

    getFileList = () => {
        return (
            <div className="ui form">
                {this.getFileNumberLabel()}
                {this.state.attachments.map(attachment =>

                    <div>
                        <button className="negative ui icon button ">
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

    getFileNumberLabel = () => {
        if (this.state.attachments.length === 0) {
            return <h2>No attachments uploaded</h2>;
        }
        return (<h2>
            {this.state.attachments.length + " attachments uploaded:"}
        </h2>);
    }

    render() {
        return (
            <div>
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