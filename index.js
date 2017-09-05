const express = require('express')
const app = express()

app.get(['/', '/helloUser'], function (req, res) {
  console.log(req.baseUrl);
  if(req.param('username')){
    res.send('Hello ' + req.param('username') + '!')
  } else{
    res.send('Hello World!')
  }
})

app.listen(3100, function () {
  console.log('Example app listening on port 3100!')
})