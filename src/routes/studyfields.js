const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const studyFieldController = require('../controllers/StudyFieldController');

router.get('/', (req, res) => {
    studyFieldController.getAllStudyFields(req, res);
});

module.exports = router;
