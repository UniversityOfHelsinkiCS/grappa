const mockContracts = require('../mockdata/MockContracts');
const knex = require('../../connection');

export const getContractById = (id) => {
    return knex.select().from('contract').where('contractId', id)
        .then(contract => {
            return contract;
        });
}

export const saveContract = (data) => {
    // needs to be connected to database
    return {text: 'Contract saved to backend'};
}
