import React, { Component } from 'react';

export default class SupervisingInfoForm extends Component {

    constructor() {
        super();
        this.state = {
            chosenStudyfield: -1,
            selectedSupervisors: { thesisSupervisorMain: -1, thesisSupervisorSecond: -1 }
        }
    }

    field = (label, formName) => {
        return (
            <div>
                <br />
                <b>{label}</b>
                <div className="ui fluid input">
                    <input type="text" name={formName} onChange={this.props.handleChange} />
                    {(Object.keys(this.props.requiredFields).includes(formName) && !this.props.requiredFields[formName]) ?
                    (<div className="ui left pointing red basic label">
                      Täytä ohjaajan tiedot
                    </div>) : ''}
                </div>
            </div>
        )
    }

    sendDropDownChange = (event) => {
        if (event.target.value) {
            let list = Object.assign({}, this.state.selectedSupervisors);
            list[event.target.name] = event.target.value;
            this.setState({ selectedSupervisors: list });
            this.props.handleChange(event);
        }
    }

    studyfieldChange = (event) => {
        if (event.target.value) {
            this.setState(
                {
                    chosenStudyfield: event.target.value,
                    selectedSupervisors: { thesisSupervisorMain: -1, thesisSupervisorSecond: -1 }
                 }
            );
            this.props.resetSupervisors();
            this.props.handleChange(event);
        }
    }

    studyfieldSelecter = (list) => {
        return (
            <div>
                <b>Valitse ensin gradun aine</b>
                <div>
                    <select className="ui dropdown"  name= "studyfieldId" onChange={this.studyfieldChange}>
                        <option value={-1}>Valitse ensin gradun tieteenala</option>
                        {list.map((obj, index) => {
                            return <option key={index} value={obj.id}>{obj.text}</option>;
                        })}
                    </select>
                    {(Object.keys(this.props.requiredFields).includes('studyfieldId') && !this.props.requiredFields['studyfieldId']) ?
                    (<div className="ui left pointing red basic label">
                      Valitse oppiaine
                    </div>) : ''}
                </div>
            </div>
        );
    }

    supervisorSelecter = (label, placeholder, formName, list) => {
        return (
            <div>
                <b>{label}</b>
                <div>
                    <select className="ui dropdown" value={this.state.selectedSupervisors[formName]} disabled={list[0] === undefined} onChange={this.sendDropDownChange} name={formName}>
                        <option value={-1}>{placeholder}</option>
                        {list.map((obj, index) => {
                            return <option key={index} value={obj.id}>{obj.text}</option>;
                        })}
                    </select>
                    {(Object.keys(this.props.requiredFields).includes(formName)) && !this.props.requiredFields[formName] ?
                    (<div className="ui left pointing red basic label">
                      Valitse ohjaaja
                    </div>) : ''}
                </div>
            </div>
        );
    }

    getSupervisorData = () => {
        if (this.state.chosenStudyfield === -1)
            return [];
        return this.props.supervisors.filter((supervisor) => supervisor.studyfieldId == this.state.chosenStudyfield).map((supervisor) => {
            return { id: supervisor.personRoleId, text: supervisor.title + ' ' + supervisor.firstname + ' ' + supervisor.lastname + ' - ' + supervisor.email }
        });
    }

    render() {
        let supervisors = this.getSupervisorData();
        return (
            <div>
                <h1>Ohjausvastuut</h1>
                {this.studyfieldSelecter(this.props.studyfields.map((field) => {
                    return { id: field.studyfieldId, text: field.name }
                }))}
                <br />
                {this.supervisorSelecter('Vastuuohjaaja', 'Valitse ohjaaja', 'thesisSupervisorMain',
                supervisors.filter((s) => s.id != this.state.selectedSupervisors.thesisSupervisorSecond ))}
                <br />
                {this.supervisorSelecter('Toinen ohjaaja', 'Valitse ohjaaja', 'thesisSupervisorSecond',
                supervisors.filter((s) => s.id != this.state.selectedSupervisors.thesisSupervisorMain ))}
                {this.field('Muu ohjaaja', 'thesisSupervisorOther')}
            </div>
        )
    }
}
