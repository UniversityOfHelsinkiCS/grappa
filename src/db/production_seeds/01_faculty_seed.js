exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('faculty').del()
    // Inserts seed entries
    return knex('faculty').insert([
        {
            name: 'Faculty of Science'
        }
    ]);
};
