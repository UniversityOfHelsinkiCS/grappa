const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const roleController = require('../controllers/RoleController');

router.post('/', jsonParser, (req, res) => {
    // TODO: Check user rights to add role
    roleController.saveRole(req, res);
});

router.put('/', jsonParser, (req, res) => {
    // TODO: Check user rights to update role
    // Currently used only for updating visitor role studyfield
    roleController.updateRole(req, res);
});

router.delete('/:id', jsonParser, (req, res) => {
    roleController.deleteRole(req, res);
});

module.exports = router;
