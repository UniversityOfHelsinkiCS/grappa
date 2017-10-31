import React, { Component } from 'react';

export default class Field extends Component {
    defineFieldClasses = (extraClassNames, fieldType, required) => {
        return ("field small" + 
                    (extraClassNames === undefined ? '' : ' '+extraClassNames) + 
                    (fieldType === undefined ? '' : ' '+fieldType) + 
                    (required === true ? ' required' : '')
                );
    }

    render() {

        let forReturn = [];

        switch(this.props.fieldData.inputType) {
            case "input":
                forReturn = [<label key={this.props.fieldKey + "label"} >{this.props.fieldData.label}</label>,
                            <input 
                                key={this.props.fieldKey} 
                                name={this.props.fieldData.name} 
                                type="text" placeholder={this.props.fieldData.placeholder} 
                                onChange={this.props.fieldOnChangeFunc} />
                            ];
                break;
            case "textarea":
                forReturn = [<label key={this.props.fieldKey + "label"}>{this.props.fieldData.label}</label>,
                             <textarea 
                                key={this.props.fieldKey} 
                                name={this.props.fieldData.name} 
                                rows={this.props.fieldData.rows} 
                                placeholder={this.props.fieldData.placeholder} 
                                onChange={this.props.fieldOnChangeFunc} ></textarea>
                            ];
                break;
            case "bareText":
                forReturn = [<label key={this.props.fieldKey + "label"} >{this.props.fieldData.label}</label>,
                            <p 
                                key={this.props.fieldKey} 
                                id={this.props.fieldData.name} 
                                type="text" placeholder={this.props.fieldData.placeholder} />
                            ];
                break;
            case "dropdown":
            forReturn = [<label key={this.props.fieldKey + "label"} >{this.props.fieldData.label}</label>,
                            <select className="ui dropdown" onChange={this.props.fieldOnChangeFunc} name={this.props.fieldData.name} >
                                {this.props.fieldData.responses.map(
                                    (response) => {
                                        return <option value={response.value} selected={response.selected} >{response.text}</option>;
                                    })}
                            </select>
                        ];
            break;
            default:
                console.error("FormField error ("+this.props.fieldData.name+"): inputType not defined!");
        }

        return (
            <div key={this.props.fieldKey + "fieldDiv"} className={this.defineFieldClasses(this.props.fieldData.extraClassNames, this.props.fieldData.inputType, this.props.fieldData.required)}>
                {forReturn}
            </div>
        );
    }
}