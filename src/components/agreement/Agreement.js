import React, { Component } from 'react';

import EventMessage from '../EventMessage';
import FormCreator from '../form/FormCreator';

import StudentInfoForm from './form/StudentInfoForm';
import ThesisInfoForm from './form/ThesisInfoForm';
import SupervisingInfoForm from './form/SupervisingInfoForm';
import GoalInfoForm from './form/GoalInfoForm';
import AttachmentAdder from '../attachment/AttachmentAdder';

export default class Agreement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                thesisTitle: "",
                thesisStartDate: "",
                thesisCompletionEta: "",
                thesisPerformancePlace: "",

                thesisSupervisorMain: "",
                thesisSupervisorSecond: "",
                thesisSupervisorOther: "",

                thesisWorkStudentTime: "",
                thesisWorkSupervisorTime: "",
                thesisWorkIntermediateGoal: "",
                thesisWorkMeetingAgreement: "",
                thesisWorkOther: "",

                studentGradeGoal: "",
            },
            attachments: []
        }
    }

    handleFormChange = (event) => {
        const oldForm = this.state.form;
        let newForm = oldForm;
        if (event.target) {  //input field
            newForm[event.target.name] = event.target.value;
        } //else { //a file
            //newForm.attachments.push(event);
        //}
        this.setState({ form: newForm });
    }

    resetSupervisors = () => {
        const oldForm = this.state.form;
        let newForm = oldForm;
        newForm['thesisSupervisorMain'] = '';
        newForm['thesisSupervisorSecond'] = '';
        this.setState({ form: newForm });
    }

    addAttachment = (file) => {
        const newAttachments = this.state.attachments;
        newAttachments.push(file);
        this.setState({ attachments: newAttachments });
    }

    removeAttachment = (file) => {
        const newAttachments = this.state.attachments;
        const index = newAttachments.indexOf(file);
        newAttachments.splice(index, 1);
        this.setState({ attachments: newAttachments });
    }

    sendForm = (event) => {
        event.preventDefault();
        this.props.saveAgreement(this.state.form);
        console.log("this.state.form", this.state.form);
        this.props.saveAttachment(this.state.attachments, this.state.form);
    }

    render() {
        if (!this.props.user.firstname) {
            return <div>Login to add agreement</div>
        }
        return (
            <div>
                <h2>Gradusopimus tehdään gradunohjauksen alkaessa</h2>
                <p>Sopimusta voidaan muuttaa osapuolten yhteisestä päätöksestä.</p>
                <StudentInfoForm user={this.props.user} />
                <br />
                <ThesisInfoForm handleChange={this.handleFormChange} />
                <br />
                <SupervisingInfoForm handleChange={this.handleFormChange} resetSupervisors={this.resetSupervisors} supervisors={this.props.supervisors} studyfields={this.props.studyfields}/>
                <br />
                <GoalInfoForm handleChange={this.handleFormChange} />
                <br />
                <AttachmentAdder
                    attachments={this.state.attachments}
                    addAttachment={this.addAttachment}
                    removeAttachment={this.removeAttachment}
                />
                <br />
                <button className="massive green fluid ui button" onClick={this.sendForm}>
                    Save agreement
                </button>
                <br />
            </div>

        );
    }

    /* SAVE FROM OLD BRANCH - AGREEMENT WIZARD BAR
    getWizardLine() {
        return (<div className="ui mini steps">
            <a className={"step " + (this.state.formSteps == 0 ? 'active' : (this.state.formSteps > 0 ? 'completed' : ''))} onClick={() => this.wizardOnClick(0)}>
                <i className="small address card outline icon"></i>
                <div className="content">
                    <div className="title">Personal Info</div>
                </div>
            </a>
            <a className={"step " + (this.state.formSteps == 1 ? 'active' : (this.state.formSteps > 1 ? 'completed' : ''))} onClick={() => this.wizardOnClick(1)}>
                <i className="small file text outline icon"></i>
                <div className="content">
                    <div className="title">Thesis</div>
                </div>
            </a>
            <a className={"step " + (this.state.formSteps == 2 ? 'active' : (this.state.formSteps > 2 ? 'completed' : ''))} onClick={() => this.wizardOnClick(2)}>
                <i className="small user icon"></i>
                <div className="content">
                    <div className="title">Supervisor</div>
                </div>
            </a>
            <a className={"step " + (this.state.formSteps == 3 ? 'active' : (this.state.formSteps > 3 ? 'completed' : ''))} onClick={() => this.wizardOnClick(3)}>
                <i className="small edit outline icon"></i>
                <div className="content">
                    <div className="title">Agreement</div>
                </div>
            </a>
            <a className={"step " + (this.state.formSteps == 4 ? 'active' : (this.state.formSteps > 4 ? 'completed' : ''))} onClick={() => this.wizardOnClick(4)}>
                <i className="small comments outline icon"></i>
                <div className="content">
                    <div className="title">Other</div>
                </div>
            </a>
            <a className={"step " + (this.state.formSteps == 5 ? 'active' : (this.state.formSteps > 5 ? 'completed' : ''))} onClick={() => this.wizardOnClick(5)}>
                <i className="small info icon"></i>
                <div className="content">
                    <div className="title">Confirm</div>

                </div>
            </a>
        </div>);
    }
    */
}
