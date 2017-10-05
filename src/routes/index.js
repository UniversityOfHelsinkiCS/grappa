const bodyParser = require('body-parser');
const output = require('../output');
const router = require('express').Router();
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })


router.get('/',  (req, res) => {
    output.send(req.query.outputType, res, { text: "Hello World!"} );
});

router.get('/helloUser', urlencodedParser, (req, res) => {
    if(req.query.username){
      output.send(req.query.outputType, res, { text: req.query.username });
    } else {
      output.send(req.query.outputType, res, { text: "Hello World!" });
    }
});
    
module.exports = router;
