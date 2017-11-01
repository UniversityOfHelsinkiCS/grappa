const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const attachmentController = require('../controllers/AttachmentController');

router.post('/', jsonParser, (req, res) => {
    attachmentController.saveAttachment(req, res);
});

module.exports = router;