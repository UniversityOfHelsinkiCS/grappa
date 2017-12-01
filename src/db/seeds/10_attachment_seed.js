exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('attachment').del()
        .then(function () {
            // Inserts seed entries
            return knex('attachment').insert([
                {
                    attachmentId: 1,
                    agreementId: 1,
                    filename: 'Pdf liite',
                    type: 'pdf',
                    savedOnDisk: true
                }
            ]);
        });
};