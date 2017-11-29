exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('role').del()
        .then(function () {
            // Inserts seed entries
            return knex('role').insert([
                // Roles are ordered by implicit data access rights.
                {
                    roleId: 1,
                    name: 'admin' 
                    // Admin means you and I
                },
                {
                    roleId: 2,
                    name: 'manager' 
                    // Manager is person(s) resposible for a studyfield management
                    // Such as opintoesimies. Schedules councilmeetings etc.
                },
                {
                    roleId: 3,
                    name: 'print_person'
                    // Print-person is a manager also, but only responsible
                    // for printing / viewing data
                },
                {
                    roleId: 4,
                    name: 'resp_professor'
                    // Responsible professor is in charge of a studyfield.
                    // They decide who is approved as a supervisor and/or grader
                },
                {
                    roleId: 5,
                    name: 'grader'
                    // Grader is responsible for grading a student
                },
                {
                    roleId: 6,
                    name: 'supervisor'
                    // Supervisor is working to assist and supervise the student
                }
            ]);
        });
};