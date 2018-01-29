const router = require('express').Router();
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
const roleController = require('../controllers/RoleController');

router.get('/available', (req, res, next) => {
    roleController.getAvailableRoles(req, res).catch(next);
});

router.post('/', jsonParser, (req, res, next) => {
    roleController.saveRole(req, res).catch(next);
});

router.put('/', jsonParser, (req, res, next) => {
    roleController.updateStatement(req, res).catch(next);
});

router.put('/visitor', jsonParser, (req, res, next) => {
    // Currently used only for updating visitor role programme
    roleController.updateVisitorRoles(req, res).catch(next);
});

router.delete('/:id', jsonParser, (req, res, next) => {
    roleController.deleteRole(req, res).catch(next);
});

module.exports = router;
