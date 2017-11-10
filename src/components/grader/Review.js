import React, { Component } from 'react';
import { callApi } from "../../util/apiConnection.js";

export default class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: props.showModal,
            person: props.person
        }
    }

    componentWillReceiveProps(props) {
        let person = Object.assign({}, props.person);
        this.setState(
            {
                person: person
            }
        );
    }

    handleSave = () => {
        this.props.closeModal();
    }

    handleDisapproval = () => {
        this.props.closeModal();
    }

    renderTexts() {
        return (
            <div className="scrolling content">
                <div className="description">
                    <p><b>{this.state.person.title} {this.state.person.firstname} {this.state.person.lastname}</b>,&nbsp;
                        grader for thesis: THESISNAMEHERE</p>
                    <p>Write a review, if this grader needs it. Other info to be shown here?</p>
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
        console.log(this.props, this.state);
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
                        Do not accept
                    </button>
                </div>
            </div>
        );
    }
}