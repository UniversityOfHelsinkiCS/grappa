import React, { Component } from "react";

export default class ThesisInformation extends Component {

    constructor() {
        super();
        this.state = {
            oldGrading: false,
        }
    }

    changeField = (fieldName) => (event) => {
        this.props.sendChange(fieldName, event.target.value);
    }

    renderTextField(label, fieldName, placeholder, disabled) {

        return (
            <div className="field">
                <label>{label}</label>
                <input
                    type="text"
                    disabled={disabled ? "true" : ""}
                    value={this.props.thesis[fieldName]}
                    onChange={this.changeField(fieldName)}
                    placeholder={placeholder}
                />
            </div>
        );
    }

    renderDropdownField(label, fieldArray, fieldName, disabled) {
        return (
            <div className="field">
                <label>{label}</label>
                <select
                    className="ui fluid search dropdown"
                    disabled={disabled ? "true" : ""}
                    value={this.props.thesis[fieldName]}
                    onChange={this.changeField(fieldName)}>
                    <option key="0" value="">Select {label}</option>
                    {fieldArray.map((field, index) =>
                        <option key={index} value={field.id}>
                            {field.name}
                        </option>
                    )}
                </select>
            </div>
        );
    }

    renderThesisAuthor(disabled) {
        return (
            <div className="three fields">
                {this.renderTextField("First name", "authorFirstname", "First Name", disabled)}
                {this.renderTextField("Last name", "authorLastname", "Last Name", disabled)}
                {this.renderTextField("Email", "authorEmail", "Email Address", disabled)}
            </div>
        );
    }

    renderThesisInformation() {
        const oldGradeFields = [
            { id: "Approbatur", name: "Approbatur" },
            { id: "Lubenter Approbatur", name: "Lubenter Approbatur" },
            { id: "Non Sine Laude Approbatur", name: "Non Sine Laude Approbatur" },
            { id: "Cum Laude Approbatur", name: "Cum Laude Approbatur" },
            { id: "Magna Cum Laude Approbatur", name: "Magna Cum Laude Approbatur" },
            { id: "Eximia Cum Laude Approbatur", name: "Eximia Cum Laude Approbatur" },
            { id: "Laudatur", name: "Laudatur" },
        ]
        const gradeFields = [
            { id: "1", name: "1" },
            { id: "2", name: "2" },
            { id: "3", name: "3" },
            { id: "4", name: "4" },
            { id: "5", name: "5" }
        ]
        return (
            <div className="m-bot">
                <div className="three fields">
                    {this.renderDropdownField("Studyfield", this.props.studyfields, "studyfieldId", !this.props.allowEdit)}
                    {this.renderTextField("Title", "title", "Title", !this.props.allowEdit)}
                    {this.renderTextField("Urkund-link", "urkund", "Link to Urkund", !this.props.allowEdit)}

                </div>
                <div className="three fields">
                    {this.state.oldGrading ?
                        this.renderDropdownField("Grade", oldGradeFields, "grade", !this.props.allowEdit) :
                        this.renderDropdownField("Grade", gradeFields, "grade", !this.props.allowEdit)
                    }
                    <div className="field">
                        <label>&nbsp;   </label>
                        <button className="ui button" onClick={() => { this.setState({ oldGrading: !this.state.oldGrading }) }}>
                            {this.state.oldGrading ?
                                "Enable new grading" : "Enable old grading"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <h3 className="ui dividing header">Thesis Author</h3>
                {this.renderThesisAuthor(this.props.thesis.id)}
                <h3 className="ui dividing header">Thesis Information</h3>
                {this.renderThesisInformation()}
            </div>
        );
    }
}