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

    setHeader(newHeader) {
        this.setState({header: newHeader});
    }
    
    setSectionKey(newSectionKey) {
        this.setState({sectionKey: newSectionKey});
    }

    renderListElements() {
        return (
            <ul>
              {this.props.elements.map(function(listValue){
                return <li>{listValue}</li>;
              })}
            </ul>
          )
    }

    render() {
        return (
            <div key={"section" + this.state.sectionKey}><br />
                <h3 className="ui dividing header">{this.props.header}</h3>
                {this.props.elements}
            </div>
        )
    }
}