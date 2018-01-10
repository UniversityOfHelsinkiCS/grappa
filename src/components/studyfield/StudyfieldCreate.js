import React from 'react';
import { func } from 'prop-types';

export const StudyfieldCreate = props => {

    const handleChange = (event) => {
        props.sendChange(event.target.value);
    }

    const saveStudyfield = () => {
        props.sendSave();
    }

    return (
        <div>
            <h2 className="ui dividing header">Create a studyfield</h2>
            <div className="two fields">
                <div className="field">
                    <input
                        type="text"
                        placeholder="Name"
                        onChange={handleChange}
                    />
                </div>
                <div className="field">
                    <button className="ui primary button" onClick={saveStudyfield}>Save</button>
                </div>
            </div>
        </div>
    );
}

StudyfieldCreate.propTypes = {
    sendChange: func.isRequired,
    sendSave: func.isRequired
};

export default StudyfieldCreate;
