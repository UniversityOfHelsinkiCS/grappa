const faculties = require('../../mockdata/MockFaculties')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('faculty').del()
    await knex('faculty').insert(faculties)
    return knex.raw('ALTER SEQUENCE "faculty_facultyId_seq" RESTART WITH 50')
}
