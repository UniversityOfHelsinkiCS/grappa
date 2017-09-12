import React, { Component } from 'react';
import logo from './grappa.jpg';
import { Link } from 'react-router-dom';

class Contract extends Component {
    constructor(props) {
        super(props);
        this.handleContractChange = this.handleContractChange.bind(this);
        this.state = {
           compitionEta: "",
           supervision: "",
           misc: ""
        }
    }

    componentDidMount() {
        document.title = "Grappa: Contract page";
    }

    handleContractChange(event) {
      this.setState({ 
        [event.target.name]: event.target.value
      });  
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

          <form onSubmit={this.handlePost}>
          <textarea ref="input" placeholder="arvioitu gradun valmistumisen aikataulu" type="text" name="compitionEta" onChange={this.handleContractChange} /> <br />
          <br />
          <textarea ref="input" placeholder="ohjauksen määrän ja laadun yksityiskohdat" type="text" name="supervision" onChange={this.handleContractChange}/> <br />
          <br />
          <textarea ref="input" placeholder="muut sovittavat asiat" type="text" name="misc" onChange={this.handleContractChange} /> <br />
          <br />
          <input type="submit" value="send" />
        </form>


          </p>
          <br />
          <Link to="/"> Go back to HomePage :P </Link>
        </div>
      );
    }
  }
  
  export default Contract;