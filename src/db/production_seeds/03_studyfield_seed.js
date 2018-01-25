exports.seed = (knex) => {
    // Deletes ALL existing entries
    return knex('studyfield').del()
        .then(() => {
            // Inserts seed entries
            return knex('studyfield').insert([
                {
                    programmeId: 1,
                    name: 'Software Systems'
                },
                {
                    programmeId: 1,
                    name: 'Algorithms, Data Analytics and Machine Learning'
                },
                {
                    programmeId: 1,
                    name: 'Networking and Services'
                },
                {
                    programmeId: 1,
                    name: 'Algorithmic Bioinformatics'
                },
                {
                    programmeId: 2,
                    name: 'No studyfield'
                },
                {
                    programmeId: 3,
                    name: 'No studyfield'
                },
                {
                    programmeId: 4,
                    name: 'Analytical chemistry'
                },
                {
                    programmeId: 4,
                    name: 'Chemistry teacher education'
                },
                {
                    programmeId: 4,
                    name: 'Inorganic chemistry'
                },
                {
                    programmeId: 4,
                    name: 'Organic chemistry'
                },
                {
                    programmeId: 4,
                    name: 'Physical chemistry'
                },
                {
                    programmeId: 4,
                    name: 'Polymer chemistry'
                },
                {
                    programmeId: 4,
                    name: 'Radiochemistry'
                },
                {
                    programmeId: 5,
                    name: 'No studyfield'
                },
                {
                    programmeId: 6,
                    name: 'Applied analysis'
                },
                {
                    programmeId: 6,
                    name: 'Biomathematics'
                },
                {
                    programmeId: 6,
                    name: 'Mathematical analysis'
                },
                {
                    programmeId: 6,
                    name: 'Mathematical logic'
                },
                {
                    programmeId: 6,
                    name: 'Mathematical physics'
                },
                {
                    programmeId: 7,
                    name: 'No studyfield'
                }
            ]);
        });
};
