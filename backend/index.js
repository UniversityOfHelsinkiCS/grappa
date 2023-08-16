require('dotenv').config()
require('babel-core/register')
require('babel-polyfill')
const express = require('express')
const Sentry = require('@sentry/node')

const cors = require('cors')
const gracefulExit = require('express-graceful-exit')
const logger = require('./src/util/logger')
const routes = require('./src/routes.js')
const errorHandler = require('./src/util/errorHandler')
const initializeSentry = require('./src/util/sentry')

const app = express()

initializeSentry(app)

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

const server = require('http').createServer(app)


app.listen(3100, () => {
    logger.info('Grappa app listening on port 3100!')
    logger.info('Debugging version: 0.0.4')
    logger.info(`Environment is ${process.env.NODE_ENV}`)
})

app.use(gracefulExit.middleware(app))
if (process.env.NODE_ENV === 'development') {
    app.use(cors())
}

routes(app)

app.use(errorHandler)
app.disable('x-powered-by')

process.on('unhandledRejection', (reason, p) => {
    logger.error('Unhandled Rejection at: Promise', { promise: p, reason, stack: reason.stack })
    // application specific logging, throwing an error, or other logic here
})

process.on('SIGTERM', () => {
    gracefulExit.gracefulExitHandler(app, server, {
        socketio: app.settings.socketio
    })
})

module.exports = app
