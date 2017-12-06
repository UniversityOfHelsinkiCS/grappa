const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const graderController = require('../controllers/GraderController');
    
router.get('/', (req, res) => {
    graderController.getGraders(req, res);
});

router.post('/', jsonParser, (req, res) => {
    graderController.saveGrader(req, res);
});

router.put('/', jsonParser, (req, res) => {
    graderController.updateGrader(req, res);
});

router.delete('/:id', jsonParser, (req, res) => {
    graderController.deleteGrader(req, res);
});
    
module.exports = router;