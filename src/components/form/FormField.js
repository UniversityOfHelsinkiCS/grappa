import React, { Component } from 'react';


export default class Field extends Component {
    defineFieldClasses = (labelType, fieldType, required) => {
        return ("field small " + labelType + " " + fieldType + " " + (required === true ? 'required' : ''));
    }
    render() {

        let forReturn = [];
        if (this.props.fieldData.inputType === "input") {

            forReturn = [<label key={this.props.fieldKey + "label"} >{this.props.fieldData.label}</label>,
            <input key={this.props.fieldKey} name={this.props.fieldData.name} type="text" placeholder={this.props.fieldData.placeholder} />];

        

        } else if (this.props.fieldData.inputType === "textarea") {
            forReturn = [<label key={this.props.fieldKey + "label"}>{this.props.fieldData.label}</label>,
            <textarea key={this.props.fieldKey} name={this.props.fieldData.name} rows={this.props.fieldData.rows} placeholder={this.props.fieldData.placeholder} ></textarea>];
        }

        return (
            <div key={this.props.fieldKey + "fieldDiv"} className={this.defineFieldClasses(this.props.fieldData.labelType, this.props.fieldData.inputType, this.props.fieldData.required)}>
                {forReturn}
            </div>
        );
    }
}