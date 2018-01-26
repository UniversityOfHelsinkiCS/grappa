const bodyParser = require('body-parser');
const router = require('express').Router();
const loginController = require('../controllers/LoginController');

const jsonParser = bodyParser.json();

// logins with shibboleth are automatic and code is in auth middleware

// this returns logged in user
router.get('/login', jsonParser, (req, res) => {
    loginController.showUser(req, res);
});

router.get('/logout', jsonParser, (req, res) => {
    loginController.logout(req, res);
});

// For now we use get to login for dev.
if (process.env.NODE_ENV === 'development') {
    router.get('/:id', jsonParser, (req, res) => {
        loginController.fakeLogin(req, res);
    });
}

module.exports = router;
