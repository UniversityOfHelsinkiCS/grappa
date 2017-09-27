const mockContracts = require('../mockdata/MockContracts');
const knex = require('../../connection');

export const getContractById = (id) => {
    return knex.select().from('contract').where('contractId', id)
        .then(contract => {
            return contract;
        });
}

export const saveNewContract  = async (data) => {
    console.log("saving new entry: ");
    console.log(data);


    
    
    //let forReturn = 
    await knex('contract')
        .returning('contractId')
        .insert(data)
        .then((contractId) => {
            return {text: 'New contract saved to backend', contractId: contractId};
            
          });
        //.then((contractId)=>{
        //    console.log("then called with id: " + contractId);
        //    return {text: 'New contract saved to backend', contractId: contractId}});
        //return forReturn;
}

export const updateContract = (data) => {
    console.log("updating existing entry: " + data);
    return knex('contract')
        .returning('contractId')
        .where('contractId', '=', data.contractId)
        .update(data)
        .return({text: 'Contract updated to backend'});
}
