const router = require('express').Router();
const bodyParser = require('body-parser');
const attachmentController = require('../controllers/AttachmentController');

router.post('/', (req, res) => {
    attachmentController.saveAttachments(req, res);
});

module.exports = router;