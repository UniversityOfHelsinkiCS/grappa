const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const personController = require('../controllers/PersonController');

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


module.exports = router;
