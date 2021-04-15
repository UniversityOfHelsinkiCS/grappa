import React, { Component } from 'react'
import { func, object } from 'prop-types'

export default class ThesisInfoForm extends Component {
    field = (label, formName) => (
        <div>
            <br />
            <b>{label}</b>
            <div className="ui fluid input">
                <input type="text" name={formName} onChange={this.props.handleChange} />
                {(Object.keys(this.props.requiredFields).includes(formName) && !this.props.requiredFields[formName]) ?
                    (
                        <div className="ui left pointing red basic label">
                            Täytä tiedot
                        </div>
                    ) : ''}
            </div>
        </div>
    )
    render() {
        return (
            <div>
                <h1>Opinnäytetyö</h1>
                {this.field('Opinnäytetyön otsikko (työnimi) tekokielellä', 'thesisTitle')}
                {this.field('Aloitusajankohta', 'thesisStartDate')}
                {this.field('Arvioitu valmistumisajankohta', 'thesisCompletionEta')}
                {this.field('Suorituspaikka', 'thesisPerformancePlace')}
            </div>
        )
    }
}

ThesisInfoForm.propTypes = {
    handleChange: func.isRequired,
    requiredFields: object.isRequired
}
