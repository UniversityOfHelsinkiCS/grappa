exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('previousagreements').del()
      .then(function () {
        return knex('previousagreements').insert([
          {
            agreementId: 1,
            previousAgreementId: 2
          }
        ]);
      });
  };
  