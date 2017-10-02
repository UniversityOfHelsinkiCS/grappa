import React, { Component } from 'react';
import contractSave from "./ContractReducer";

const requestWasReturned = (event) => {
    console.log("requestWasReturned " + event.text);
    const data = contractSave([], event);
    console.log(data);
  };


export default requestWasReturned;
