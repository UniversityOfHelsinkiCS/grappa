const router = require('express').Router();
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json()
const agreementController = require('../controllers/AgreementController');

router.get('/', (req, res, next) => agreementController.getAllAgreements(req, res).catch(next));

router.post('/', jsonParser, (req, res, next) => agreementController.saveAgreementForm(req, res).catch(next));

module.exports = router;
