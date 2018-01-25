exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('agreementDraftPerson').del() // Foreign key violation
    await knex('agreementDraft').del()
    // Inserts seed entries
    return knex('agreementDraft').insert([
        {
            agreementDraftId: 1,
            mainSupervisorId: 1,
            studentEmail: 'opiskelija@mailinator.com',
            studentFirstname: 'David',
            studentLastname: 'Bowie',
            studentNumber: ('012345678'),
            studentAddress: ('Mannerheimintie'),
            studentPhone: '050 1234567',
            studentMajor: 'Kemia',
            thesisTitle: 'Life on Mars?',
            thesisStartDate: '6.5.2005',
            thesisCompletionEta: '1.2.2006',
            thesisPerformancePlace: 'paikka',
            studentGradeGoal: 5,
            studentTime: '1h viikossa',
            supervisorTime: '1h kuussa',
            intermediateGoal: 'hmm',
            meetingAgreement: 'meeting on sovittu',
            other: 'uuu'
        },
        {
            agreementDraftId: 2,
            mainSupervisorId: 2,
            studentEmail: 'chandler@hotmail.com',
            studentFirstname: 'Chandler',
            studentLastname: 'Bing',
            studentNumber: ('012345678'),
            studentAddress: ('Hämeentie 111'),
            studentPhone: '050 1234567',
            studentMajor: 'Fysiikka',
            thesisTitle: 'Bing thesis',
            thesisStartDate: '6.5.2005',
            thesisCompletionEta: '1.2.2006',
            thesisPerformancePlace: 'paikka',
            studentGradeGoal: 5,
            studentTime: '1h viikossa',
            supervisorTime: '1h kuussa',
            intermediateGoal: 'hmm',
            meetingAgreement: 'agreement on meeting',
            other: 'muuta?'
        }
    ]);
};
