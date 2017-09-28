import test from 'ava';
import sinon from 'sinon';
import knex from 'knex';

const contractDao = require('../src/dao/ContractDao');
const mockContracts = require('../src/mockdata/MockContracts');

test.skip('ContractDao returns a contract by id correctly', t => {
    let id = '1';
    let contract = contractDao.getContractById(id);
    let mockContract;
    for(let i = 0; i < mockContracts.length; i++) {
        if (mockContracts[i].id.toString() === id) {
            mockContract = mockContracts[i];
        }
    }
    t.deepEqual(contract, mockContract);
});

test.only('saveNewContract calls knex correctly & returns correct json', t => {
    let knexStub = sinon.mock(knex);
    const testData = {};
    const knexAPI = {
        returning: function () {},
        insert: function () {},
        then: function () {},
    };
    let knexMock = {};

    t.truthy(knexStub.calledWithNes());
    
    /*
    knex('contract')
    .returning('contractId')
    .insert(data)
    .then((contractId) => {
        return {text: 'New contract saved to backend', contractId: contractId[0]};
        
      });
      */

});
