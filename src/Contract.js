import React, { Component } from 'react';
import logo from './grappa.jpg';
import { Link } from 'react-router-dom';

class Contract extends Component {

    render() {
      return (
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>ContractPage</h2>
          </div>
          <h2>Welxome</h2>
          <p className="App-intro">
          Some random text
          </p>
          <br />
          <Link to="/"> Go back to HomePage :P </Link>
        </div>
      );
    }
  }
  
  export default Contract;