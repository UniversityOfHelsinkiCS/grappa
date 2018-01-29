const router = require('express').Router();
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json()
const agreementController = require('../controllers/AgreementController');

router.get('/', (req, res, next) => agreementController.getAllAgreements(req, res).catch(next));

router.get('/:id', (req, res, next) => agreementController.getAgreementById(req, res).catch(next));

router.post('/', jsonParser, (req, res, next) => agreementController.saveAgreementForm(req, res).catch(next));

router.put('/:id', jsonParser, (req, res, next) => agreementController.updateAgreement(req, res).catch(next));

module.exports = router;
