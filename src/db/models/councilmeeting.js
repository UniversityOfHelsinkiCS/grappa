const bookshelf = require('../bookshelf');
const Programme = require('./programme');
const MeetingProgramme = require('./meetingProgramme');


const Councilmeeting = bookshelf.Model.extend({
    tableName: 'councilmeeting',
    idAttribute: 'councilmeetingId',
    programmes: function () {
        return this.belongsToMany(Programme).through(MeetingProgramme, 'councilmeetingId', 'programmeId')
    }
});

module.exports = Councilmeeting;
