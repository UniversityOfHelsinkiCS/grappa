const router = require('express').Router();
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
const roleController = require('../controllers/RoleController');

router.get('/available', (req, res) => {
    roleController.getAvailableRoles(req, res);
});

router.post('/', jsonParser, (req, res) => {
    roleController.saveRole(req, res);
});

router.put('/', jsonParser, (req, res) => {
    roleController.updateStatement(req, res);
});

router.put('/visitor', jsonParser, (req, res) => {
    // Currently used only for updating visitor role programme
    roleController.updateVisitorRoles(req, res);
});

router.delete('/:id', jsonParser, (req, res) => {
    roleController.deleteRole(req, res);
});

module.exports = router;
