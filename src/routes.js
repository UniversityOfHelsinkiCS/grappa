const agreements = require('./routes/agreements');
const theses = require('./routes/theses');
const index = require('./routes/index');
const roles = require('./routes/roles');
const programmes = require('./routes/programmes');
const studyfields = require('./routes/studyfields');
const persons = require('./routes/persons');
const attachments = require('./routes/attachments');
const shibboleth = require('./routes/auth');
const councilMeeting = require('./routes/councilmeeting');
const notifications = require('./routes/notifications');
const emailDrafts = require('./routes/emailDrafts');
const invite = require('./routes/invite');

const auth = require('./middleware/auth');
const auditLogger = require('./middleware/auditLogger');

module.exports = (app) => {
    app.use(auth.shibRegister);
    app.use(auditLogger);
    app.use('/', index);
    app.use('/user', shibboleth);
    app.use('/persons', persons);
    app.use(auth.checkAuth);
    app.use('/invite', invite);
    app.use('/agreements', agreements);
    app.use('/theses', theses);
    app.use('/roles', roles);
    app.use('/programmes', programmes);
    app.use('/studyfields', studyfields);
    app.use('/attachments', attachments);
    app.use('/councilmeetings', councilMeeting);
    app.use('/emailDrafts', emailDrafts);
    app.use(auth.checkAdmin);
    app.use('/notifications', notifications);
};
