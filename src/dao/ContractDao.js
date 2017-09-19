const mockContract = require('../mockdata/mockContract');

export const getContract = () => {
    return mockContract.singleMockContract;
}

export const saveContract = (data) => {
    console.log(data);
    return {text: 'Contract saved to backend'};
}
