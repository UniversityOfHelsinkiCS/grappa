import React from 'react';
import { arrayOf, func, number, string } from 'prop-types';
import { programmeType } from '../../util/types';

const ProgrammeSelect = ({ onChange, programmes, value, id }) => (
    <div style={{ width: '10em', display: 'inline-block' }}>
        <select
            id={id}
            className="ui dropdown"
            onChange={onChange}
            value={value}
        >
            <option value="null">No programme</option>
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
);

ProgrammeSelect.propTypes = {
    onChange: func.isRequired,
    programmes: arrayOf(programmeType).isRequired,
    value: number,
    id: string
};

ProgrammeSelect.defaultProps = {
    id: '',
    value: undefined
};

export default ProgrammeSelect;
