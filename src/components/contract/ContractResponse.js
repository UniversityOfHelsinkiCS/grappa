import React, { Component } from 'react';
import contractSave from "./ContractReducer";
import {CONTRACT_SAVE_SUCCESS, CONTRACT_SAVE_FAILURE,
        CONTRACT_NOT_SENT} from "./ContractActions";

class ContractResponse extends Component {

    constructor() {
        super();
        this.state = {
            currentState: ""
        };
    };

    changeState(event) {
        this.setState({currentState: event.text});
    }

    getCurrentState() {
      return this.state.currentState;
    }
}

const requestWasReturned = (event) => {
    const data = contractSave([] , event);
    this.changeState(data);
    console.log(this.getCurrentState());
  };


export default ContractResponse;
