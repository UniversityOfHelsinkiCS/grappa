const router = require('express').Router()
const attachmentController = require('../controllers/AttachmentController')

/**
 * @api {post} attachments/ Save attachments
 * @apiName SaveAttachments
 * @apiGroup Attachments
 *
 * @apiDescription Multipart post with attachment file & metadata
 * TODO: Describe metadata
 */
router.post('/', (req, res) => {
    attachmentController.saveAttachments(req, res)
})

/**
 * @api {get} attachments/:ids Download attachments
 * @apiName DownloadAttachments
 * @apiGroup Attachments
 *
 * @apiParam {String} ids List of attachment ids
 */
router.get('/:ids', (req, res) => {
    attachmentController.downloadAttachments(req, res)
})

/**
 * @api {delete} attachments/:id Delete attachment
 * @apiName DeleteAttachment
 * @apiGroup Attachments
 *
 * @apiParam {Number} id Attachment id
 */
router.delete('/:id', (req, res) => {
    attachmentController.deleteAttachment(req, res)
})

module.exports = router
