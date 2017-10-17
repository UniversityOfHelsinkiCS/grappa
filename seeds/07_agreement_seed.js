exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('agreement').del()
        .then(function () {
            // Inserts seed entries
            return knex('agreement').insert([
                {
                    agreementId: 1,
                    authorId: 1,
                    thesisId: 1,
                    responsibleSupervisorId: 1,
                    studyfieldId: 1,
                    fake: false,
                    studentGradeGoal: "5"
                },
                {
                    agreementId: 2,
                    authorId: 2,
                    thesisId: 2,
                    responsibleSupervisorId: 2,
                    studyfieldId: 2,
                    fake: false,
                    studentGradeGoal: "5"
                },
                {
                    agreementId: 3,
                    authorId: 1,
                    thesisId: 1,
                    responsibleSupervisorId: 1,
                    studyfieldId: 1,
                    fake: true,
                    studentGradeGoal: "5"
                }
            ]);
        });
};
