const bodyParser = require('body-parser');
const router = require('express').Router();
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const loginController = require('../controllers/LoginController');

// logins with shibboleth are automatic and code is in auth middleware

// this returns logged in user
router.get('/', jsonParser, (req, res) => {
    loginController.showUser(req, res);
});

router.get('/logout', jsonParser, (req, res) => {
    loginController.logout(req, res);
});

//For now we use get to login for dev.
router.get('/:id', jsonParser, (req, res) => {
    loginController.fakeLogin(req, res);
});

module.exports = router;
