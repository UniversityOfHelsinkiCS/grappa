const morgan = require('morgan')
const logger = require('./util/logger')

const agreements = require('./routes/agreements')
const theses = require('./routes/theses')
const index = require('./routes/index')
const roles = require('./routes/roles')
const programmes = require('./routes/programmes')
const studyfields = require('./routes/studyfields')
const persons = require('./routes/persons')
const attachments = require('./routes/attachments')
const shibboleth = require('./routes/auth')
const councilMeeting = require('./routes/councilmeeting')
const notifications = require('./routes/notifications')
const emailDrafts = require('./routes/emailDrafts')
const invite = require('./routes/invite')
const statistics = require('./routes/statisctics')

const auth = require('./middleware/auth')
const auditLogger = require('./middleware/auditLogger')

const accessLogger = morgan((tokens, req, res) => {
    const fields = ['method', 'url', 'status', 'response-time', 'remote-addr', 'remote-user', 'user-agent', 'referrer']
    const name = req.decodedToken ? req.decodedToken.name : 'undefined name'
    const message = [
        name, ':',
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
    const meta = req.decodedToken ? req.decodedToken : {}
    fields.forEach((field) => { meta[field] = tokens[field](req, res) })
    logger.info(message, meta)
})

module.exports = (app) => {
    app.use(auditLogger)
    app.use('/', index)
    app.use('/user', shibboleth)
    app.use(auth.checkAuth, accessLogger)
    app.use('/persons', persons)
    app.use('/statistics', statistics)
    app.use('/invite', invite)
    app.use('/agreements', agreements)
    app.use('/theses', theses)
    app.use('/roles', roles)
    app.use('/programmes', programmes)
    app.use('/studyfields', studyfields)
    app.use('/attachments', attachments)
    app.use('/councilmeetings', councilMeeting)
    app.use('/emailDrafts', emailDrafts)
    app.use(auth.checkAdmin)
    app.use('/notifications', notifications)
}
