const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const studyfieldController = require('../controllers/StudyfieldController');

router.get('/', (req, res) => {
    studyfieldController.getAllStudyfields(req, res);
});

module.exports = router;
