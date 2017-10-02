import React, { Component } from 'react';
import contractSave from "./ContractReducer";

const requestWasReturned = (event) => {
    const data = contractSave([], event);
    console.log(data);
  };


export default requestWasReturned;
