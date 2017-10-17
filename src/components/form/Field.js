import React, { Component } from 'react';


export default class Field extends Component {


    createField = (fieldData, fieldKey) => {
        let forReturn = [];
        if (fieldData.inputType === "input") {

            forReturn = [<div key={fieldKey + "label"} className="ui label" >{fieldData.label}</div>,
            <input key={fieldKey} name={fieldData.name} type="text" placeholder={fieldData.placeholder}
             value={this.state.form[fieldData.name]} onChange={this.handleFormChange} />];

            if (fieldData.labelType.includes("right")) {
                forReturn.reverse();
            }
        } else if (fieldData.inputType === "textarea") {
            forReturn = [<label key={fieldKey + "label"}>{fieldData.label}</label>,
            <textarea key={fieldKey} name={fieldData.name} rows={fieldData.rows} placeholder={fieldData.placeholder} value={this.state.form[fieldData.name]} onChange={this.handleFormChange}></textarea>];
        }

        return (
            <div key={fieldKey + "fieldDiv"} className={this.defineFieldClasses(fieldData.labelType, fieldData.inputType, fieldData.required)}>
                {forReturn}
            </div>
        );
    }
}