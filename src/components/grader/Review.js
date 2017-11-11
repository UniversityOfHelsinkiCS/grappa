import React, { Component } from 'react';
import { callApi } from "../../util/apiConnection.js";
import { connect } from "react-redux";
import { reviewSupervisor } from "./GraderActions.js";


export class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: props.showModal,
            person: props.person,
            review: null,
            isApproved: null
        }
    }

    componentWillReceiveProps(props) {
        let person = Object.assign({}, props.person);
        this.setState(
            {
                person: person,
                isApproved: person.approved,
                review: person.statement
            }
        );
    }

    handleSave = () => {
        let editedPerson = { ...this.state.person };
        editedPerson.review = this.state.review;
        this.setState(
            {
                isApproved: true,
                person: editedPerson
            }
        )
        this.props.reviewSupervisor(editedPerson);
        this.props.closeModal();
    }

    handleDisapproval = () => {
        this.setState(
            {
                isApproved: false
            }
        )
        this.props.closeModal();
    }

    handleReviewChange = (event) => {
        const old = this.state.review;
        let newReview = old;
        newReview = event.target.value;
        this.setState({ review: newReview });
    }

    renderTexts() {
        return (
            <div className="scrolling content">
                <div className="description">
                    <p><b>{this.state.person.title} {this.state.person.firstname} {this.state.person.lastname}</b>,&nbsp;
                        grader for thesis: THESISNAMEWILLBEHERE</p>
                    <p>Write a review, if this grader needs it. Other info to be shown here?</p>
                </div>
                <div>
                    <div className="field ui">
                        <label>Write your review here</label><br />
                        <textarea rows="5" type="text" value={this.state.review} onChange={this.handleReviewChange} />
                    </div>

                </div>
            </div>
        )
    }

    render() {
        //console.log(this.props, this.state);
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
                    <div className="two fields">
                        <button className="ui positive button" onClick={this.handleSave}>
                            Accept grader
                        </button>
                        <button className="ui negative button" onClick={this.handleDisapproval}>
                            Do not accept
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    reviewSupervisor(data) {
        dispatch(reviewSupervisor(data));
    }
});

const mapStateToProps = (state) => {
    return {
        personToBeReviewed: state.person
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Review);