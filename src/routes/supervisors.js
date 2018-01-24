
const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const supervisorController = require('../controllers/SupervisorController');
const personController = require('../controllers/PersonController');

router.get('/', (req, res, next) => supervisorController.getAllSupervisors(req, res).catch(next));

router.post('/', jsonParser, (req, res, next) => supervisorController.saveSupervisor(req, res).catch(next));

router.put('/review', jsonParser, (req, res, next) => supervisorController.reviewSupervisor(req, res).catch(next));

router.put('/:id', jsonParser, (req, res, next) => {
    // front should not use this route for this, but one for person
    personController.updatePerson(req, res).catch(next);
});

router.get('/agreementPersons', (req, res, next) => supervisorController.getAgreementPersons(req, res).catch(next));

module.exports = router;
