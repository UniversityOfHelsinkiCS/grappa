const bodyParser = require('body-parser');
const router = require('express').Router();
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const loginController = require('../controllers/LoginController');

//For now we use post to login.
router.get('/', jsonParser, (req, res) => {
    loginController.login(req, res);
});

router.get('/:id', jsonParser, (req, res) => {
    loginController.fakeLogin(req, res);
});

module.exports = router;
