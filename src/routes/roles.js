const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const roleController = require('../controllers/RoleController');

// Currently only own roles can be edited.

router.post('/', jsonParser, (req, res) => {
    roleController.saveRole(req, res);
});

router.put('/', jsonParser, (req, res) => {
    // Currently used only for updating visitor role studyfield
    roleController.updateRole(req, res);
});

router.delete('/:id', jsonParser, (req, res) => {
    roleController.deleteRole(req, res);
});

module.exports = router;
