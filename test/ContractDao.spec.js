import test from 'ava';
import sinon from 'sinon';

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

test.skip('saveNewContract calls knex correctly & returns correct json', t => {
    const testData = {};
    const knexAPI = {
        returning: function () {},
        insert: function () {},
        then: function () {},
    };
    const knexMock = {};


    knex('contract')
    .returning('contractId')
    .insert(data)
    .then((contractId) => {
        return {text: 'New contract saved to backend', contractId: contractId[0]};
        
      });


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
