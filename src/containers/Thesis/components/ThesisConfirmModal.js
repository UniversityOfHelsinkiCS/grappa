import React from 'react'
import { bool, func } from 'prop-types'
import { Button } from 'semantic-ui-react'

const ThesisConfirmModal = ({ showModal, closeModal, sendSaveThesis }) => {
    if (!showModal) {
        return null
    }
    return (
        <div>
            <div className="ui dimmer modals page transition visible active" onClick={closeModal} />
            <div className="ui active modal" style={{ border: '2px solid black', borderRadius: '7px' }}>
                <i className="close icon" onClick={closeModal} />
                <div className="header">
                    Reminder
                </div>
                <div style={{ margin: '1%' }}>
                    <div className="description">
                        <p>
                            If you are from department of CS:
                            Have you remembered to add the thesis into the thesis-management system?
                            If not please do so right away.
                        </p>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://ilmo.cs.helsinki.fi/gradu/servlet/hae"
                        >
                            Ilmo (opens in a new window)
                        </a>
                    </div>
                    <br />
                    <Button negative onClick={closeModal}>Cancel</Button>
                    <Button positive onClick={sendSaveThesis}>Confirm save</Button>
                </div>
            </div>
        </div >
    )
}

ThesisConfirmModal.propTypes = {
    showModal: bool.isRequired,
    closeModal: func.isRequired,
    sendSaveThesis: func.isRequired
}

export default ThesisConfirmModal
