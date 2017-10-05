const mockContracts = require('../mockdata/MockContracts');
const knex = require('../../connection');

export const getContractById = (id) => {
    return knex.select().from('contract').where('contractId', id)
        .then(contract => {
            return contract;
        });
}

export const saveNewContract = (data) => {
    return knex('contract')
        .returning('contractId')
        .insert(data)
        .then(contractId => contractId[0])
        .catch(err => err);
}

export const updateContract = (data) => {
    return knex('contract')
        .returning('contractId')
        .where('contractId', '=', data.contractId)
        .update(data)
        .then(contractId => contractId[0])
        .catch(err => err);
}
