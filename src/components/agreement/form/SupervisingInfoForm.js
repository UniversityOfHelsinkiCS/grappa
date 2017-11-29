import React, { Component } from 'react';

export default class SupervisingInfoForm extends Component {

    constructor() {
        super();
        this.state = {
            chosenStudyfield: undefined,
        }
    }

    field = (label, formName) => {
        return (
            <div>
                <br />
                <b>{label}</b>
                <div className="ui fluid input">
                    <input type="text" name={formName} onChange={this.props.handleChange} />
                </div>
            </div>
        )
    }

    sendDropDownChange = (event) => {
        if (event.target.value) {
            this.props.handleChange(event)
        }
    }

    dropDown = (label, formName, supervisorList) => {
        if (!supervisorList) return;
        return (
            <div>
                <b>{label}</b>
                <div>
                    <select className="ui dropdown" onChange={this.sendDropDownChange} name={formName} >
                        <option value="" >Select a supervisor</option>
                        {supervisorList.map((supervisor, index) => {
                            return <option key={index} value={supervisor}>{`${supervisor.firstname} ${supervisor.lastname} ${supervisor.email}`}</option>;
                        })}
                    </select>
                </div>
            </div>
        );
    }

    render() {
        if (this.state.chosenStudyfield) {
            const supervisorsByStudyfield = this.props.supervisors.filter(supervisor => supervisor.studyfieldId == this.state.chosenStudyfield);
        } else {
            const supervisorsByStudyfield = this.props.supervisors;
        }
        return (
            <div>
                <h1>Ohjausvastuut</h1>
                {this.dropDown("Vastuuohjaaja", "thesisSupervisorMain", this.props.supervisors)}
                {this.dropDown("Toinen ohjaaja", "thesisSupervisorSecond", this.props.supervisors)}
                {this.field("Muu ohjaaja", "thesisSupervisorOther")}
            </div>
        )
    }
}