const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const agreementController = require('../controllers/AgreementController');

router.get('/', (req, res) => {
    agreementController.getAgreementsByLoggedAuthor(req, res);
});

router.get('/:id/previous', (req, res) => {
    agreementController.getPreviousAgreementById(req, res);
});

router.get('/:id', (req, res) => {
    agreementController.getAgreementById(req, res);
});

router.post('/', jsonParser, (req, res) => {
    agreementController.saveAgreement(req, res);
});

router.put('/:id', jsonParser, (req, res) => {
    agreementController.updateAgreement(req, res);
});

router.post('/previous', jsonParser, (req, res) => {
    agreementController.savePrevious(req, res);
});


module.exports = router;
