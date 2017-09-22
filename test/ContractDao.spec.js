import test from 'ava';

const contractDao = require('../src/dao/ContractDao');
const mockContracts = require('../src/mockdata/MockContracts');

test('ContractDao returns a contract by id correctly', t => {
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
