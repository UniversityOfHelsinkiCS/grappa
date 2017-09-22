const mockContracts = require('../mockdata/MockContracts');

export const getContract = () => {
    //return the first contract in list
    return mockContracts[0];
}

export const getContractById = (id) => {
    let contract;
    for(let i = 0; i < mockContracts.length; i++) {
        if (mockContracts[i].id.toString() === id) {
            return mockContracts[i];
        }
    }
    return null;
}

export const saveContract = (data) => {
    console.log(data);
    return {text: 'Contract saved to backend'};
}
