import React, { Component } from "react";
import AgreementEditModalField from './AgreementEditModalField';
import { connect } from "react-redux";
import { getPermissions } from "../../util/rolePermissions";

export class AgreementEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editedFormData: {},
            editableFields: [],
            ignoredFields: ['agreementId', 'created_at', 'updated_at'],
            textFields: ['thesisWorkStudentTime', 'thesisWorkSupervisorTime', 'thesisWorkIntermediateGoal', 'thesisWorkMeetingAgreement', 'thesisWorkOther']
        }
    }

    componentWillReceiveProps(props) {
        var original = Object.assign({}, props.formData); //can't use pointer here
        if (props.role) {
            this.setState(
                {
                    editedFormData: original,
                    editableFields: getPermissions(props.role, 'agreement', 'edit')
                }
            );
        } else {
          this.setState(
              {
                  editedFormData: original,
                  editableFields: ['studentAddress', 'studentEmail', 'studentGradeGoal', 'studentAddress', 'studentName', 'studentPhone', 'thesisCompletionEta', 'thesisSupervisorSecond', 'thesisSupervisorOther', 'thesisTitle']
              }
          );
        }
    }

    onFieldChange = (fieldName, value) => {
        var newEditedFormData = this.state.editedFormData;
        newEditedFormData[fieldName] = value;
        this.setState(
            {
                editedFormData: newEditedFormData
            }
        );
    }

    generateFormFields = () => {
        var elements = this.parseAgreementData(this.state.editedFormData).map((element) =>
            this.createFormField(element)
        );
        return (
            <div>
                <form>
                    <div className="ui form">{ elements }</div>
                </form>
            </div>
        );
    }

    parseAgreementData = (data) => {
        var parsedList = [];
        for (var p in data) {
            var originalData = this.props.originalData;
            if(data.hasOwnProperty(p) && (this.state.ignoredFields.indexOf(p) === -1) && (this.state.editableFields.indexOf(p) > -1)) {
                parsedList.push({
                    fieldName: p,
                    content: data[p],
                    originalContent: originalData[p],
                    textField: (this.state.textFields.indexOf(p) > -1)
                });
            }
        }
        return parsedList;
    }

    createFormField = (c) => {
        return (
            <AgreementEditModalField key={ c.fieldName } fieldName={ c.fieldName } content={ c.content } originalContent={ c.originalContent } textField={ c.textField } onChange={ this.onFieldChange }/>
        );
    }

    handleFormSave = () => {
        this.props.updateFormData(this.state.editedFormData);
        this.props.closeModal();
    }

    render() {
        if (!this.props.showModal) {
            return (<div />);
        }
        return (
            <div>
                <div className="ui dimmer modals page transition visible active" onClick={ this.props.closeModal } />
                <div className="ui active modal" style={{ top: 45, border: '2px solid black', borderRadius: '7px' }}>
                    <i className="close icon" onClick={ this.props.closeModal }></i>
                    <div className="header">
                        Edit agreement
                    </div>
                    <div className="scrolling content">
                        <div className="description">
                            { this.generateFormFields() }
                        </div>
                    </div>
                    <br />
                    <button className="ui fluid positive button" onClick={ this.handleFormSave }>
                        Save local changes
                    </button>
                </div>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    if (!state.user[0])
        return { role: undefined };
    return { role: state.user[state.user.length - 1].role.id };
}

export default connect(mapStateToProps)(AgreementEditModal);
