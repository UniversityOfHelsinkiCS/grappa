const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const councilmeetingController = require('../controllers/CouncilmeetingController');

router.get('/', (req, res) => {
    councilmeetingController.getAllCouncilmeetings(req, res);
});

router.post('/', jsonParser, (req, res) => {
    councilmeetingController.saveCouncilmeeting(req, res);
});

router.put('/:id', jsonParser, (req, res) => {
    councilmeetingController.updateCouncilmeeting(req, res);
});

router.delete('/:id', jsonParser, (req, res) => {
    councilmeetingController.deleteCouncilmeeting(req, res);
});


module.exports = router;
