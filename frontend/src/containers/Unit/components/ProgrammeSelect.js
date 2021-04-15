import React, { Component } from 'react'
import { arrayOf, func, bool } from 'prop-types'
import { Checkbox, FormField } from 'semantic-ui-react'
import { programmeType } from '../../../util/types'

export default class ProgrammeSelect extends Component {
    constructor() {
        super()
        this.state = {
            newUnits: true
        }
    }

    swapUnit = (event) => {
        this.setState({ newUnits: !this.state.newUnits })
        const newEvent = Object.assign({}, event)
        this.props.onChange(newEvent)
    };

    handleChange = (event) => {
        this.props.onChange(event)

        if (this.props.clearSelect)
            this.select.value = null
    };

    render() {
        const programmes = this.props.programmes.filter(programme =>
            !programme.name.includes('Department') === this.state.newUnits &&
            !programme.name.includes('OLD')
        )

        return (
            <div className="ui form">
                <div className="two fields">
                    <FormField>
                        <Checkbox
                            toggle
                            label="New units"
                            onChange={this.swapUnit}
                            checked={this.state.newUnits}
                        />
                    </FormField>
                    <div className="field">
                        <select
                            className="ui dropdown"
                            onChange={this.handleChange}
                            ref={(select) => { this.select = select }}
                        >
                            <option value="null">Select unit</option>
                            {programmes.map(programme => (
                                <option
                                    key={programme.programmeId}
                                    value={programme.programmeId}
                                >
                                    {programme.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        )
    }
}

ProgrammeSelect.propTypes = {
    onChange: func.isRequired,
    programmes: arrayOf(programmeType).isRequired,
    clearSelect: bool
}

ProgrammeSelect.defaultProps = {
    clearSelect: false
}
