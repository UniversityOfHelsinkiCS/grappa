import React from 'react';
import { arrayOf } from 'prop-types';
import { programmeType } from '../../util/types';

export const StudyfieldList = props => {

    const handleClick = (programme) => () => {
        props.selectField(programme);
    }

    return (
        <table className="ui celled table">
            <thead>
                <tr>
                    <th>Active</th>
                    <th>Name</th>
                    <th>Professor</th>
                </tr>
            </thead>
            <tbody>
                {props.programmes.sort((a, b) => a.name > b.name).map((programme) =>
                    <tr key={programme.programmeId} onClick={handleClick(programme)}>
                        <td>{programme.isActive ? 'true' : 'false'}</td>
                        <td>{programme.name}</td>
                        <td>{programme.professor}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

StudyfieldList.propTypes = {
    programmes: arrayOf(programmeType).isRequired
};

export default StudyfieldList;
