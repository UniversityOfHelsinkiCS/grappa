import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AgreementEditModal from '../../components/agreement/AgreementEditModal';
import AgreementView from '../../components/agreement/AgreementView';
import Agreement from '../../components/agreement/Agreement';
import { getRequiredFields } from './agreementValidations';
import { personType, programmeType, roleType, agreementType, thesisType } from '../../util/types';

// redux
import { connect } from 'react-redux';
import { saveAgreement, updateAgreement, saveAttachment, saveAgreementDraft } from './agreementActions';

export class AgreementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newAgreement: false,
            originalAgreements: {},
            editableAgreement: undefined,
            editMode: false,
            agreements: undefined,
            requiredFields: getRequiredFields(this.props.user.roles)
        }
    }

    componentDidMount() {
        document.title = 'Agreement Page';
    }

    componentWillMount() {
        this.setState({ agreements: this.props.agreements });
    }

    componentWillReceiveProps(newProps) {
        if (newProps && this.props !== newProps && newProps.agreements) {
            // const agreement = newProps.agreements.find(agreement => agreement.authorId === this.props.user.personId);
            const agreements = newProps.agreements;
            if (agreements) {
                this.setState(
                    {
                        agreements,
                        originalAgreement: Object.assign({}, agreements)
                    }
                );
            }
        }
    }

    parseResponseData = (data) => {
        const parsedData = data.agreement;
        // TODO: refactor this when we can distinguish between secondary and other supervisor
        for (let i = 0; i < data.persons.length; i++) {
            if (data.persons[i].personRoleId === data.agreement.responsibleSupervisorId) {
                parsedData.thesisSupervisorMain = `${data.persons[i].firstname} ${data.persons[i].lastname}`
            } else if (parsedData.thesisSupervisorSecond === undefined) {
                parsedData.thesisSupervisorSecond = `${data.persons[i].firstname} ${data.persons[i].lastname}`
            } else {
                parsedData.thesisSupervisorOther = `${data.persons[i].firstname} ${data.persons[i].lastname}`
            }
        }
        return parsedData;
    }

    // TODO strange warnings when closing a modal
    toggleEditModal = () => {
        const editable = !this.state.editMode;
        this.setState({ editMode: editable });
    }

    updateFormData = (data) => {
        this.setState({ agreement: data });
    }

    sendForm = () => {
        this.props.updateAgreement(this.state.agreements);
    }

    startNewAgreement = () => {
        this.setState({ newAgreement: !this.state.newAgreement });
    }

    handleSaveAgreement = (agreement) => {
        this.props.saveAgreement(agreement);
        if (agreement.attachments !== undefined) {
            this.props.saveAttachment(agreement.attachments);
        }
    }

    handleSaveAgreementDraft = (agreementDraft) => {
        this.props.saveAgreementDraft(agreementDraft);
    }

    checkForChanges = (a, b) => {
        if (a === undefined || b === undefined)
            return false;
        // Create arrays of property names
        const aProps = Object.getOwnPropertyNames(a);

        for (let i = 0; i < aProps.length; i++) {
            const propName = aProps[i];
            if (a[propName] !== b[propName])
                return false;
        }
        return true;
    }

    render() {
        if (this.state.newAgreement) {
            return (
                <div>
                    <br />
                    <button className="ui black button" onClick={this.startNewAgreement}> Back </button>
                    <Agreement
                        agreement={this.state.agreements}
                        supervisors={this.props.supervisors}
                        programmes={this.props.programmes}
                        user={this.props.user}
                        saveAgreement={this.handleSaveAgreement}
                        saveAgreementDraft={this.handleSaveAgreementDraft}
                        requiredFields={this.state.requiredFields}
                    />
                </div>
            );
        }
        // check if form data has changed
        const disableSubmit = this.checkForChanges(this.state.agreements, this.state.originalAgreements);
        return (
            <div>
                <br />
                <button className="ui black button" onClick={this.startNewAgreement}> New Agreement </button>
                <AgreementEditModal
                    showModal={this.state.editMode}
                    closeModal={this.toggleEditModal}
                    formData={this.state.editableAgreement}
                    originalAgreement={this.state.editableAgreement}
                    updateFormData={this.updateFormData}
                />

                {this.state.agreements ?
                    <AgreementView
                        agreements={this.state.agreements}
                        handleEditAgreement={this.toggleEditModal}
                        editableAgreement={this.state.editableAgreement}
                        persons={this.props.persons}
                        theses={this.props.theses}
                    /> : undefined}

                <div className="ui segment">
                    <button className="ui primary button" type="submit" disabled={disableSubmit} onClick={this.sendForm}>Save Agreement</button>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    saveAgreement(data) {
        dispatch(saveAgreement(data));
    },
    saveAgreementDraft(data) {
        dispatch(saveAgreementDraft(data));
    },
    saveAttachment(data) {
        dispatch(saveAttachment(data));
    },
    updateAgreement(data) {
        dispatch(updateAgreement(data));
    }
});

const getSupervisorRoles = roles => roles.filter(role => role.name === 'supervisor');
const getSupervisors = (roles, persons) => getSupervisorRoles(roles).map(role =>
    ({
        person: persons.find(person => person.personId === role.personId),
        personRoleId: role.personRoleId,
        programmeId: role.programmeId
    }));

const mapStateToProps = state => ({
    agreements: state.agreements,
    persons: state.persons,
    programmes: state.programmes,
    user: state.user,
    roles: state.roles,
    supervisors: getSupervisors(state.roles, state.persons),
    theses: state.theses
});

const { func, arrayOf, array } = PropTypes;
AgreementPage.propTypes = {
    user: personType.isRequired,
    updateAgreement: func.isRequired,
    saveAgreement: func.isRequired,
    saveAgreementDraft: func.isRequired,
    saveAttachment: func.isRequired,
    programmes: arrayOf(programmeType).isRequired,
    roles: arrayOf(roleType).isRequired,
    supervisors: array.isRequired,
    persons: arrayOf(personType).isRequired,
    agreements: arrayOf(agreementType).isRequired,
    theses: arrayOf(thesisType).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(AgreementPage);
