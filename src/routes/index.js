const bodyParser = require('body-parser');
const router = require('express').Router();
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })


router.get('/',  (req, res) => {
    res.json({ text: 'Hello World!'} );
});

router.get('/helloUser', urlencodedParser, (req, res) => {
    if(req.query.username){
      res.json({ text: req.query.username });
    } else {
      res.json({ text: 'Hello World!' });
    }
});
    
module.exports = router;
