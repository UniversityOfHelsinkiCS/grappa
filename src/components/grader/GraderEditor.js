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
            updateGrader: {
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
        return [1, 2, 3, "n"];
    }

    handleChange = (field, formname) => (event) => {
        const value = event.target.value;
        this.setState({ [formname]: { ...this.state[formname], [field]: value } })
    }

    selectGrader = (event) => {
        const updateGrader = this.props.graders.find(grader => grader.personId.toString() === event.target.value);
        if (!updateGrader) return;
        this.setState({ updateGrader });
    }

    saveNewGrader = () => {
        const grader = this.state.newGrader;
        this.props.saveGrader(grader);
    }

    updateGrader = () => {
        const grader = this.state.updateGrader;
        this.props.updateGrader(grader);
    }

    //not functioning yet in Grappa 2, to be added later
    deleteGrader = () => {
        //const grader = this.state.updateGrader;
        //console.log("deleting");
        //console.log(grader);
        //this.props.deleteGrader(grader);
    }

    renderNameField(name) {
        let nameLowCase = name.toLowerCase();
        nameLowCase = nameLowCase.replace(/\s/g, '');
        return (
            <div className="ui field">
                <label>{name}</label>
                <input
                    type="text"
                    value={this.state.newGrader.nameLowCase}
                    placeholder={name}
                    onChange={this.handleChange(nameLowCase, "newGrader")}
                />
            </div>)
    }

    renderTitleList() {
        return (
            <div className="ui field">
                <label>Title</label>
                <select
                    className="ui fluid search dropdown"
                    value={this.state.newGrader.title}
                    onChange={this.handleChange("title", "newGrader")}
                >
                    <option value="">Select title</option>
                    {this.getTitles().map((title, index) => <option key={index} value={title}>{title}</option>)}
                </select>
            </div>
        )
    }

    renderStudyfieldList() {
        return (
            <div className="ui field">
                <label>Studyfield</label>
                <select
                    className="ui fluid search dropdown"
                    value={this.state.newGrader.studyfieldId}
                    onChange={this.handleChange("studyfieldId", "newGrader")}
                >
                    <option value="">Select studyfield</option>
                    {this.getStudyfields().map((studyfield, index) => <option key={index} value={studyfield}>{studyfield}</option>)}
                </select>
            </div>
        )
    }

    renderCreate() {
        return (
            <div className="five fields">
                {this.renderTitleList()}
                {this.renderNameField("First name")}
                {this.renderNameField("Last name")}
                {this.renderStudyfieldList()}
                <div className="ui field">
                    <label>&nbsp;</label>

                    <button id="add" className="ui green button" onClick={this.saveNewGrader}>
                        Create Supervisor
                    </button>
                </div>
            </div>
        );
    }

    renderUpdate() {
        return (
            <div className="five fields">
                <div className="field">
                    <label>Who</label>
                    <select className="ui fluid search dropdown" onChange={this.selectGrader}>
                        <option value="">Select grader</option>
                        {this.props.graders.map((grader, index) =>
                            <option key={index} className="item" value={grader.personId}>
                                {grader.title}&nbsp;&nbsp;{grader.firstname}&nbsp;&nbsp;{grader.lastname}&nbsp;&nbsp;Studyfield:&nbsp;{grader.studyfieldId}
                            </option>
                        )}
                    </select>
                </div>
                {this.renderTitleList()}
                {this.renderNameField("First name")}
                {this.renderNameField("Last name")}
                {this.renderStudyfieldList()}
                <div className="field">
                    <label>&nbsp;</label>
                    <button id="update" className="ui blue button disabled" onClick={this.updateGrader}>
                        Update Supervisor
                    </button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="ui form">
                {this.renderCreate()}
                {this.renderUpdate()
                }
            </div>
        );
    }
}