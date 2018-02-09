const bookshelf = require('../bookshelf');
const Programme = require('./programme');

const Councilmeeting = bookshelf.Model.extend({
    tableName: 'councilmeeting',
    idAttribute: 'councilmeetingId',
    programmes() {
        return this.belongsToMany(Programme, 'meetingProgramme', 'councilmeetingId', 'programmeId');
    }
});

module.exports = Councilmeeting;
