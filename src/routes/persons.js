const router = require('express').Router();
const bodyParser = require('body-parser');
const personController = require('../controllers/PersonController');

const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res, next) => personController.addPerson(req, res).catch(next));

router.put('/', jsonParser, (req, res, next) => personController.updatePerson(req, res).catch(next));

router.get('/:id', (req, res, next) => personController.getPersonById(req, res).catch(next));

router.get('/', (req, res, next) => personController.getPersons(req, res).catch(next));

router.post('/invite', jsonParser, (req, res, next) => personController.invitePerson(req, res).catch(next));

module.exports = router;
