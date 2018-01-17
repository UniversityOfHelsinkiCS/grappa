const router = require('express').Router();
const bodyParser = require('body-parser');
const councilmeetingController = require('../controllers/CouncilmeetingController');

const jsonParser = bodyParser.json();

router.get('/', (req, res, next) => {
    councilmeetingController.getAllCouncilmeetings(req, res).catch(next);
});

router.post('/', jsonParser, (req, res, next) => {
    councilmeetingController.saveCouncilmeeting(req, res).catch(next);
});

router.put('/:id', jsonParser, (req, res, next) => {
    councilmeetingController.updateCouncilmeeting(req, res).catch(next);
});

router.delete('/:id', jsonParser, (req, res, next) => {
    councilmeetingController.deleteCouncilmeeting(req, res).catch(next);
});


module.exports = router;
