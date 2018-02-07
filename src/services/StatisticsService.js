const pg = require('pg');
const knex = require('../db/connection').getKnex();

pg.types.setTypeParser(20, 'text', parseInt);

export async function getStatistics() {
    const results = await knex('agreement')
        .select('agreement.studyfieldId', 'grade', 'studyfield.programmeId')
        .select(knex.raw(
            'CASE WHEN date IS NULL ' +
            'THEN EXTRACT(YEAR FROM "completionEta") ' +
            'ELSE EXTRACT(YEAR FROM "date") END as year'
        ))
        .count('grade')
        .innerJoin('thesis', 'agreement.thesisId', 'thesis.thesisId')
        .innerJoin('studyfield', 'studyfield.studyfieldId', 'agreement.studyfieldId')
        .innerJoin('programme', 'studyfield.programmeId', 'programme.programmeId')
        .leftJoin('councilmeeting', 'thesis.councilmeetingId', 'councilmeeting.councilmeetingId')
        .where('printDone', true)
        .groupBy('agreement.studyfieldId', 'grade', 'year', 'studyfield.programmeId')
        .orderBy('year', 'desc')
        .orderBy('studyfieldId');

    const output = {};

    // Create nested response object
    results.forEach((row) => {
        const { year, programmeId, studyfieldId, grade, count } = row;

        if (!output[year])
            output[year] = {};
        if (!output[year][programmeId])
            output[year][programmeId] = {};
        if (!output[year][programmeId][studyfieldId]) {
            output[year][programmeId][studyfieldId] = {
                newGrades: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                oldGrades: {
                    Approbatur: 0,
                    'Lubenter Approbatur': 0,
                    'Non Sine Laude Approbatur': 0,
                    'Cum Laude Approbatur': 0,
                    'Magna Cum Laude Approbatur': 0,
                    'Eximia Cum Laude Approbatur': 0,
                    Laudatur: 0
                }
            };
        }

        const rowToAdd = output[year][programmeId][studyfieldId];

        if (Number.isNaN(Number(grade)))
            rowToAdd.oldGrades[grade] = count;
        else
            rowToAdd.newGrades[grade] = count;
    });

    return output;
}
