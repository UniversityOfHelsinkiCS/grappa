exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('role').del()

    // Inserts seed entries
    return knex('role').insert([
        // Roles are ordered by implicit data access rights.
        {
            name: 'admin'
            // Admin means you and I
        },
        {
            name: 'manager'
            // Manager is person(s) resposible for a programme management
            // Such as opintoesimies. Schedules councilmeetings etc.
        },
        {
            name: 'print_person'
            // Print-person is a manager also, but only responsible
            // for printing / viewing data
        },
        {
            name: 'resp_professor'
            // Responsible professor is in charge of a programme.
            // They decide who is approved as a supervisor and/or grader
        },
        {
            name: 'grader'
            // Grader is responsible for grading a student
        },
        {
            name: 'supervisor'
            // Supervisor is working to assist and supervise the student
        },
        {
            name: 'visitor'
            // Visitor is a person who is part of a programme
        }
    ]);
};
