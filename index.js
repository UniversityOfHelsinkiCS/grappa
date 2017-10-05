require('babel-core/register');
require('babel-polyfill');

const express = require('express');
const app = express();
const routes = require('./src/routes.js');
const connection = require('./connection');

module.exports = app;

app.listen(3100, () => {
  console.log('Example app listening on port 3100!');
})

routes(app);
