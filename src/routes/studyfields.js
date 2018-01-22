const router = require('express').Router();
const studyfieldController = require('../controllers/StudyfieldController');

router.get('/', (req, res) => {
    studyfieldController.getAllStudyfields(req, res);
});

module.exports = router;
