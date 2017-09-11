import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from './grappa.jpg';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.handlePost = this.handlePost.bind(this);
    this.state = {
      username: "ennen kutsua"
    }
  }

  handlePost(e) {
    e.preventDefault()
    let value = this.refs.input.value;
    console.log("value", value)
    axios.get('/helloUser?username=' + value)
      .then(resp => {
      this.setState({
        username: resp.data.text
      })
    }).catch((error) => console.error(error));
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Enter your name below</h2>
        </div>
        <h2>{this.state.username}</h2>
        <p className="App-intro">
        <form onSubmit={this.handlePost}>
          <input ref="input" placeholder="enter your name here" type="text" name="username"/> <br />
          <br />
          <input type="submit" value="send" />
        </form>
        </p>
        <br />
        <Link to="/contract"> Go to contract page </Link>
      </div>
    );
  }
}

export default App;
