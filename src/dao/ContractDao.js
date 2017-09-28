const mockContracts = require('../mockdata/MockContracts');
const knex = require('../../connection');

export const getContractById = (id) => {
    return knex.select().from('contract').where('contractId', id)
        .then(contract => {
            return contract;
        });
}

export const saveNewContract  = (data) => {
    return knex('contract')
        .returning('contractId')
        .insert(data)
        .then((contractId) => {
            return {text: 'New contract saved to backend', contractId: contractId[0]};
            
          });
}

export const updateContract = (data) => {
    return knex('contract')
        .returning('contractId')
        .where('contractId', '=', data.contractId)
        .update(data)
        .then((contractId) => {
            return {text: 'New contract saved to backend', contractId: contractId[0]};
            
          });
}
