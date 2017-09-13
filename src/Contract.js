import React, { Component } from 'react';
import logo from './grappa.jpg';
import { Link } from 'react-router-dom';

class Contract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completionEta: "",
      supervision: "",
      misc: ""
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

  render() {
    return (
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
      </div>
    );
  }
}

export default Contract;
