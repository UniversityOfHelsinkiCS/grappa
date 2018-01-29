const router = require('express').Router();
const attachmentController = require('../controllers/AttachmentController');

router.post('/', (req, res) => {
    attachmentController.saveAttachments(req, res);
});

//Download attachment
router.get('/:ids', (req, res) => {
    attachmentController.downloadAttachments(req, res);
})

router.delete('/:id', (req, res) => {
    attachmentController.deleteAttachment(req, res);
})

module.exports = router;
