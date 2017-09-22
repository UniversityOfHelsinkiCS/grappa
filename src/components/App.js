import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../media/grappa.jpg';
import { createStore } from 'redux'

const service =  require("../util/apiConnection.js");

//left at: https://github.com/happypoulp/redux-tutorial/blob/master/04_get-state.js
//check this for good redux:ing: https://github.com/Hashnode/mern-starter
const reducer = function (...args) {
  console.log('Reducer was called with args', args)
}
const appStore = createStore(reducer);

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
        <p><Link to="/contract"> Go to contract page </Link></p>
        <p><Link to="/theses"> Go to thesis list page </Link></p>
      </div>


    );
  }
}

export default App;
