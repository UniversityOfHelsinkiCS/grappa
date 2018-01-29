const router = require('express').Router();
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json()
const agreementController = require('../controllers/AgreementController');

router.get('/', (req, res) => {
    agreementController.getAllAgreements(req, res);
});

router.get('/:id', (req, res) => {
    agreementController.getAgreementById(req, res);
});

router.post('/', jsonParser, (req, res) => {
    agreementController.saveAgreementForm(req, res);
});

router.put('/:id', jsonParser, (req, res) => {
    agreementController.updateAgreement(req, res);
});

module.exports = router;
