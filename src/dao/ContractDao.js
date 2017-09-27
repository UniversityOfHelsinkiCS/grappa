const mockContracts = require('../mockdata/MockContracts');
const knex = require('../../connection');

export const getContractById = (id) => {
    return knex.select().from('contract').where('contractId', id)
        .then(contract => {
            return contract;
        });
}

export const saveNewContract = (data) => {
    // needs to be connected to database
    return {text: 'New contract saved to backend'};
}

export const updateContract = (data) => {
    // needs to be connected to database
    return {text: 'Contract updated to backend'};
}
