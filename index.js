require('babel-core/register');
require('babel-polyfill');

const thesisController = require('./src/controllers/ThesisController');

const express = require('express');
const app = express();
const output = require('./src/output');

module.exports = app;

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

app.use(thesisController);


app.listen(3100, () => {
  console.log('Example app listening on port 3100!');
})
