import React, { Component } from 'react';
import AgreementEditModal from '../../components/agreement/AgreementEditModal';
import AgreementView from '../../components/agreement/AgreementView';
import Agreement from '../../components/agreement/Agreement';

//redux
import { connect } from "react-redux";
import { getAgreement, saveAgreement, updateAgreement } from "./agreementActions";
import { getSupervisors } from "../supervisor/supervisorActions";
import { getStudyfields } from "../studyfield/studyfieldActions";

export class AgreementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newAgreement: false,
            originalAgreement: {},
            editMode: false,
            agreement: undefined
        }
    }

    componentDidMount() {
        document.title = "Agreement Page";
        if (this.props.user)
            this.props.getAgreement(this.props.user.id);
        this.props.getSupervisors();
        this.props.getStudyfields();
    }

    componentWillReceiveProps(newProps) {
        if (newProps && this.props !== newProps && newProps.agreement) {
            const agreement = newProps.agreement.find(agreement => agreement.personId === this.props.user.id)
            if (agreement) {
                this.setState(
                    {
                        agreement : agreement,
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
        this.setState({ agreement: data });
    }

    sendForm = () => {
        this.props.updateAgreement(this.state.agreement);
    }

    startNewAgreement = () => {
        this.setState({ newAgreement: !this.state.newAgreement });
    }

    handleSaveAgreement = (agreement) => {
        console.log("handleSaveAgreement", agreement);
        this.props.saveAgreement(agreement);
    }

    render() {
        if (this.state.newAgreement) {
            return (
                <div>
                    <br />
                    <button className="ui black button" onClick={this.startNewAgreement}> Back </button>
                    <Agreement agreement={this.state.agreement} supervisors={this.props.supervisors} studyfields={this.props.studyfields} saveAgreement={this.handleSaveAgreement} />
                </div>
            );
        } else {
            //check if form data has changed
            /*
            console.log("this.state.agreement", this.state.agreement);
            console.log("this.state.originalAgreement", this.state.originalAgreement);
            console.log(Object.is(this.state.agreement, this.state.originalAgreement));
            */
            //doesn't work
            const disableSubmit = Object.is(this.state.agreement, this.state.originalAgreement);
            return (
                <div>
                    <br />
                    <button className="ui black button" onClick={this.startNewAgreement}> New Agreement </button>
                    <AgreementEditModal showModal={this.state.editMode} closeModal={this.toggleEditModal} formData={this.state.agreement} originalAgreement={this.state.originalAgreement} updateFormData={this.updateFormData} />
                    {this.state.agreement? <AgreementView agreementData={this.state.agreement} /> : undefined}
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
    },
    getStudyfields(data) {
        dispatch(getStudyfields(data));
    }
});

const mapStateToProps = (state) => {
    return {
        agreement: state.agreement,
        supervisors: state.supervisor,
        studyfields: state.studyfield,
        user: state.user
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AgreementPage);
