import logger from './logger'

module.exports = (err, req, res, next) => {
    logger.error('Request error', {
        error: err.message,
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        stack: err.stack
    })
    console.log('Request error', {
        error: err.message,
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        stack: err.stack
    })

    res.status(500).send('Error')
    next()
}
