import React, { Component } from 'react';
import logo from './grappa.jpg';
import { Link } from 'react-router-dom';

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

        
      }
    }
  }

  componentDidMount() {
    document.title = "Grappa: Contract page";
  }

  handleContractChange = (event) => {
    console.log("handler called " + event.target.name + " " + event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  sendForm = (event) => {
    console.log(event);
    console.log("Nappia painettiin.");
  }

  createRightLabeledField = (label, placeholder, name) => {
    return (<div className="field ui right labeled input required">
      <input type="text" placeholder={placeholder} value={this.state[name]} onChange={this.handleContractChange} />
      <div name={name} className="ui label" >{label}</div>
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
          <h3>Sopimusta voidaan muuttaa osapuolten yhteisestä päätöksestä.</h3>

          <div className="ui form">
            <form onSubmit={this.handlePost}>
              <h1 className="ui dividing header">Opinnäytetyön tekijä</h1>
              <div className="two fields">
                {this.createRightLabeledField("Nimi","Etu- ja Sukunimi")}
                {this.createRightLabeledField("Opiskelijanumero","XXXXXXX")}
                
              </div>
              <div className="two fields">
                {this.createRightLabeledField("Lähiosoite","Peräpolku 2 C 45, Nuppulinna")}
                {this.createRightLabeledField("Puhelinnumero","000 000 00 00")}
              </div>
              <div className="two fields">
                {this.createRightLabeledField("Sähköpostiosoite","nimi@domain.com")}
                {this.createRightLabeledField("Pääaine","(jos muu kuin TKTL)")}
              </div>
 
              <h1 className="ui dividing header">Opinnäytetyö</h1>
              <div className="fields">
                <div className="field ui labeled input required">
                <label>Opinnäytetyön otsikko (työnimi) tekokielellä</label>
                  <textarea rows="2" type="text" placeholder="Etu- ja Sukunimi" />
                </div>
              </div>



              <div className="field">
                <label>Gradun valmistumisen ajankohta</label>
                <textarea ref="input" rows="2" placeholder="arvioitu gradun valmistumisen aikataulu" type="text" name="completionEta" value={this.state.completionEta} onChange={this.handleContractChange} />
              </div>
              <div className="field">
                <label>Ohjaus</label>
                <textarea ref="input" rows="2" placeholder="ohjauksen määrän ja laadun yksityiskohdat" type="text" name="supervision" value={this.state.supervision} onChange={this.handleContractChange} /> <br />
              </div>
              <div className="field">
                <label>Muu</label>
                <textarea ref="input" rows="2" placeholder="muut sovittavat asiat" type="text" name="misc" value={this.state.misc} onChange={this.handleContractChange} /> <br />
              </div>
              <button className="ui primary button" type="submit" onClick={this.sendForm}>Save</button>
            </form>
          </div>
          <br />
          <Link to="/"> Go back to HomePage :P </Link>
        </div>
      </div>



      /*
            <div className="Contract">
              <div className="Contract-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>Thesis Contract</h2>
              </div>
              <h2>Gradusopimus tehdään gradunohjauksen alkaessa</h2>
              <p className="Contract-intro">
                Sopimusta voidaan muuttaa osapuolten yhteisestä päätöksestä.
                </p>
              <form onSubmit={this.handlePost}>
                <textarea ref="input" placeholder="arvioitu gradun valmistumisen aikataulu" type="text" name="completionEta" value={this.state.completionEta} onChange={this.handleContractChange} /> <br />
                <br />
                <textarea ref="input" placeholder="ohjauksen määrän ja laadun yksityiskohdat" type="text" name="supervision" value={this.state.supervision} onChange={this.handleContractChange} /> <br />
                <br />
                <textarea ref="input" placeholder="muut sovittavat asiat" type="text" name="misc" value={this.state.misc} onChange={this.handleContractChange} /> <br />
                <br />
                <input type="submit" value="send" onClick={this.sendForm} />
              </form>
      
      
      
              <br />
              <Link to="/"> Go back to HomePage :P </Link>
            </div> */
    );
  }
}

export default Contract;
