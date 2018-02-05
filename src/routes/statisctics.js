const router = require('express').Router();

const statisticsController = require('../controllers/statistics');

router.get('/', (req, res, next) => statisticsController.getStatistics(req, res).catch(next));

module.exports = router;
