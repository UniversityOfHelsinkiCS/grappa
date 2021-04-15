import React from 'react'
import { bool, func } from 'prop-types'
import { Button, Modal } from 'semantic-ui-react'
import { thesisType, programmeType, councilmeetingType } from '../../../util/types'

const ThesisConfirmModal = ({
    showModal,
    closeModal,
    sendSaveThesis,
    thesis,
    programme,
    councilmeeting,
    meetingProgramme }) => {
    if (!showModal) {
        return null
    }
    const authorText = <p><b>Author email:</b> {thesis.authorEmail}</p>
    const thesisText = <p><b>Thesis:</b> {thesis.title}</p>
    const gradeText = <p><b>Grade:</b> {thesis.grade}</p>
    const additionalInfoText = thesis.additionalInfo ? <p><b>Additional info:</b> {thesis.additionalInfo}</p> : undefined
    const gradersText = (
        <p>
            <b>Graders:</b> {thesis.graders.map(grader => (
                <span key={grader.person.personId}>
                    {grader.person.firstname} {grader.person.lastname}, {grader.person.email},
                </span>)
            )}
        </p>)
    const programmeText = <p><b>Unit:</b> {programme.name}</p>
    const isCouncilmeeting = councilmeeting && meetingProgramme
    const councilmeetingText = isCouncilmeeting ?
        <p><b>Council meeting:</b> {meetingProgramme.name} {new Date(councilmeeting.date).toLocaleDateString()}</p> :
        <p><b>No council meeting selected. Are you sure about this?</b></p>
    return (
        <Modal dimmer open closeOnDimmerClick={false} onClose={closeModal} closeIcon>
            <Modal.Header>Confirm your submission details</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    {authorText}
                    {thesisText}
                    {gradeText}
                    {additionalInfoText}
                    {gradersText}
                    {programmeText}
                    {councilmeetingText}
                    <p>
                        After this submission, an email will be sent to the student at {thesis.authorEmail},
                        instructing them to log in to Grappa to confirm that the thesis can be presented in
                        the given councilmeeting. The student must also upload the thesis to e-thesis for archiving. You should also remind them about these.
                        <br />
                    </p>
                    <br />
                    <Button negative onClick={closeModal}>Cancel</Button>
                    <Button positive onClick={sendSaveThesis}>Confirm save</Button>
                </Modal.Description>
            </Modal.Content>
        </Modal >
    )
}

ThesisConfirmModal.propTypes = {
    showModal: bool.isRequired,
    closeModal: func.isRequired,
    sendSaveThesis: func.isRequired,
    thesis: thesisType.isRequired,
    programme: programmeType,
    councilmeeting: councilmeetingType,
    meetingProgramme: programmeType
}

ThesisConfirmModal.defaultProps = {
    councilmeeting: undefined,
    meetingProgramme: undefined,
    programme: undefined
}

export default ThesisConfirmModal
