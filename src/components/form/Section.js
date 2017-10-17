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
    
    render() {
        return (
            <div key={"section" + this.state.sectionKey}><br />
                <h3 className="ui dividing header">{this.props.header}</h3>
                {this.props.elements}
            </div>
        )
    }
}