const bookshelf = require('../bookshelf');

const MeetingProgramme = bookshelf.Model.extend({
    tableName: 'meetingProgramme'
})


module.exports = MeetingProgramme;
