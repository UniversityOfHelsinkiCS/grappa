import React from 'react';
import { arrayOf } from 'prop-types';
import { programmeType } from '../../util/types';

export const ProgrammeList = ({ programmes, select }) => {

    const handleClick = (programme) => () => {
        select(programme);
    }

    return (
        <table className="ui celled table">
            <thead>
                <tr>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                {programmes.sort((a, b) => a.name > b.name).map((programme) =>
                    <tr key={programme.programmeId} onClick={handleClick(programme)}>
                        <td>{programme.name}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

ProgrammeList.propTypes = {
    programmes: arrayOf(programmeType).isRequired
};

export default ProgrammeList;
