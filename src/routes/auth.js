const bodyParser = require('body-parser')
const router = require('express').Router()
const loginController = require('../controllers/LoginController')

const jsonParser = bodyParser.json()

// logins with shibboleth are automatic and code is in auth middleware

/**
 * @api {get} user/login Log user in
 * @apiName Login
 * @apiGroup User
 *
 * @apiDescription Logs in user & return user data
 *
 * @apiSuccessExample {json} Success-Response
 * {
 *   "personId": 2,
 *   "shibbolethId": "harrihallinnonshibboId",
 *   "email": "harri@hallinto.com",
 *   "firstname": "Harri",
 *   "lastname": "Hallinto",
 *   "isRetired": false,
 *   "studentNumber": "0123845679",
 *   "phone": "050 1234567",
 *   "roles": [
 *       {
 *           "programme": "Computer Science Masters programme",
 *           "programmeId": 1,
 *           "role": "manager"
 *       }
 *   ]
 *  }
 */
router.get('/login', jsonParser, (req, res) => {
    loginController.login(req, res)
})

/**
 * @api {get} user/logout Logout
 * @apiName Logout
 * @apiGroup User
 *
 * @apiDescription Destroys user session and returns shobboleth logout url
 *
 * @apiSuccess {String} logoutUrl Shibboleth logout url
 */
router.get('/logout', jsonParser, (req, res) => {
    loginController.logout(req, res)
})

// For now we use get to login for dev.
if (process.env.NODE_ENV === 'development') {
    router.get('/:id', jsonParser, (req, res) => {
        loginController.fakeLogin(req, res)
    })
}

module.exports = router
