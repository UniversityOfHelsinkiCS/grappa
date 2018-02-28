exports.up = async (knex) => {
    await knex.schema.createTable('major', (table) => {
        table.increments('majorId').primary()
        table.text('majorName')
    })

    const majorIds = await knex('major')
        .insert([
            { majorName: 'Mathematics' },
            { majorName: 'Applied mathematics' },
            { majorName: 'Statistics' }
        ])
        .returning('majorId')

    await knex.schema.table('studyfield', (table) => {
        table.integer('majorId')
        table.foreign('majorId').references('major.majorId')
        table.dropForeign('programmeId')
        table.foreign('programmeId').references('programme.programmeId').onDelete('CASCADE')
    })

    const programmeId = await knex('programme')
        .select('programmeId')
        .where('name', 'Master\'s Programme in Mathematics and Statistics')
        .first()
        .then(res => res.programmeId)

    const oldProgrammeId = await knex('programme')
        .select('programmeId')
        .where('name', 'Department of Mathematics and Statistics')
        .first()
        .then(res => res.programmeId)

    const lifeScienceProgramme = await knex('programme')
        .insert({ name: 'Master\'s Programme in Life science', facultyId: 1 })
        .returning('programmeId')

    const teachersProgramme = await knex('programme')
        .insert({
            name: 'Master’s Programme for Teachers of Mathematics, Physics and Chemistry',
            facultyId: 1
        })
        .returning('programmeId')

    await knex('studyfield').insert([
        { programmeId, majorId: majorIds[0], name: 'Analysis' },
        { programmeId, majorId: majorIds[0], name: 'Geometry, algebra and topology' },
        { programmeId, majorId: majorIds[0], name: 'Mathematical logic' },
        { programmeId, majorId: majorIds[0], name: 'Mathematical physics' },
        { programmeId, majorId: majorIds[1], name: 'Applied analysis' },
        { programmeId, majorId: majorIds[1], name: 'Mathematical modelling' },
        { programmeId, majorId: majorIds[1], name: 'Mathematics of imaging' },
        { programmeId, majorId: majorIds[1], name: 'Stochastics' },
        { programmeId, majorId: majorIds[1], name: 'Insurance and financial mathematics' },
        { programmeId, majorId: majorIds[1], name: 'Probability modelling' },
        { programmeId, name: 'Statistics' },
        { programmeId, name: 'Social statistics' },

        { programmeId: oldProgrammeId, majorId: majorIds[0], name: 'Analysis' },
        { programmeId: oldProgrammeId, majorId: majorIds[0], name: 'Geometry, algebra and topology' },
        { programmeId: oldProgrammeId, majorId: majorIds[0], name: 'Mathematical physics' },
        { programmeId: oldProgrammeId, majorId: majorIds[0], name: 'Mathematical logic' },

        { programmeId: oldProgrammeId, majorId: majorIds[1], name: 'Biomathematics' },
        { programmeId: oldProgrammeId, majorId: majorIds[1], name: 'Applied analysis' },
        { programmeId: oldProgrammeId, majorId: majorIds[1], name: 'Stochastics' },
        { programmeId: oldProgrammeId, majorId: majorIds[1], name: 'Computer aided mathematics' },
        { programmeId: oldProgrammeId, majorId: majorIds[1], name: 'Insurance and financial mathematics' },
        { programmeId: oldProgrammeId, majorId: majorIds[1], name: 'Statistical machine learning' },

        { programmeId: oldProgrammeId, majorId: majorIds[3], name: 'Time series analysis amd econometry' },
        { programmeId: oldProgrammeId, majorId: majorIds[3], name: 'Biometry and bioinformatics' },
        { programmeId: oldProgrammeId, majorId: majorIds[3], name: 'Social statistics' },
        { programmeId: oldProgrammeId, majorId: majorIds[3], name: 'Statistical machine learning' },
        { programmeId: oldProgrammeId, majorId: majorIds[3], name: 'General statistics' },

        { programmeId: lifeScienceProgramme[0], name: 'Algorithmic bioinformatics' },
        { programmeId: lifeScienceProgramme[0], name: 'Applied bioinformatics' },
        { programmeId: lifeScienceProgramme[0], name: 'Biomathematics' },
        { programmeId: lifeScienceProgramme[0], name: 'Biostatistics and bioinformatics' },
        { programmeId: lifeScienceProgramme[0], name: 'Eco-evolutionary informatics' },
        { programmeId: lifeScienceProgramme[0], name: 'Systems biology and medicine' },

        { programmeId: teachersProgramme[0], name: 'No studyfield' }
    ])
}

exports.down = async (knex) => {
    await knex('studyfield')
        .del()
        .whereIn('name', [
            'Statistics',
            'Social statistics',
            'Algorithmic bioinformatics',
            'Applied bioinformatics',
            'Biomathematics',
            'Biostatistics and bioinformatics',
            'Eco-evolutionary informatics',
            'Systems biology and medicine',
            'Time series analysis amd econometry',
            'Biometry and bioinformatics',
            'Statistical machine learning',
            'General statistics'
        ])
        .orWhereNotNull('majorId')

    await knex('programme').del().where('name', 'Master\'s Programme in Life science')
    await knex('programme').del().where('name', 'Master’s Programme for Teachers of Mathematics, Physics and Chemistry')
    await knex.schema.table('studyfield', table => table.dropColumn('majorId'))
    await knex.schema.dropTable('major', 'Master\'s Programme in Life science')
}
