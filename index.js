require('babel-core/register');
require('babel-polyfill');

const express = require('express');
const app = express();
const gracefulExit = require('express-graceful-exit');
const routes = require('./src/routes.js');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const knex = require('./src/db/connection.js');

const store = new KnexSessionStore({
  knex: knex,
  tablename: 'sessions' // optional. Defaults to 'sessions'
});

module.exports = app;

app.listen(3100, () => {
  console.log('Grappa app listening on port 3100!');
})

app.use(gracefulExit.middleware(app));
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 6000000 }, store: store, resave: false, saveUninitialized: false }));

routes(app);

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'stack:', reason);
  // application specific logging, throwing an error, or other logic here
  console.log(reason.stack);
});

process.on('SIGTERM', function () {
  gracefulExit.gracefulExitHandler(app, server, {
    socketio: app.settings.socketio
  });
});
