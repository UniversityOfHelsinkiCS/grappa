exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('emailDraft').del()
        .then(function() {
            // Inserts seed entries
            return knex('emailDraft').insert({
                title: 'Test email',
                body: 'Email body',
                type: 'testEmail'
            });
        });
};
