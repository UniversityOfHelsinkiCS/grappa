const express = require('express')
const app = express()

app.get(['/', '/helloUser'], function (req, res) {
  if(req.query.username){
    res.setHeader('Content-Type', 'application/json');
    res.json({ text: req.query.username });
  } else {
    res.json({ text: "Hello World!" });
  }
})

app.listen(3100, function () {
  console.log('Example app listening on port 3100!')
})
