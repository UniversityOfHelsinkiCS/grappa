import React, { Component } from 'react';

export default class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: props.showModal,
            person: props.person,
            statement: null,
            isApproved: null
        }
    }

    componentWillReceiveProps(props) {
        let person = Object.assign({}, props.person);
        this.setState(
            {
                person,
                isApproved: person.approved,
                statement: person.statement
            }
        );
    }

    handleSave = () => {
        let editedPerson = { ...this.state.person };
        editedPerson.statement = this.state.statement;
        editedPerson.approved = true;
        this.props.reviewSupervisor(editedPerson);
        this.props.closeModal();
    }

    handleDisapproval = () => {
        let editedPerson = { ...this.state.person };
        editedPerson.statement = this.state.statement;
        editedPerson.approved = false;
        this.props.reviewSupervisor(editedPerson);
        this.props.closeModal();
    }

    handleReviewChange = (event) => {
        const old = this.state.statement;
        let newReview = old;
        newReview = event.target.value;
        this.setState({ statement: newReview });
    }

    renderIfApproved() {
        if (this.state.person.approved === 1) {
            return 'yes';
        }
        return 'no'
    }

    //TODO person title not showing because thesis title has the same name atm
    renderTexts() {
        return (
            <div className="scrolling content">
                <div className="description">
                    <div><b>{this.state.person.firstname} {this.state.person.lastname}</b>,&nbsp;
                        supervisor for thesis {this.state.person.title}</div>
                    <div>The supervisor is approved to supervise this thesis: <b>{this.renderIfApproved()}</b></div>
                    <div>Write a review, if this supervisor needs it. Other info to be shown here?</div>
                </div>
                <div>
                    <div className="field ui">
                        <label>Write your review here</label><br />
                        <textarea rows="5" type="text" value={this.state.statement} onChange={this.handleReviewChange} />
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
                    <div className="header">Review supervisor</div>
                    {this.renderTexts()}
                    <br />
                    <div className="two fields">
                        <button className="ui positive button" onClick={this.handleSave}>
                            Accept supervisor
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
