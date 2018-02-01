const bookshelf = require('../bookshelf');
const Programme = require('./programme');

const MeetingProgramme = bookshelf.Model.extend({
    tableName: 'meetingProgramme'
})


module.exports = MeetingProgramme;
