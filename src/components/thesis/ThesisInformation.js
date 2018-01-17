import React, { Component } from 'react';
import { arrayOf, bool, func, object } from 'prop-types';

import { oldGradeFields, gradeFields } from '../../util/theses';
import { thesisType, programmeType } from '../../util/types';

export default class ThesisInformation extends Component {

    constructor() {
        super();
        this.state = {
            oldGrading: false
        }
    }

    changeField = (fieldName) => (event) => {
        this.props.sendChange(fieldName, event.target.value);
    };

    renderTextField(label, fieldName, placeholder, disabled, type = 'text') {
        const className = this.props.validationErrors[fieldName] ? 'field error' : 'field';

        return (
            <div className={className}>
                <label>{label}</label>
                <input
                    type={type}
                    name={fieldName}
                    disabled={disabled ? 'true' : ''}
                    value={this.props.thesis[fieldName]}
                    onChange={this.changeField(fieldName)}
                    placeholder={placeholder}
                />
            </div>
        );
    }

    renderDropdownField(label, fieldArray, fieldName, disabled) {
        const className = this.props.validationErrors[fieldName] ? 'field error' : 'field';

        return (
            <div className={className}>
                <label>{label}</label>
                <select
                    className="ui fluid search dropdown"
                    disabled={disabled ? 'true' : ''}
                    value={this.props.thesis[fieldName]}
                    onChange={this.changeField(fieldName)}
                >
                    <option key="0" value="">Select {label}</option>
                    {fieldArray.map(field =>
                        <option key={field.id} value={field.id}>
                            {field.name}
                        </option>
                    )}
                </select>
            </div>
        );
    }

    renderThesisAuthor() {
        if (!this.props.thesis.authorFirstname) {
            return (
                <div className="three fields">
                    {this.renderTextField('Email', 'authorEmail', 'Email Address', false, 'email')}
                </div>
            );
        }

        return (
            <div className="three fields">
                {this.renderTextField('Email', 'authorEmail', 'Email Address', true, 'email')}
                {this.renderTextField('First name', 'authorFirstname', 'Email Address', true, 'email')}
                {this.renderTextField('Last name', 'authorLastname', 'Email Address', true, 'email')}
            </div>
        );
    }

    renderThesisInformation() {
        const programmes = this.props.programmes.map(programme => ({
            id: programme.programmeId,
            name: programme.name
        }));

        return (
            <div className="m-bot">
                <div className="three fields">
                    {this.renderDropdownField('Studyfield', programmes, 'programmeId', !this.props.allowEdit)}
                    {this.renderTextField('Title', 'title', 'Title', !this.props.allowEdit)}
                    {this.renderTextField('Urkund-link', 'urkund', 'Link to Urkund', !this.props.allowEdit)}

                </div>
                <div className="three fields">
                    {this.state.oldGrading ?
                        this.renderDropdownField('Grade', oldGradeFields, 'grade', !this.props.allowEdit) :
                        this.renderDropdownField('Grade', gradeFields, 'grade', !this.props.allowEdit)
                    }
                    <div className="field">
                        <label>&nbsp;   </label>
                        <button className="ui button" onClick={() => { this.setState({ oldGrading: !this.state.oldGrading }) }}>
                            {this.state.oldGrading ?
                                'Enable new grading' : 'Enable old grading'}
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
                {this.renderThesisAuthor()}
                <h3 className="ui dividing header">Thesis Information</h3>
                {this.renderThesisInformation()}
            </div>
        );
    }
}

ThesisInformation.propTypes = {
    sendChange: func.isRequired,
    thesis: thesisType.isRequired,
    programmes: arrayOf(programmeType).isRequired,
    allowEdit: bool.isRequired,
    validationErrors: object.isRequired
};
