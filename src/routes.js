const agreements = require('./routes/agreements');
const theses = require('./routes/theses');
const index = require('./routes/index');
const supervisors = require('./routes/supervisors');
const studyfields = require('./routes/studyfields');
const persons = require('./routes/persons');
const attachments = require('./routes/attachments');
const agreementDrafts = require('./routes/agreementDrafts');
const shibboleth = require('./routes/shibboleth');
const councilmeeting = require('./routes/councilmeeting')

module.exports = (app) => {

    app.use('/', index);
    app.use('/agreements', agreements);
    app.use('/theses', theses);
    app.use('/supervisors', supervisors);
    app.use('/studyfields', studyfields);
    app.use('/persons', persons);
    app.use('/attachments', attachments);
    app.use('/agreement-drafts', agreementDrafts);
    app.use('/councilmeetings', councilmeeting)
    app.use('/zippolet', shibboleth);

};
