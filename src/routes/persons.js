const router = require('express').Router();
const bodyParser = require('body-parser');
const personController = require('../controllers/PersonController');

const jsonParser = bodyParser.json();

router.get('/', (req, res, next) => personController.getPersons(req, res).catch(next));

router.post('/invite', jsonParser, (req, res, next) => personController.invitePerson(req, res).catch(next));

module.exports = router;
