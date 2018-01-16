const router = require('express').Router();
const programmeController = require('../controllers/ProgrammeController');

router.get('/', (req, res) => {
    programmeController.getAllProgrammes(req, res);
});

module.exports = router;
