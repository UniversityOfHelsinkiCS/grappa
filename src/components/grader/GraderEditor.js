import React, { Component } from "react";

export default class GraderEditor extends Component {
    constructor() {
        super();
        this.state = {
            newGrader: {
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

    selectGrader = (event) => {
        const updateSupervisor = this.props.graders.find(grader => grader.personId.toString() === event.target.value);
        if (!updateSupervisor) return;
        this.setState({ updateSupervisor });
    }

    saveNewGrader = () => {
        const grader = this.state.newGrader;
        this.props.saveGrader(grader);
    }

    updateSupervisor = () => {
        const grader = this.state.updateSupervisor;
        console.log("editorissa grader on", grader);
        this.props.updateSupervisor(grader);
        this.setState(
            {
                updateSupervisor: {
                    id: grader.id
                }
            }
        )
    }

    //not functioning yet in Grappa 2
    deleteGrader = () => {
        const grader = this.state.updateSupervisor;
        console.log("deleting");
        console.log(grader);
        this.props.deleteGrader(grader);
    }

    renderNameField(name, whichOne) {
        let nameLowCase = name.toLowerCase();
        nameLowCase = nameLowCase.replace(/\s/g, '');
        return (
            <div id={name + whichOne} className="ui field">
                <label>{name}</label>
                <input
                    type="text"
                    value={this.state.newGrader.nameLowCase}
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
                <p>Add new grader</p>
                <div className="five fields">
                    {this.renderTitleList("newGrader")}
                    {this.renderNameField("First name", "newGrader")}
                    {this.renderNameField("Last name", "newGrader")}
                    {this.renderStudyfieldList("newGrader")}
                    <div className="ui field">
                        <label>&nbsp;</label>
                        <button id="add" className="ui green button" onClick={this.saveNewGrader}>
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
                <p>Updating not working on backend yet, sorry</p>
                <div className="six fields">
                    <div className="field">
                        <label>Who</label>
                        <select className="ui fluid search dropdown" onChange={this.selectGrader}>
                            <option value="">Select grader</option>
                            {this.props.graders.map((grader, index) =>
                                <option key={index} className="item" value={grader.personId}>
                                    {grader.title} {grader.firstname} {grader.lastname} Studyfield: {grader.studyfieldId}
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
                        <button id="update" className="ui red button" onClick={this.deleteGrader}>
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