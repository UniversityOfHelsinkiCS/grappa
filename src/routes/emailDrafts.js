const router = require('express').Router();
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
const emailDraftController = require('../controllers/EmailDraftController');

router.get('/', (req, res) => {
    emailDraftController.getEmailDrafts(req, res);
});

router.post('/', jsonParser, (req, res) => {
    emailDraftController.saveEmailDraft(req, res);
});

router.post('/:id', jsonParser, (req, res) => {
    emailDraftController.updateEmailDraft(req, res);
});

router.delete('/:id', (req, res) => {
    emailDraftController.deleteEmailDraft(req, res);
});

module.exports = router;
