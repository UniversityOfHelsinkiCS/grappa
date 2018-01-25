import React, { Component } from 'react';
import moment from 'moment';

export default class ThesisEmails extends Component {
    sendReminder = (reminderType) => () => {
        console.log('Sent Reminder')
        console.log(reminderType);
        //this.props.sendEmail(reminderType);
    }

    setDone = (reminderType) => () => {
        console.log('Set Done')
        console.log(reminderType);
        //this.props.sendDone(reminderType);
    }

    headerText = (displayName, reminderObject, isDone) => {
        return displayName + (reminderObject != null ? ' has been sent' : ' has not been sent') + (reminderObject != null && !isDone ? ' but' : ' and') + (isDone ? ' it is done' : ' it is not done yet');
    }

    renderReminder(displayName, type, reminderObject, isDone) {
        if (!displayName && !type) {
            return undefined;
        }
        return (
            <div className="field">
                <div className="ui right input">
                    <h3 className="ui header">{this.headerText(displayName, reminderObject, isDone)}</h3>
                </div>
                <div className="three fields">
                    <div className="field">
                        <label>Recipient</label>
                        <p>{reminderObject ? reminderObject.to : 'Not sent'}</p>
                    </div>
                    <div className="field">
                        <label>Last sent</label>
                        <p>{reminderObject ? moment(reminderObject.lastSent).format('DD/MM/YYYY HH:mm') : 'Never'}</p>
                    </div>
                    {isDone ?
                        <div className="field">
                            <label>&nbsp;</label>
                            <button className="ui red button" onClick={this.sendReminder(type)}>
                                Send another email
                            </button>
                        </div>
                        :
                        <div className="two fields">
                            <div className="field">
                                <label>&nbsp;</label>
                                <button className="ui blue button" onClick={this.sendReminder(type)}>
                                    Send the email
                                </button>
                            </div>
                            <div className="field">
                                <label>&nbsp;</label>
                                <button className="ui red button" onClick={this.setDone(type)}>
                                    Force done
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }

    render() {
        const thesisEmails = this.props.thesisEmails;
        const eThesisDone = false;
        const graderEvaluationDone = false;
        const thesisPrinted = false;
        const studentReceivedNotification = false;
        const supervisingProfessorReceivedNotification = false;
        return (
            <div className="ui form">
                <h2 className="ui dividing header">Sent reminders</h2>
                {this.renderReminder('Ethesis Reminder', 'EthesisReminder', thesisEmails.ethesisReminder, eThesisDone)}
                {this.renderReminder('Grader Evaluation Reminder', 'GraderEvalReminder', thesisEmails.graderEvalReminder, graderEvaluationDone)}
                {this.renderReminder('Print Thesis Reminder', 'PrintReminder', thesisEmails.printReminder, thesisPrinted)}
                {this.renderReminder('Student Notification', 'StudentRegistrationNotification', thesisEmails.studentRegistrationNotification, studentReceivedNotification)}
                {this.renderReminder('Supervising Professor Notification', 'SupervisingProfessorNotification', thesisEmails.supervisingProfessorNotification, supervisingProfessorReceivedNotification)}
            </div>
        );
    }
}