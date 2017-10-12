const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const output = require('../output');
const agreementController = require('../controllers/AgreementController');

// router.get('/', (req, res) => {
//     agreementController.getAgreements(req, res);
// });

router.get('/:id', (req, res) => {
    agreementController.getAgreementById(req, res);
});

router.post('/', jsonParser, (req, res) => {
    agreementController.saveAgreement(req, res);
});

router.put('/:id', jsonParser, (req, res) => {
    agreementController.saveAgreement(req, res);
});

module.exports = router;
