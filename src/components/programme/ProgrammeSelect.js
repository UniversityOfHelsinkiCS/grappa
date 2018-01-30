import React, { Component } from 'react';
import { arrayOf, func, number } from 'prop-types';
import { programmeType } from '../../util/types';

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
        newEvent.target.value = undefined
        this.props.onChange(newEvent)
    }

    render() {
        const { onChange, value } = this.props
        const programmes = this.props.programmes.filter(programme =>
            !programme.name.includes('Department') === this.state.newUnits
        )
        return (
            <div className="ui form">
                <div className="two fields">
                    <div className="field">
                        <button onClick={this.swapUnit} className="ui button fluid" >Switch between old and new</button>
                    </div>
                    <div className="field twelve wide">
                        <select
                            className="ui dropdown"
                            onChange={onChange}
                            value={value}
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
        );
    }
}

ProgrammeSelect.propTypes = {
    onChange: func.isRequired,
    programmes: arrayOf(programmeType).isRequired,
    value: number
};

ProgrammeSelect.defaultProps = {
    value: undefined
};
