import React, { Component } from 'react';
import { callApi } from "../../util/apiConnection.js";

export default class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: props.showModal
        }
    }

    componentWillReceiveProps(props) {
        var original = Object.assign({}, props.formData); //can't use pointer here
        this.setState(
            {
                editedFormData: original
            }
        );
    }

    handleSave = () => {
        this.props.closeModal();
    }

    handleDisapproval() {
        this.props.closeModal();
    }

    renderTexts() {
        return (
            <div className="scrolling content">
                <div className="description">
                    Write a review, if this grader needs it. Other info to be shown here?
                </div>
                <div>
                    <div className="field ui">
                        <label>Write your review here</label><br/>
                        <textarea rows="5" type="text" />
                    </div>
                    
                </div>
            </div>
        )
    }

    render() {
        if (!this.props.showModal) {
            return (<div />);
        }
        return (
            <div>
                <div className="ui dimmer modals page transition visible active" onClick={this.props.closeModal} />
                <div className="ui active modal" style={{ top: 45, border: '2px solid black', borderRadius: '7px' }}>
                    <i className="close icon" onClick={this.props.closeModal}></i>
                    <div className="header">Review grader</div>
                    
                    {this.renderTexts()}

                    <br />
                    <button className="ui positive button" onClick={ this.handleSave }>
                        Accept grader
                    </button>
                    <button className="ui negative button" onClick={ this.handleDisapproval }>
                        Say no
                    </button>
                </div>
            </div>
        );
    }
}