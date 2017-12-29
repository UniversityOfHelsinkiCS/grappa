import React, { Component } from 'react';
import AgreementEditModal from '../../components/agreement/AgreementEditModal';
import AgreementView from '../../components/agreement/AgreementView';
import Agreement from '../../components/agreement/Agreement';
import { getRequiredFields } from './agreementValidations';

//redux
import { connect } from 'react-redux';
import { saveAgreement, updateAgreement, saveAttachment, saveAgreementDraft } from './agreementActions';

export class AgreementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newAgreement: false,
            originalAgreement: {},
            editableAgreement: undefined,
            editMode: false,
            agreement: undefined, //TODO rename as agreementS, I didn't have time to do it because I got weird bugs when trying
            requiredFields: getRequiredFields(this.props.user.roles)
        }
    }

    componentDidMount() {
        document.title = 'Agreement Page';
    }

    componentWillReceiveProps(newProps) {
        if (newProps && this.props !== newProps && newProps.agreements) {
            //const agreement = newProps.agreements.find(agreement => agreement.authorId === this.props.user.personId);
            const agreement = newProps.agreements;
            if (agreement) {
                this.setState(
                    {
                        agreement: agreement,
                        originalAgreement: Object.assign({}, agreement)
                    }
                );
            }
        }
    }

    parseResponseData = (data) => {
        var parsedData = data.agreement;
        //TODO: refactor this when we can distinguish between secondary and other supervisor
        for (let i = 0; i < data.persons.length; i++) {
            if (data.persons[i].personRoleId === data.agreement.responsibleSupervisorId) {
                parsedData.thesisSupervisorMain = data.persons[i].firstname + ' ' + data.persons[i].lastname
            } else if (parsedData.thesisSupervisorSecond === undefined) {
                parsedData.thesisSupervisorSecond = data.persons[i].firstname + ' ' + data.persons[i].lastname
            } else {
                parsedData.thesisSupervisorOther = data.persons[i].firstname + ' ' + data.persons[i].lastname
            }
        }
        return parsedData;
    }

    //TODO strange warnings when closing a modal
    toggleEditModal = (agreement) => {
        var editable = !this.state.editMode;
        this.setState({ editMode: editable, editableAgreement: agreement });
    }

    updateFormData = (data) => {
        this.setState({ agreement: data });
    }

    sendForm = () => {
        this.props.updateAgreement(this.state.agreement);
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
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
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
                        agreement={this.state.agreement}
                        supervisors={this.props.supervisors}
                        studyfields={this.props.studyfields}
                        user={this.props.user}
                        saveAgreement={this.handleSaveAgreement}
                        saveAgreementDraft={this.handleSaveAgreementDraft}
                        requiredFields={this.state.requiredFields}
                    />
                </div>
            );
        } else {
            //check if form data has changed
            let disableSubmit = this.checkForChanges(this.state.agreement, this.state.originalAgreement);
            return (
                <div>
                    <br />
                    <button className="ui black button" onClick={this.startNewAgreement}> New Agreement </button>
                    <AgreementEditModal showModal={this.state.editMode} closeModal={this.toggleEditModal} formData={this.state.editableAgreement} originalAgreement={this.state.editableAgreement} updateFormData={this.updateFormData} />
                    
                    {this.state.agreement ? <AgreementView agreementData={this.state.agreement} handleEditAgreement={this.toggleEditModal} editableAgreement={this.state.editableAgreement}/>: undefined}
                      
                    <div className="ui segment">
                        <button className="ui primary button" type="submit" disabled={disableSubmit} onClick={this.sendForm}>Save Agreement</button>
                    </div>
                </div>
            );
        }
    }
}

const mapDispatchToProps = (dispatch) => ({
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
    },
});

const mapStateToProps = (state) => {
    return {
        agreements: state.agreements,
        persons: state.persons,
        studyfields: state.studyfields,
        user: state.user,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AgreementPage);
