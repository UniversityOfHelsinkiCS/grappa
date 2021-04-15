const router = require('express').Router()
const auth = require('../middleware/auth')
const attachmentController = require('../controllers/AttachmentController')

/**
 * @api {post} attachments/ Save attachments
 * @apiName SaveAttachments
 * @apiGroup Attachments
 *
 * @apiDescription Multipart post with attachment file & metadata
 * TODO: Describe metadata
 */
router.post('/', auth.checkStaff, (req, res, next) =>
    attachmentController.saveAttachments(req, res).catch(next))

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
router.delete('/:id', auth.checkStaff, (req, res, next) => attachmentController.deleteAttachment(req, res).catch(next))

module.exports = router
