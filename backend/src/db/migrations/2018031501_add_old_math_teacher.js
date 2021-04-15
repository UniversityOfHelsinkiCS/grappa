/*
Migration to add subject teacher studyfield to old grading system
in Mathematics department. Also adds "Other major" to those studyfields in
the same Unit that do not already have a major.
*/
exports.up = async (knex) => {
    const oldProgrammeId = await knex('programme')
        .select('programmeId')
        .where('name', 'Department of Mathematics and Statistics')
        .first()
        .then(res => res.programmeId)

    const newProgrammeId = await knex('programme')
        .select('programmeId')
        .where('name', 'Master\'s Programme in Mathematics and Statistics')
        .first()
        .then(res => res.programmeId)

    const teacherProgrammeId = await knex('programme')
        .select('programmeId')
        .where('name', 'Master’s Programme for Teachers of Mathematics, Physics and Chemistry')
        .first()
        .then(res => res.programmeId)

    let chemistryProgramme = await knex('programme')
        .select('programmeId')
        .where('name', 'Department of Chemistry')
        .first()

    if (chemistryProgramme === undefined) {
        chemistryProgramme = await knex('programme')
            .insert({ name: 'Department of Chemistry', facultyId: 1 })
    }

    const chemistryProgrammeId = await knex('programme')
        .select('programmeId')
        .where('name', 'Department of Chemistry')
        .first()
        .then(res => res.programmeId)

    const statisticsMajor = await knex('major')
        .select('majorId')
        .where('majorName', 'Statistics')
        .first()
        .then(res => res.majorId)


    const physicsProgrammeId = await knex('programme')
        .insert({ name: 'Department of Physics', facultyId: 1 })
        .returning('programmeId')

    const major = await knex('major')
        .insert([
            { majorName: 'Teacher in mathematics' },
            { majorName: 'Teacher in chemistry' },
            { majorName: 'Teacher in physics' },
            { majorName: 'Social statistics' },
            { majorName: 'Physics education' },
            { majorName: 'Mathematics education' },
            { majorName: 'Chemistry education' },
            { majorName: 'Chemistry' }
        ])
        .returning('majorId')

    await knex('studyfield')
        .where('name', 'Chemistry teacher education')
        .del()

    await knex('studyfield')
        .where('name', 'Mathematical analysis')
        .del()

    await knex('studyfield')
        .insert([
            { programmeId: teacherProgrammeId, majorId: major[0], name: 'No studyfield (math)' },
            { programmeId: teacherProgrammeId, majorId: major[1], name: 'No studyfield (chem)' },
            { programmeId: teacherProgrammeId, majorId: major[2], name: 'No studyfield (phys)' },
            { programmeId: physicsProgrammeId[0], majorId: major[4], name: 'No studyfield' },
            { programmeId: oldProgrammeId, majorId: major[5], name: 'No studyfield' },
            { programmeId: chemistryProgrammeId, majorId: major[6], name: 'No studyfield' },
            { programmeId: oldProgrammeId, majorId: statisticsMajor, name: 'Psychometrics' }
        ])

    await knex('studyfield')
        .whereRaw('"majorId" ISNULL AND "programmeId" = ?', oldProgrammeId)
        .update('majorId', statisticsMajor)

    await knex('studyfield')
        .whereRaw('"majorId" ISNULL AND "programmeId" = ?', chemistryProgrammeId)
        .update('majorId', major[7])

    await knex('studyfield')
        .whereRaw('name=\'Statistics\' AND "programmeId" = ?', newProgrammeId)
        .update('majorId', statisticsMajor)

    await knex('studyfield')
        .whereRaw('name=\'Social statistics\' AND "programmeId" = ?', newProgrammeId)
        .update('majorId', major[3])
}

exports.down = async (knex) => {
    const statisticsId = await knex('major')
        .select('majorId')
        .where('majorName', 'Statistics')
        .first()
        .then(res => res.majorId)

    const socialStatisticsId = await knex('major')
        .select('majorId')
        .where('majorName', 'Social statistics')
        .first()
        .then(res => res.majorId)

    const chemistryId = await knex('major')
        .select('majorId')
        .where('majorName', 'Chemistry')
        .first()
        .then(res => res.majorId)

    await knex('studyfield')
        .whereIn('majorId', [statisticsId, socialStatisticsId, chemistryId])
        .update('majorId', null)

    const mathTeacherId = await knex('major')
        .select('majorId')
        .where('majorName', 'Teacher in mathematics')
        .first()
        .then(res => res.majorId)

    const chemTeacherId = await knex('major')
        .select('majorId')
        .where('majorName', 'Teacher in chemistry')
        .first()
        .then(res => res.majorId)

    const physTeacherId = await knex('major')
        .select('majorId')
        .where('majorName', 'Teacher in physics')
        .first()
        .then(res => res.majorId)

    const physEduId = await knex('major')
        .select('majorId')
        .where('majorName', 'Physics education')
        .first()
        .then(res => res.majorId)

    const mathEduId = await knex('major')
        .select('majorId')
        .where('majorName', 'Mathematics education')
        .first()
        .then(res => res.majorId)

    const chemEduId = await knex('major')
        .select('majorId')
        .where('majorName', 'Chemistry education')
        .first()
        .then(res => res.majorId)

    await knex('studyfield')
        .whereIn('majorId', [
            mathTeacherId,
            chemTeacherId,
            physTeacherId,
            physEduId,
            mathEduId,
            chemEduId
        ])
        .del()

    await knex('studyfield')
        .where('name', 'Psychometrics')
        .del()

    await knex('major')
        .whereIn('majorName', [
            'Teacher in mathematics',
            'Teacher in chemistry',
            'Teacher in physics',
            'Social statistics',
            'Physics education',
            'Mathematics education',
            'Chemistry education',
            'Chemistry'
        ])
        .del()

    await knex('programme')
        .where('name', 'Department of Physics')
        .del()


    const chemistryProgrammeId = await knex('programme')
        .select('programmeId')
        .where('name', 'Department of Chemistry')
        .first()
        .then(res => res.programmeId)

    await knex('studyfield')
        .insert({ programmeId: chemistryProgrammeId, name: 'Chemistry teacher education' })
}
