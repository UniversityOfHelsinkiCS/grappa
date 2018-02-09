const router = require('express').Router();
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
const emailDraftController = require('../controllers/EmailDraftController');

/**
 * @api {get} emailDrafts/ Get all email drafts
 * @apiName GetDrafts
 * @apiGroup EmailDraft
 *
 * @apiPermission admin manager
 *
 * @apiSuccessExample {json} Success-Response
 * [
 *      {
 *           "emailDraftId": 2,
 *           "programme": null,
 *           "type": "SupervisingProfessorNotification",
 *           "title": "Thesis added to Grappa",
 *           "body": "Hi,\n\nA new thesis which you supervise has been added to Grappa."
 *      }
 * ]
 */
router.get('/', (req, res) => {
    emailDraftController.getEmailDrafts(req, res);
});

/**
 * @api {post} emailDrafts/ Save new draft
 * @apiName SaveDraft
 * @apiGroup EmailDraft
 *
 * @apiPermission admin manager
 *
 * @apiParam {String} title Email title
 * @apiParam {String} body Email body
 * @apiParam {String} type Draft type
 * @apiParam {Number} [programme] Programme id of related programme
 */
router.post('/', jsonParser, (req, res) => {
    emailDraftController.saveEmailDraft(req, res);
});

/**
 * @api {put} emailDrafts/:id Update draft
 * @apiName UpdateDraft
 * @apiGroup EmailDraft
 *
 * @apiPermission admin manager
 *
 * @apiParam {Number} id Draft id
 * @apiParam {String} title Email title
 * @apiParam {String} body Email body
 * @apiParam {Number} [programme] Programme id of related programme
 */
router.post('/:id', jsonParser, (req, res) => {
    emailDraftController.updateEmailDraft(req, res);
});

/**
 * @api {delete} emailDrafts/:id Delete draft
 * @apiName DeleteDraft
 * @apiGroup EmailDraft
 *
 * @apiPermission admin manager
 *
 * @apiParam {Number} id Draft id
 */
router.delete('/:id', (req, res) => {
    emailDraftController.deleteEmailDraft(req, res);
});

module.exports = router;
