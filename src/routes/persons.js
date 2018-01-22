const router = require('express').Router();
const bodyParser = require('body-parser');
const personController = require('../controllers/PersonController');

const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
    personController.addPerson(req, res);
});

router.put('/', jsonParser, (req, res) => {
    personController.updatePerson(req, res);
});

router.get('/:id', (req, res) => {
    personController.getPersonById(req, res);
});

router.get('/', (req, res) => {
    personController.getPersons(req, res);
});

router.post('/invite', jsonParser, (req, res, next) => personController.invitePerson(req, res).catch(next));

module.exports = router;
