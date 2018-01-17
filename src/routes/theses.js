const router = require('express').Router();
const bodyParser = require('body-parser');
const thesisController = require('../controllers/ThesisController');
const jsonParser = bodyParser.json();
const attachment = require('../middleware/attachments');

router.get('/', (req, res, next) => thesisController.getTheses(req, res).catch(next));
router.put('/', jsonParser, (req, res, next) => thesisController.updateThesis(req, res).catch(next));
router.post('/', attachment, (req, res, next) => thesisController.saveThesisForm(req, res).catch(next));

module.exports = router;
