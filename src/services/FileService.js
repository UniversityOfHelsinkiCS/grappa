require('babel-polyfill');
const knex = require('../../connection');
const fs = require('fs');


export async function savePdfFile(file, attachmentId) {
    const path = './data/file/' + attachmentId + '.pdf';
    try {
        file.pipe(fs.createWriteStream(path));
    } catch (err) {
        console.log('error: ' + err);
    }
    return true;
}