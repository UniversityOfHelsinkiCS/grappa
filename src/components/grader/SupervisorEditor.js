import React, { Component } from "react";

export default class SupervisorEditor extends Component {
    constructor() {
        super();
        this.state = {
            newSupervisor: {
                firstname: "",
                lastname: "",
                title: "",
                studyfieldId: ""
            },
            updateSupervisor: {
                id: undefined,
                firstname: "",
                lastname: "",
                title: "",
                studyfieldId: ""
            }
        };
    }

    getTitles = () => {
        return ["Prof.", "Assistant Prof.", "Adjunct Prof.", "Dr.", "Other"];
    }

    getStudyfields = () => {
        return [1, 2, 3, "n"]; //TODO get these from back and get their names, too
    }

    handleChange = (field, formname) => (event) => {
        const value = event.target.value;
        this.setState({ [formname]: { ...this.state[formname], [field]: value } })
    }

    selectSupervisor = (event) => {
        const updateSupervisor = this.props.supervisors.find(supervisor => supervisor.personId.toString() === event.target.value);
        if (!updateSupervisor) return;
        this.setState({ updateSupervisor });
    }

    saveNewSupervisor = () => {
        const supervisor = this.state.newSupervisor;
        this.props.saveSupervisor(supervisor);
    }

    updateSupervisor = () => {
        const supervisor = this.state.updateSupervisor;
        this.props.updateSupervisor(supervisor);
        this.setState(
            {
                updateSupervisor: {
                    id: supervisor.id
                }
            }
        )
    }

    //not functioning yet in Grappa 2
    deleteSupervisor = () => {
        const supervisor = this.state.updateSupervisor;
        console.log("deleting");
        console.log(supervisor);
        this.props.deleteSupervisor(supervisor);
    }

    renderNameField(name, whichOne) {
        let nameLowCase = name.toLowerCase();
        nameLowCase = nameLowCase.replace(/\s/g, '');
        return (
            <div id={name + whichOne} className="ui field">
                <label>{name}</label>
                <input
                    type="text"
                    value={this.state.newSupervisor.nameLowCase}
                    placeholder={name}
                    onChange={this.handleChange(nameLowCase, whichOne)}
                />
            </div>)
    }

    renderTitleList(whichOne) {
        return (
            <div id={"titles" + whichOne} className="ui field">
                <label>Title</label>
                <select
                    className="ui fluid search dropdown"
                    value={this.state[whichOne].title}
                    onChange={this.handleChange("title", whichOne)}
                >
                    <option value="">Select title</option>
                    {this.getTitles().map((title, index) => <option key={index} value={title}>{title}</option>)}
                </select>
            </div>
        )
    }

    renderStudyfieldList(whichOne) {
        return (
            <div id={"studyfields" + whichOne} className="ui field">
                <label>Studyfield</label>
                <select
                    className="ui fluid search dropdown"
                    value={this.state[whichOne].studyfieldId}
                    onChange={this.handleChange("studyfieldId", whichOne)}
                >
                    <option value="">Select studyfield</option>
                    {this.getStudyfields().map((studyfield, index) => <option key={index} value={studyfield}>{studyfield}</option>)}
                </select>
            </div>
        )
    }

    renderCreate() {
        return (
            <div>
                <p>Add new supervisor</p>
                <div className="five fields">
                    {this.renderTitleList("newSupervisor")}
                    {this.renderNameField("First name", "newSupervisor")}
                    {this.renderNameField("Last name", "newSupervisor")}
                    {this.renderStudyfieldList("newSupervisor")}
                    <div className="ui field">
                        <label>&nbsp;</label>
                        <button id="add" className="ui green button" onClick={this.saveNewSupervisor}>
                            Create Supervisor
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    renderUpdate() {
        return (
            <div>
                <p>Update information related to a supervisor</p>
                <div className="six fields">
                    <div className="field">
                        <label>Who</label>
                        <select className="ui fluid search dropdown" onChange={this.selectSupervisor}>
                            <option value="">Select supervisor</option>
                            {this.props.supervisors.map((supervisor, index) =>
                                <option key={index} className="item" value={supervisor.personId}>
                                    {supervisor.title} {supervisor.firstname} {supervisor.lastname} Studyfield: {supervisor.studyfieldId}
                                </option>
                            )}
                        </select>
                    </div>
                    {this.renderTitleList("updateSupervisor")}
                    {this.renderNameField("First name", "updateSupervisor")}
                    {this.renderNameField("Last name", "updateSupervisor")}
                    {this.renderStudyfieldList("updateSupervisor")}
                    <div className="field">
                        <label>&nbsp;</label>
                        <button id="update" className="ui blue button" onClick={this.updateSupervisor}>
                            Update Supervisor
                        </button>
                        <label>&nbsp;</label>
                        <button id="update" className="ui red button disabled" onClick={this.deleteSupervisor}>
                            Delete Supervisor
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="ui form">
                {this.renderCreate()}
                {this.renderUpdate()}
            </div>
        );
    }
}