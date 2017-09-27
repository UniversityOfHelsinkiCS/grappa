import test from 'ava';
import sinon from 'sinon';

const thesisDao = require('../src/dao/ThesisDao');
const mockTheses = require('../src/mockdata/Theses');

test.skip('getAllTheses returns list of right length ', t => {
    let listOfTheses = thesisDao.getAllTheses();
    t.deepEqual(listOfTheses.length, mockTheses.length);
});

test.skip('getThesisById returns right thesis', t => {
    let id = '1';
    let thesis = thesisDao.getThesisById(id);
    let mockthesis;
    for(let i = 0; i < mockTheses.length; i++) {
        if (mockTheses[i].id.toString() === id) {
            mockthesis = mockTheses[i];
        }
    }
    t.deepEqual(thesis, mockthesis);
});
