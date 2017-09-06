require('babel-core/register');
require('babel-polyfill');

const express = require('express');
const app = express();
const output = require('./src/output');

app.get('/',  (req, res) => {
  output.send(req.query.outputType, res, { text: "Hello World!"} );
})

app.get('/helloUser', (req, res) => {
  if(req.query.username){
    output.send(req.query.outputType, res, { text: req.query.username });
  } else {
    output.send(req.query.outputType, res, { text: "Hello World!" });
  }
})

app.listen(3100, () => {
  console.log('Example app listening on port 3100!');
})
