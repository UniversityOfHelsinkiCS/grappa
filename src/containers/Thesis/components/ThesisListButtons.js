import React from 'react'
import { bool, func } from 'prop-types'
import { LoadingIndicator } from '../../LoadingIndicator'

const ThesisListButtons = ({ sendDownloadSelected, toggleCover, cover, markDone, toggleMarkDone, toggleAll }) => (
    <div className="ui form">
        <div className="two fields" >
            <div className="field">
                <LoadingIndicator type="DOWNLOAD" />
                <button className="ui orange button" onClick={sendDownloadSelected}>Download</button>
                &nbsp;
                <div className="ui toggle checkbox">
                    <input
                        type="checkbox"
                        checked={cover ? 'true' : ''}
                        onChange={toggleCover}
                    />
                    <label>Include cover</label>
                </div>
                &nbsp;
                <div className="ui toggle checkbox">
                    <input
                        type="checkbox"
                        checked={markDone ? 'true' : ''}
                        onChange={toggleMarkDone}
                    />
                    <label>Mark print done</label>
                </div>
            </div>
            <div className="field">
                <button className="ui purple button" onClick={toggleAll}>Select all</button>
            </div>
        </div>
    </div>
)

ThesisListButtons.propTypes = {
    sendDownloadSelected: func.isRequired,
    toggleCover: func.isRequired,
    cover: bool.isRequired,
    markDone: func.isRequired,
    toggleMarkDone: func.isRequired,
    toggleAll: func.isRequired
}

export default ThesisListButtons
