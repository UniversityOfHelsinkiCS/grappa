import React, { Component } from 'react';
import AgreementEditModal from '../../components/agreement/AgreementEditModal';
import AgreementView from '../../components/agreement/AgreementView';
import Agreement from '../../components/agreement/Agreement';

//redux
import { connect } from "react-redux";
import { getAgreement, saveAgreement, updateAgreement } from "./agreementActions";
import { getSupervisors } from "../supervisor/supervisorActions";

export class AgreementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newAgreement: false,
            originalData: {},
            editMode: false,
            agreement: { personId: 1 }
        }
    }

    componentDidMount() {
        document.title = "Agreement Page";
        this.props.getAgreement(this.state.agreement.personId);
        this.props.getSupervisors();
    }

    componentWillReceiveProps(newProps) {
        if (newProps && this.props !== newProps && newProps.agreement) {
            const agreement = newProps.agreement.find(agreement => agreement.personId === this.state.agreement.personId)
            if (agreement) this.setState({ agreement });
        }
    }

    parseResponseData = (data) => {
        var parsedData = data.agreement;
        //TODO: refactor this when we can distinguish between secondary and other supervisor
        for (let i = 0; i < data.persons.length; i++) {
            if (data.persons[i].personRoleId === data.agreement.responsibleSupervisorId) {
                parsedData.thesisSupervisorMain = data.persons[i].firstname + " " + data.persons[i].lastname
            } else if (parsedData.thesisSupervisorSecond === undefined) {
                parsedData.thesisSupervisorSecond = data.persons[i].firstname + " " + data.persons[i].lastname
            } else {
                parsedData.thesisSupervisorOther = data.persons[i].firstname + " " + data.persons[i].lastname
            }
        }
        return parsedData;
    }

    toggleEditModal = () => {
        var editable = !this.state.editMode;
        this.setState({ editMode: editable });
    }

    updateFormData = (data) => {
        this.setState({ formData: data });
    }

    sendForm = () => {
        this.props.updateAgreement(this.state.formData)
    }

    startNewAgreement = () => {
        this.setState({ newAgreement: !this.state.newAgreement })
    }

    handleSaveAgreement = (agreement) => {
        this.props.saveAgreement(agreement);
    }

    render() {
        if (this.state.newAgreement) {
            return (
                <div>
                    <br />
                    <button className="ui black button" onClick={this.startNewAgreement}> Back </button>
                    <Agreement agreement={this.state.agreement} supervisors={this.props.supervisors} saveAgreement={this.handleSaveAgreement} />
                </div>
            );
        } else {
            //check if form data has changed
            const disableSubmit = this.state.formData === this.state.originalData;
            return (
                <div>
                    <br />
                    <button className="ui black button" onClick={this.startNewAgreement}> New Agreement </button>
                    <AgreementEditModal showModal={this.state.editMode} closeModal={this.toggleEditModal} formData={this.state.agreement} originalData={this.state.originalData} updateFormData={this.updateFormData} />
                    <AgreementView agreementData={this.state.agreement} />
                    <div className="ui segment">
                        <button className="ui primary button" onClick={this.toggleEditModal}>Edit agreement</button>
                        <button className="ui primary button" type="submit" disabled={disableSubmit} onClick={this.sendForm}>Save Agreement</button>
                    </div>
                </div>
            );
        }
    }
}

const mapDispatchToProps = (dispatch) => ({
    getAgreement(data) {
        dispatch(getAgreement(data));
    },
    saveAgreement(data) {
        dispatch(saveAgreement(data));
    },
    updateAgreement(data) {
        dispatch(updateAgreement(data));
    },
    getSupervisors(data) {
        dispatch(getSupervisors(data));
    }
});

const mapStateToProps = (state) => {
    return {
        agreement: state.agreement,
        supervisors: state.supervisor
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AgreementPage);
