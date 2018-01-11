const router = require('express').Router();
const bodyParser = require('body-parser');
const thesisController = require('../controllers/ThesisController');
const jsonParser = bodyParser.json();

router.get('/', thesisController.getTheses);
router.get('/:id', thesisController.getThesisById);
router.put('/', jsonParser, thesisController.updateThesis);
router.post('/', thesisController.saveThesisForm);

module.exports = router;
