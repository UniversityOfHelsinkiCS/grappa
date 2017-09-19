import React, { Component } from 'react';
import logo from './grappa.jpg';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Contract extends Component {
  constructor() {
    super();
    this.state = {
      completionEta: "",
      supervision: "",
      misc: "",
      form: {
        studentName: "",
        studentNumber: "",
        studentAddress: "",
        studentPhone: "",
        studentEmail: "",
        studentMajor: "",

        thesisTitle: "",
        thesisStartDate: "",
        thesisCompletionEta: "",
        thesisPerformancePlace: "",

        thesisSupervisorMain: "",
        thesisSupervisorSecond: "",
        thesisSupervisorOther: "",

        thesisWorkStudentTime: "",
        thesisWorkSupervisorTime: "",
        thesisWorkIntermediateGoal: "",
        thesisWorkMeetingAgreement: "",
        thesisWorkOther: "",

        studentGradeGoal: "",
      }
    }
  }

  componentDidMount() {
    document.title = "Grappa: Contract page";
  }

  handleContractChange = (event) => {
    //console.log("handler called " + event.target.name + " " + event.target.value);

    let oldState = this.state.form;
    let newState = this.state.form;
    newState[event.target.name] = event.target.value;

    this.setState({ oldState: newState })
  }

  sendForm = (event) => {
    if(event !== undefined)
      event.preventDefault();
    axios.post('/contract', this.state.form /*{
      completionEta: this.state.completionEta,
      supervision: this.state.supervision,
      misc: this.state.misc
      
    }*/)
      .then((resp) => {
        console.log(resp)
      })
      .catch((error) => { console.error(error) });
    console.log("Nappia painettiin.");
  }

  defineFieldClasses = (labelType, fieldType, required) => {
    return ("field ui small " + labelType + " " + fieldType + " " + (required === true ? 'required' : ''));
  }

  createField = (fieldData) => {
    let forReturn = [];
    if (fieldData.inputType === "input") {

      forReturn = [<div className="ui label" >{fieldData.label}</div>,
                   <input name={fieldData.name} type="text" placeholder={fieldData.placeholder} value={this.state.form[fieldData.name]} onChange={this.handleContractChange} />];

      if (fieldData.labelType.includes("right")) {
        forReturn.reverse();
      }
    } else if (fieldData.inputType === "textarea") {
      forReturn = [<label>{fieldData.label}</label>,
                   <textarea name={fieldData.name} rows={fieldData.rows} placeholder={fieldData.placeholder} value={this.state.form[fieldData.name]} onChange={this.handleContractChange}></textarea>];
    }

    return (
      <div className={this.defineFieldClasses(fieldData.labelType, fieldData.inputType, fieldData.required)}>
        {forReturn}
      </div>
    );
  }

  createFormSectionLine = (sectionLineData) => {
    if (sectionLineData.fields.length === 1) {
      return (this.createField(sectionLineData.fields[0]));
    } else if (sectionLineData.fields.length === 2) {
      return (
        <div className="two fields">
          {this.createField(sectionLineData.fields[0])}
          {this.createField(sectionLineData.fields[1])}
        </div>
      );
    }
  }

  createFormSection = (sectionData) => {
    let sectionLineList = sectionData.sectionLines.map(
      (sectionLineData) => {
        return this.createFormSectionLine(sectionLineData);
      })

    return (
      <div><br />
        <h3 className="ui dividing header">{sectionData.header}</h3>
        {sectionLineList}
      </div>
    );
  }

  createForm = () => {
    const formFieldProperties = {
      sections:
      [{
        header: "Opinnäytetyön tekijä",
        sectionLines: [
          {
            fields: [
              { inputType: "input", name: "studentName", label: "Nimi", labelType: "right labeled", required: true, placeholder: "Etu- ja Sukunimi" },
              { inputType: "input", name: "studentNumber", label: "Opiskelijanumero", labelType: "right labeled", required: true, placeholder: "XXXXXXX" },
            ]
          },
          {
            fields: [
              { inputType: "input", name: "studentAddress", label: "Lähiosoite", labelType: "right labeled", required: true, placeholder: "Peräpolku 2 C 45, Nuppulinna" },
              { inputType: "input", name: "studentPhone", label: "Puhelinnumero", labelType: "right labeled", required: true, placeholder: "000 000 00 00" },
            ]
          },
          {
            fields: [
              { inputType: "input", name: "studentEmail", label: "Sähköpostiosoite", labelType: "right labeled", required: true, placeholder: "nimi@domain.com" },
              { inputType: "input", name: "studentMajor", label: "Pääaine", labelType: "right labeled", required: true, placeholder: "(jos muu kuin TKTL)" },
            ]
          }
        ]
      },
      {
        header: "Opinnäytetyö",
        sectionLines: [
          {
            fields: [
              { inputType: "textarea", rows: 2, name: "thesisTitle", label: "Opinnäytetyön otsikko (työnimi) tekokielellä", labelType: "fluid", required: true, placeholder: "Opinnäytetyön otsikko (työnimi) tekokielellä" },
            ]
          },
          {
            fields: [
              { inputType: "input", name: "thesisStartDate", label: "Aloitusajankohta", labelType: "labeled", required: true, placeholder: "" },
              { inputType: "input", name: "thesisCompletionEta", label: "Arvioitu valmistumisajankohta", labelType: "labeled", required: true, placeholder: "" },
            ]
          },
          {
            fields: [
              { inputType: "textarea", rows: 2, name: "thesisPerformancePlace", label: "Suorituspaikka", labelType: "fluid labeled", required: true, placeholder: "(projekti, työnantaja, tms.) ja yhteystiedot" },
            ]
          },
        ]
      },
      {
        header: "Ohjausvastuut",
        sectionLines: [
          {
            fields: [
              { inputType: "input", name: "thesisSupervisorMain", label: "Vastuuohjaaja", labelType: "labeled fluid", required: true, placeholder: "(nimi, oppiarvo ja/tai tehtävänimike, organisaatio, yhteystiedot)" },
            ]
          },
          {
            fields: [
              { inputType: "input", name: "thesisSupervisorSecond", label: "2. ohjaaja", labelType: "labeled fluid", required: true, placeholder: "(nimi, oppiarvo ja/tai tehtävänimike, organisaatio, yhteystiedot)" },
            ]
          },
          {
            fields: [
              { inputType: "input", name: "thesisSupervisorOther", label: "Muu ohjaaja", labelType: "labeled fluid", required: true, placeholder: "(nimi, oppiarvo ja/tai tehtävänimike, organisaatio, yhteystiedot)" },
            ]
          },
        ]
      },
      {
        header: "Työskentelyn tavoitteet ja ajankäyttö",
        sectionLines: [
          {
            fields: [
              { inputType: "textarea", rows: 1, name: "thesisWorkStudentTime", label: "Opiskelijan arvioima opinnäytetyöhön käytettävä työaika", labelType: "fluid", required: true, placeholder: "(esim. tuntia / vko)" },
            ]
          },
          {
            fields: [
              { inputType: "textarea", rows: 2, name: "thesisWorkSupervisorTime", label: "Ohjaajien ohjaukseen varaama aika (työn eri vaiheissa)", labelType: "fluid", required: true, placeholder: "" },
            ]
          },
          {
            fields: [
              { inputType: "textarea", rows: 2, name: "thesisWorkIntermediateGoal", label: "Välitavoitteet (deadlinet työn eri vaiheille)", labelType: "fluid", required: true, placeholder: "" },
            ]
          },
          {
            fields: [
              { inputType: "textarea", rows: 2, name: "thesisWorkMeetingAgreement", label: "Sopimus tapaamistiheydestä, yhteydenpitotavoista ja keskusteluun käytettävissä olevasta ajasta", labelType: "fluid", required: true, placeholder: "" },
            ]
          },
          {
            fields: [
              { inputType: "textarea", rows: 2, name: "thesisWorkOther", label: "Muuta", labelType: "fluid", required: false, placeholder: "(esim. opiskelijan odotukset ohjaajalle / ohjaajan odotukset opiskelijalle" },
            ]
          },
        ]
      },
      {
        header: "Tavoitearvosana",
        sectionLines: [
          {
            fields: [
              { inputType: "textarea", rows: 1, name: "studentGradeGoal", label: "Opiskelija on tutustunut laitoksen opinnäytetyön arviointimatriisiin ja määrittää tavoitearvosanakseen:", labelType: "right labeled", required: true, placeholder: "Etu- ja Sukunimi" },
            ]
          },
        ]
      }]
    }

    let sectionList = formFieldProperties.sections.map(
      (sectionData) => {
        return this.createFormSection(sectionData);
      });

    return (
      <div className="ui form">
        <form onSubmit={this.handlePost}>
          {sectionList}
          <br />
          <button className="ui primary button" type="submit" onClick={this.sendForm}>Save</button>
        </form>
      </div>);
  }

  render() {
    return (
      <div className="App">

        <div className="ui inverted segment">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Thesis Contract</h2>
        </div>

        <div className="ui segment">
          <h2>Gradusopimus tehdään gradunohjauksen alkaessa</h2>
          <p>Sopimusta voidaan muuttaa osapuolten yhteisestä päätöksestä.</p>
          <br />

          {this.createForm()}


          <br />
          <Link to="/"> Go back to HomePage :P </Link>
        </div>
      </div>

    );
  }
}

export default Contract;
