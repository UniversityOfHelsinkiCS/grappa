import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from './grappa.jpg';
import './App.css';
import axios from 'axios';

var getAxios = () => {
  if (process.env.API_URL) {
    console.log("not undefined");
    return axios.create({
      baseURL: process.env.API_URL
    });
  } else {
    return axios;
  }
}

const service = getAxios();

var getAxios = () => {
  if (process.env.API_URL) {
    console.log("not undefined");
    return axios.create({
      baseURL: process.env.API_URL
    });
  } else {
    return axios;
  }
}

const service = getAxios();

class App extends Component {
  constructor(props) {
    super(props);
    this.handlePost = this.handlePost.bind(this);
    this.state = {
      username: "ennen kutsua"
    }
  }

  componentDidMount() {
    document.title = "Grappa: Main page";
  }

  handlePost(e) {
    e.preventDefault()
    let value = this.refs.input.value;
    console.log("API_URL", process.env.API_URL);
    service.get('/helloUser?username=' + value)
      .then(resp => {
        this.setState({
          username: resp.data.text
        })
      }).catch((error) => console.error(error));
  }

  render() {
    return (
      <div className="App">

        <div className="ui inverted segment">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Enter your name below</h2>
        </div>

        <div className="ui segment">
          <h2>{this.state.username}</h2>
          
          <form onSubmit={this.handlePost}>
            <div className="ui action input">
              <input ref="input" placeholder="enter your name here" type="text" name="username" />
              <button className="ui button" type="submit">Send</button>
            </div>
          </form>
        </div>

        <br />
        <Link to="/contract"> Go to contract page </Link>

      </div>


    );
  }
}

export default App;
