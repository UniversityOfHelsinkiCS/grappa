exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('agreement').del()
        .then(function () {
            // Inserts seed entries
            return knex('agreement').insert([
                {
                    agreementId: 1,
                    authorId: 10,
                    thesisId: 1,
                    responsibleSupervisorId: 1,
                    studyfieldId: 1,
                    fake: false,
                    startDate: '6.5.2005',
                    completionEta: '1.2.2006',
                    performancePlace: 'Hima',
                    studentGradeGoal: 5,
                    studentWorkTime: "1h viikossa",
                    supervisorWorkTime: "tsiigaillaan",
                    intermediateGoal: "oispa valmistunut",
                    meetingAgreement: "just just",
                    other: "eihän tässä muuta"
                },
                {
                    agreementId: 2,
                    authorId: 2,
                    thesisId: 2,
                    responsibleSupervisorId: 2,
                    studyfieldId: 2,
                    fake: false,
                    startDate: '6.5.2005',
                    completionEta: '1.2.2006',
                    performancePlace: 'Hima',
                    studentGradeGoal: 5,
                    studentWorkTime: "200h viikossa",
                    supervisorWorkTime: "jee",
                    intermediateGoal: "valmistun",
                    meetingAgreement: "joka päivä",
                    other: "ddd"
                },
                {
                    agreementId: 3,
                    authorId: 1,
                    thesisId: 1,
                    responsibleSupervisorId: 1,
                    studyfieldId: 1,
                    fake: true,
                    startDate: '6.5.2005',
                    completionEta: '1.2.2006',
                    performancePlace: 'Hima',
                    studentGradeGoal: 5,
                    studentWorkTime: "5h viikossa",
                    supervisorWorkTime: "jees",
                    intermediateGoal: "valmistunen",
                    meetingAgreement: "joka toinen päivä",
                    other: "eee"
                }
            ]);
        });
};
