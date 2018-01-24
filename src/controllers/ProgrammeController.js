require('babel-polyfill');
const programmeService = require('../services/ProgrammeService');

export async function getAllProgrammes(req, res) {
    const programmes = await programmeService.getAllProgrammes();
    res.status(200).json(programmes);
}
