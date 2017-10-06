import React, { Component } from "react";

export default class StudyfieldEdit extends Component {

    constructor() {
        super();
        this.state = {
            deleteConfirmation: false,
        }
    }

    update = () => {
        this.props.sendUpdate();
    }

    delete = () => {
        this.state.deleteConfirmation ? this.props.sendDelete() : "";
        this.setState({ deleteConfirmation: !this.state.deleteConfirmation });
    }

    toggleActive = () => {
        this.props.toggleActive();
    }

    handleChange = (event) => {
        this.props.sendChange(event.target.value);
    }

    render() {
        return (
            <div>
                <div className="field">
                    <h2 className="ui dividing header">Update studyfield {this.props.studyfield.name}</h2>
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            value={this.props.studyfield.name}
                            onChange={this.handleChange}
                        />
                    </div>
                    &nbsp;
                    <div className="three fields">
                        <div className="field">
                            <div className="ui toggle checkbox">
                                <input
                                    type="checkbox"
                                    checked={this.props.studyfield.isActive ? "true" : ""}
                                    onChange={this.toggleActive}
                                />
                                <label>{this.props.studyfield.isActive ? "Active" : "Not active"}</label>
                            </div>
                        </div>
                        <div className="field">
                            <button className="ui fluid green button" onClick={this.update}>Update</button>
                        </div>
                        <div className="field">
                            <button className="ui right floated inverted red button" onClick={this.delete}>
                                {this.state.deleteConfirmation ? "Click again to confirm" : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}