import React, { Component } from "react";

export default class ThesisConfirmModal extends Component {
    render() {
        if (!this.props.showModal) {
            return (<div />);
        }
        return (
            <div>
                <div className="ui dimmer modals page transition visible active" onClick={this.props.closeModal}/>
                <div className="ui active modal" style={{ border: '2px solid black', borderRadius: '7px' }}>
                    <i className="close icon" onClick={this.props.closeModal}></i>
                    <div className="header">
                        Reminder
                    </div>
                    <div style={{ margin: '1%' }}>
                        <div className="description">
                            <p>Have you remembered to add the thesis into the thesis-management system? If not please do so right away.</p>
                            <a target="_blank" rel="noopener noreferrer" href="https://ilmo.cs.helsinki.fi/gradu/servlet/hae">Ilmo (opens in a new window)</a>
                        </div>
                        <br />
                        <div className="ui fluid positive button" onClick={this.props.sendSaveThesis}>
                            Confirm
                    </div>
                    </div>
                </div>
            </div>
        )
    }
};