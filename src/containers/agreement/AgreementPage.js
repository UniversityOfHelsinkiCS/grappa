import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AgreementEditModal from '../../components/agreement/AgreementEditModal';
import AgreementView from '../../components/agreement/AgreementView';
import Agreement from '../../components/agreement/Agreement';

//redux
import { connect } from "react-redux";
import { saveAgreement } from "./agreementActions";

//TODO: REMOVE THIS
import { callApi } from "../../util/apiConnection";
const service = require("../../util/apiConnection");

export class AgreementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newAgreement: false,
            formData: {},
            originalData: {},
            editMode: false
        }
    }

    componentDidMount() {
        document.title = "Agreement Page";
        //TODO: REMOVE THIS
        callApi("/agreements/1").then((resp) => {
            var original = Object.assign({}, resp.data[0]);
            this.setState(
                {
                    formData: resp.data[0],
                    originalData: original
                }
            );
        }).catch((error) => console.error(error));
    }

    toggleEditModal = () => {
        var editable = !this.state.editMode;
        this.setState({ editMode: editable });
    }

    updateFormData = (data) => {
        this.setState({ formData: data });
    }

    //TODO: REMOVE THIS
    sendForm = (e) => {
        //TODO sent agreement to correct url based on id
        service.oldPut('/agreements', this.state.formData)
            .then(resp => {
                console.log(resp)
            }).catch((error) => {
                console.error(error)
            });
        //Make this better
        window.location.reload();
    }

    startNewAgreement = () => {
        this.setState({ newAgreement: !this.state.newAgreement })
    }

    handleSaveAgreement = (agreement) => {
        this.props.saveAgreement(agreement);
    }

    render() {
        //check if form data has changed
        var changes = (JSON.stringify(this.state.formData) === JSON.stringify(this.state.originalData));
        if (this.state.newAgreement) {
            return (
                <div>
                    <br />
                    <button className="ui black button" onClick={this.startNewAgreement}> Back </button>
                    <Agreement agreement={this.props.agreement} saveAgreement={this.handleSaveAgreement} />
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <button className="ui black button" onClick={this.startNewAgreement}> New Agreement </button>
                    <AgreementEditModal showModal={this.state.editMode} closeModal={this.toggleEditModal} formData={this.state.formData} originalData={this.state.originalData} updateFormData={this.updateFormData} />
                    <AgreementView agreementData={this.state.formData} />
                    <div className="ui segment">
                        <button className="ui primary button" onClick={this.toggleEditModal}>Edit agreement</button>
                        <button className="ui primary button" type="submit" disabled={changes} onClick={this.sendForm}>Save Agreement</button>
                        <br />
                        <br />
                        <p><Link to="/">Go back to HomePage</Link></p>
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
});

const mapStateToProps = (state) => {
    return {
        agreement: state.agreement
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AgreementPage);
