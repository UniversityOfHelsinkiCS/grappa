import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AgreementEditModal from './AgreementEditModal';
import AgreementView from './AgreementView';
import { callApi } from "../../util/apiConnection";
const service = require("../../util/apiConnection");

class AgreementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {},
            originalData: {},
            editMode: false
        }
    }

    componentDidMount() {
        document.title = "Agreement Page";
        //TODO: fetch the correct agreement based on user
        //var resp = getAgreement(1);
        callApi("/agreements/1").then((resp) => {
            var data = this.parseResponceData(resp.data);
            this.setState(
                {
                    formData: data,
                    originalData: Object.assign({}, data)
                }
            );
        }).catch((error) => console.error(error));
    }

    parseResponceData = (data) => {
        var parsedData = data.agreement;
        //TODO: refactor this when we can distinguish between secondary and other supervisor
        for (let i = 0; i < data.persons.length; i++) {
            if (data.persons[i].personRoleId === 1) {
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
        this.setState(
            {
                editMode: editable
            }
        );
    }

    updateFormData = (data) => {
        this.setState(
            {
                formData: data
            }
        );
    }

    sendForm = (e) => {
        //TODO sent agreement to correct url based on id
        service.oldPut('/agreements/1', this.state.formData)
            .then(resp => {
                console.log(resp)
            }).catch((error) => {
                console.error(error)
            });
        //Make this better
        //window.location.reload();
    }

    render() {
        //check if form data has changed
        var changes = (JSON.stringify(this.state.formData) === JSON.stringify(this.state.originalData));
        return (
            <div>
                <AgreementEditModal showModal={ this.state.editMode } closeModal={ this.toggleEditModal } formData={ this.state.formData } originalData={ this.state.originalData } updateFormData={ this.updateFormData } />
                <AgreementView agreementData={ this.state.formData } />
                <div className="ui segment">
                    <button className="ui primary button" onClick={ this.toggleEditModal }>Edit agreement</button>
                    <button className="ui primary button" type="submit" disabled={ changes } onClick={ this.sendForm }>Save Agreement</button>
                    <br />
                    <br />
                    <p><Link to="/">Go back to HomePage</Link></p>
                </div>
            </div>
        );
    }
}

export default AgreementPage;
