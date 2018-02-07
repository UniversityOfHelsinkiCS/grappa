import React, { Component } from 'react';
import { arrayOf, func } from 'prop-types';
import { programmeType } from '../../util/types';

export default class ProgrammeSelect extends Component {
    constructor() {
        super();
        this.state = {
            newUnits: true
        }
    }

    swapUnit = (event) => {
        this.setState({ newUnits: !this.state.newUnits });
        const newEvent = Object.assign({}, event);
        this.props.onChange(newEvent)
    };

    handleChange = (event) => {
        this.props.onChange(event);
        this.select.value = null;
    };

    render() {
        const programmes = this.props.programmes.filter(programme =>
            !programme.name.includes('Department') === this.state.newUnits
        );

        return (
            <div className="ui form">
                <div className="two fields">
                    <div className="field">
                        <button onClick={this.swapUnit} className="ui button fluid" >
                            {this.state.newUnits ? 'Switch to old units' : 'Switch to new units'}
                        </button>
                    </div>
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
        );
    }
}

ProgrammeSelect.propTypes = {
    onChange: func.isRequired,
    programmes: arrayOf(programmeType).isRequired
};
