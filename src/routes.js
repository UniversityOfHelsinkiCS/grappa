const agreements = require('./routes/agreements.js');
const contracts = require('./routes/contracts.js');
const theses = require('./routes/theses.js');
const index = require('./routes/index.js');
const app = require('../index.js');
const supervisors = require('./routes/supervisors.js');

module.exports = (app) => {

    app.use('/', index);
    app.use('/contract', contracts);
    app.use('/contracts', contracts);
    app.use('/agreements', agreements);
    app.use('/theses', theses);
    app.use('/supervisors', supervisors);

};

