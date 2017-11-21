const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const agreementDraftController = require('../controllers/AgreementDraftController');

router.get('/:id', (req, res) => {
    agreementDraftController.getAgreementDraftById(req, res);
});

router.post('/', jsonParser, (req, res) => {
    agreementDraftController.saveAgreementDraft(req, res);
});

module.exports = router;