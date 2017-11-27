exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('personWithRole').del()
        .then(function () {
            // Inserts seed entries
            return knex('personWithRole').insert([
                //Range of ordinary personRoleIds, personIds and roleIds from 1 to 6
                {
                    personRoleId: 1, 
                    personId: 1, // Amanda Admin
                    roleId: 1, // admin
                    studyfieldId: 1 // Irrelevant for admin, Tietojenkäsittelytiede
                },
                {
                    personRoleId: 2, 
                    personId: 2, // Harri CS-Hallinto
                    roleId: 2, // manager
                    studyfieldId: 1 // Tietojenkäsittelytiede
                },
                {
                    personRoleId: 3, 
                    personId: 3, // Petra CS-Printtaaja
                    roleId: 3, // print-person
                    studyfieldId: 1 // Tietojenkäsittelytiede
                },
                {
                    personRoleId: 4, 
                    personId: 4, // Victoria CS-Vastuuproffa
                    roleId: 4, // resp_professor
                    studyfieldId: 1 // Tietojenkäsittelytiede
                },
                {
                    personRoleId: 5,
                    personId: 5, // Thomas CS-Tarkastaja
                    roleId: 5, // grader
                    studyfieldId: 1 // Tietojenkäsittelytiede
                },
                {
                    personRoleId: 6,
                    personId: 6, // Olli CS-Ohjaaja
                    roleId: 6, // supervisor 
                    studyfieldId: 1 // Tietojenkäsittelytiede
                },
                //Defaults ended here, now special people:
                {
                    personRoleId: 8,
                    personId: 8, // Venla Math-vastuuproffa
                    roleId: 4, // resp_professor
                    studyfieldId: 2 // Matematiikka
                },
                {
                    personRoleId: 9,
                    personId: 9, // Anna Puu
                    roleId: 6, // supervisor
                    studyfieldId: 1 // Tietojenkäsittelytiede
                },
                {
                    personRoleId: 10,
                    personId: 9, // Anna Puu
                    roleId: 6, // supervisor
                    studyfieldId: 2 // Matematiikka
                },
                {
                    personRoleId: 13,
                    personId: 11, // Erkki Erikoistapaus
                    roleId: 3, // print-person
                    studyfieldId: 2 // Matematiikka
                },
                {
                    personRoleId: 15,
                    personId: 11, // Erkki Erikoistapaus
                    roleId: 4, // supervisor
                    studyfieldId: 1 // Tietojenkäsittelytiede
                }
            ]);
        });
};