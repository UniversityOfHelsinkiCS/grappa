exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('previousagreements').del()
      .then(function () {
        return knex('previousagreements').insert([
          {
            agreementId: 3,
            previousAgreementId: 1
          }
        ]);
      });
  };
  