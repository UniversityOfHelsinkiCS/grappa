exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('agreement').del()
    .then(function () {
      // Inserts seed entries
      return knex('agreement').insert([
        {
          agreementId: 1,
          studentName: 'Anni Puurunen',
          studentNumber: "01234567",
          studentAddress: "Helsinginkatu 1",
          studentPhone: "05012345678",
          studentEmail: "anni.puurunen@hotmail.com",
          studentMajor: "Käpistely",

          thesisTitle: "Annin hieno gradu",
          thesisStartDate: "01.01.2010",
          thesisCompletionEta: "01.01.2011",
          thesisPerformancePlace: "Helsinki",

          thesisSupervisorMain: "Supervisior 1",
          thesisSupervisorSecond: "Supervisior 2",
          thesisSupervisorOther: "Supervisior 3",

          thesisWorkStudentTime: "Student time",
          thesisWorkSupervisorTime: "Supervisior time",
          thesisWorkIntermediateGoal: "Intermediate goal",
          thesisWorkMeetingAgreement: "Meeting agreement",
          thesisWorkOther: "Other",

          studentGradeGoal: "5"
        },
        {
          agreementId: 2,
          studentName: 'Firstname Lastname',
          studentNumber: "01234568",
          studentAddress: "Mäkelänkatu 1",
          studentPhone: "05012345679",
          studentEmail: "firstname.lastname@hotmail.com",
          studentMajor: "Kemia",

          thesisTitle: "Annan gradu kemiasta",
          thesisStartDate: "01.01.2005",
          thesisCompletionEta: "01.01.2006",
          thesisPerformancePlace: "Helsinki",

          thesisSupervisorMain: "Supervisior 1",
          thesisSupervisorSecond: "Supervisior 2",
          thesisSupervisorOther: "Supervisior 3",

          thesisWorkStudentTime: "Student time",
          thesisWorkSupervisorTime: "Supervisior time",
          thesisWorkIntermediateGoal: "Intermediate goal",
          thesisWorkMeetingAgreement: "Meeting agreement",
          thesisWorkOther: "Other",

          studentGradeGoal: "3"
        }
      ]);
    });
};
