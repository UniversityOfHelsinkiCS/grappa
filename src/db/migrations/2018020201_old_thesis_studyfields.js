exports.up = async (knex) => {
    const programmeId = await knex('programme').insert([
        {
            facultyId: 1,
            name: 'OLD Computer Computer Science master programmes'
        }
    ]).returning('programmeId')[0];

    return knex('studyfield').insert([
        {
            programmeId,
            name: 'Ohjelmistotekniikka'
        },
        {
            programmeId,
            name: 'Älykkäät järjestelmät'
        },
        {
            programmeId,
            name: 'Algoritmit'
        },
        {
            programmeId,
            name: 'Informaatiojärjestelmät'
        },
        {
            programmeId,
            name: 'Hajautetut j. ja tietoliikenne'
        },
        {
            programmeId,
            name: 'sovellettu'
        },
        {
            programmeId,
            name: 'Kieliteknologia'
        },
        {
            programmeId,
            name: 'Opettaja'
        },
        {
            programmeId,
            name: 'Tietokonematemaatikko'
        },
        {
            programmeId,
            name: 'Ohjelmistot'
        },
        {
            programmeId,
            name: 'Yleinen'
        },
        {
            programmeId,
            name: 'testilinja'
        },
        {
            programmeId,
            name: 'Bioinformatiikka ja laskennallinen biologia'
        },
        {
            programmeId,
            name: 'Bioinformatiikan maisteriohjelma'
        },
        {
            programmeId,
            name: 'CBU-ICT -maisteriohjelma'
        },
        {
            programmeId,
            name: 'Algoritmit ja koneoppiminen'
        },
        {
            programmeId,
            name: 'Ohjelmistojärjestelmät'
        },
        {
            programmeId,
            name: 'Algoritminen bioinformatiikka'
        }
    ]);
};

exports.down = () => {};
