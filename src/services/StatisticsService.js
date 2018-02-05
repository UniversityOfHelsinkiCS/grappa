const pg = require('pg');
const knex = require('../db/connection').getKnex();

pg.types.setTypeParser(20, 'text', parseInt);

export async function getStatistics() {
    return knex('agreement')
        .select('studyfieldId', 'grade')
        .select(knex.raw(
            'CASE WHEN date IS NULL ' +
            'THEN EXTRACT(YEAR FROM "completionEta") ' +
            'ELSE EXTRACT(YEAR FROM "date") END as year'
        ))
        .count('grade')
        .innerJoin('thesis', 'agreement.thesisId', 'thesis.thesisId')
        .leftJoin('councilmeeting', 'thesis.councilmeetingId', 'councilmeeting.councilmeetingId')
        .where('printDone', true)
        .groupBy('studyfieldId', 'grade', 'year')
        .orderBy('year', 'desc')
        .orderBy('studyfieldId');
}
