import React, { Component } from 'react';

export default class Section extends Component {
    constructor() {
        super();
        this.state = {
            sectionKey: "",
            header: "",
            elements: [],
        }
    }

    addField(inputType, nameParam, label, labelType, required, placeHolder) {
        const field = { inputType: inputType, name: nameParam, label: label, 
                        labelType: labelType, required: required, 
                        placeholder: placeHolder };
        this.state.elements.push(field);
    }

    render() {
        return (
            <div key={"section" + sectionKey}><br />
                <h3 className="ui dividing header">{this.state.header}</h3>
                {elements}
            </div>
        )
    }
}