exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('emailDraft').del()
    // Inserts seed entries
    await knex('emailDraft').insert([
        {
            type: 'StudentRegistrationNotification',
            title: 'Thesis approval',
            body:
                `Hi,

Your thesis has now been approved by the Department Council and 
all the required modules have been registered in Oodi. If you would like to alter something in these modules, please \
contact us (opintoesimies@cs.helsinki.fi). Otherwise you should fill in the Application form for the Master of Science \
Degree Diploma:

-in English: https://elomake.helsinki.fi/lomakkeet/81238/lomake.html?rinnakkaislomake=Mscenglish
-in Finnish: https://elomake.helsinki.fi/lomakkeet/81238/lomake.html
-in Swedish: https://elomake.helsinki.fi/lomakkeet/81238/lomake.html?rinnakkaislomake=FMsvenska`
        },
        {
            type: 'SupervisingProfessorNotification',
            title: 'Thesis added to Grappa',
            body:
                `Hi,

A new thesis which you supervise has been added to Grappa.`
        },
        {
            type: 'EthesisReminder',
            title: 'REMINDER: Submit your thesis to eThesis',
            body:
                `Hi

This is an automatic reminder from Grappa, https://grappa.cs.helsinki.fi, a web application created to help in \
managing the final stages of approving student's master's degree.

Your thesis has been reviewed and submitted to the system. In this email's attachments you can find and read your \
review. If you're not satisfied with your grade, please contact Kjell Lemström.

If you accept your grade, please submit your thesis into eThesis https://ethesis.helsinki.fi/. And after submitting \
please re-submit the same PDF-document to Grappa using the supplied field below.
Your thesis is set to be accepted in the next councilmeeting of $DATE$. If you submit your thesis after the deadline \
of $STUDENTDEADLINE$ your thesis will be automatically moved to the next councilmeeting.
$LINK$`
        },
        {
            type: 'GraderEvalReminder',
            title: 'REMINDER: Submit your evaluation',
            body:
                `Hi

This is an automatic reminder from Grappa, https://grappa.cs.helsinki.fi, a web application created to help in \
managing the final stages of approving student's master's degree.

Due to rules of the process, your evaluation of the instructors is needed for the process to continue. Please submit \
your evaluation in the provided link.
$LINK$`
        },
        {
            type: 'InviteAuthorToLogin',
            title: 'Thesis added to Grappa',
            body:
                `Hi

Your thesis has been added to Grappa, a web application created to help in managing the final stages of approving \
student's master's degree.
$LOGIN_URL$`
        },
        {
            type: 'InviteRoleToLogin',
            title: 'Invite to Grappa',
            body:
                `Hi

You have been invited to Grappa, a web application created to help in managing the final stages of approving \
student's master's degree.
$LOGIN_URL$`
        }
    ])
    return knex.raw('ALTER SEQUENCE "emailDraft_emailDraftId_seq" RESTART WITH 50')
}
