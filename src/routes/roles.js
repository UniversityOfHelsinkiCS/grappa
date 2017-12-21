const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const roleController = require('../controllers/RoleController');

router.post('/', jsonParser, (req, res) => {
    roleController.saveRole(req, res);
});

router.put('/', jsonParser, (req, res) => {
    roleController.updateRole(req, res);
});

router.delete('/:id', jsonParser, (req, res) => {
    roleController.deleteRole(req, res);
});
    
module.exports = router;