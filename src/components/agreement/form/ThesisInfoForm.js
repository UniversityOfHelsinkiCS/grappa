import React, { Component } from 'react';

export default class ThesisInfoForm extends Component {

    field = (label, formName) => {
        return (
            <div>
                <br/>
                <b>{label}</b>
                <div className="ui fluid input">
                    <input type="text" name={formName} onChange={this.props.handleChange}/>
                </div>
            </div>
        )
    }
    render() {
        return (
            <div>
                <h1>Opinnäytetyö</h1>
                {this.field("Opinnäytetyön otsikko (työnimi) tekokielellä", "thesisTitle")}
                {this.field("Aloitusajankohta", "thesisStartDate")}
                {this.field("Arvioitu valmistumisajankohta", "thesisCompletionEta")}
                {this.field("Suorituspaikka", "thesisPerformancePlace")}
            </div>
        )
    }
}