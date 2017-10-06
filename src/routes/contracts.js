const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const output = require('../output');
const contractController = require('../controllers/ContractController');

// router.get('/', (req, res) => {
//     contractController.getContracts(req, res);
// });
    
router.get('/:id', (req, res) => {
    contractController.getContractById(req, res);
});
    
router.post('/', jsonParser, (req, res) => {
        contractController.saveContract(req, res);
});
    
module.exports = router;
