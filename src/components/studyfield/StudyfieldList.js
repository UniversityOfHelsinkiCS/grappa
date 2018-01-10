import React from 'react';
import { arrayOf } from 'prop-types';
import { studyfieldType } from '../../util/types';

export const StudyfieldList = props => {

    const handleClick = (studyfield) => () => {
        props.selectField(studyfield);
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
                {props.studyfields.sort((a, b) => a.name > b.name).map((studyfield, index) =>
                    <tr key={studyfield.studyfieldId} onClick={handleClick(studyfield)}>
                        <td>{studyfield.isActive ? 'true' : 'false'}</td>
                        <td>{studyfield.name}</td>
                        <td>{studyfield.professor}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

StudyfieldList.propTypes = {
    studyfields: arrayOf(studyfieldType).isRequired
};

export default StudyfieldList;