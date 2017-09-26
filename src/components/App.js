import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../media/grappa.jpg';
import { createStore, combineReducers, applyMiddleware } from 'redux'

const service = require("../util/apiConnection.js");

//left at: https://github.com/happypoulp/redux-tutorial/blob/master/04_get-state.js
//check this for good redux:ing: https://github.com/Hashnode/mern-starter
var userReducer = function (state = {}, action) {
  console.log('userReducer was called with state', state, 'and action', action)

  switch (action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: action.name
      }
    default:
      return state;
  }
}
var itemsReducer = function (state = [], action) {
  console.log('itemsReducer was called with state', state, 'and action', action)

  switch (action.type) {
    case 'ADD_ITEM':
      return [
        ...state,
        action.item
      ]
    default:
      return state;
  }
}

var reducer = combineReducers({
  user: userReducer,
  items: itemsReducer,
  speaker: function (state = {}, action) {
    console.log('speaker was called with state', state, 'and action', action)

    switch (action.type) {
      case 'SAY':
        return {
          ...state,
          message: action.message
        }
      default:
        return state;
    }
  }
})

var setNameActionCreator = function (name) {
  return {
    type: 'SET_NAME',
    name: name
  }
}

var sayActionCreator = function (message) {
  return function (dispatch) {
    setTimeout(function () {
      console.log(new Date(), 'Dispatch action now:')
      dispatch({
        type: 'SAY',
        message
      })
    }, 2000)
  }
}

var thunkMiddleware = function ({ dispatch, getState }) {
  // console.log('Enter thunkMiddleware');
  return function (next) {
    // console.log('Function "next" provided:', next);
    return function (action) {
      // console.log('Handling action:', action);
      return typeof action === 'function' ?
        action(dispatch, getState) :
        next(action)
    }
  }
}

console.log("\n", '### It starts here')
const appStore = createStore(reducer, applyMiddleware(thunkMiddleware));
console.log('appStore state after initialization:', appStore.getState())

appStore.dispatch(setNameActionCreator('bob'))
console.log('appStore state after action dispatch:', appStore.getState())

console.log(new Date());
appStore.dispatch(sayActionCreator('Hi'))
console.log(new Date());
console.log('appStore state after action SAY:', appStore.getState())

///////////////////////////////////////////////////////////////////////////////////

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
