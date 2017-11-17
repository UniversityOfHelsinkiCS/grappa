const bodyParser = require('body-parser');
const router = require('express').Router();
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })


router.get('/',  (req, res) => {
    console.log(req.headers);
    res.json({ text: "Check console.log"} );
});

module.exports = router;
