const router = require('express').Router();
const bodyParser = require('body-parser');
const thesisController = require('../controllers/ThesisController');
const jsonParser = bodyParser.json();
const attachment = require('../middleware/attachments');

router.get('/', thesisController.getTheses);
router.put('/', jsonParser, thesisController.updateThesis);
router.post('/', attachment, thesisController.saveThesisForm);

module.exports = router;
