const bookshelf = require('../bookshelf');

const Councilmeeting = bookshelf.Model.extend({
    tableName: 'councilmeeting',
    idAttribute: 'councilmeetingId'
});

module.exports = Councilmeeting;
