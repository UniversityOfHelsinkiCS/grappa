exports.seed = (knex) => {
    // Deletes ALL existing entries
    return knex('faculty').del()
        .then(() => {
            // Inserts seed entries
            return knex('faculty').insert([
                {
                    name: 'Faculty of Science'
                }
            ]);
        });
};
