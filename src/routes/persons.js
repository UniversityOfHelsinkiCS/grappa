const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const personController = require('../controllers/PersonController');

router.put('/', jsonParser, (req, res) => {
    personController.updatePerson(req, res);
});

router.get('/:id', (req, res) => {
    personController.getPersonById(req, res);
});

router.get('/', (req, res) => {
    personController.getAllPersons(req, res);
})


module.exports = router;