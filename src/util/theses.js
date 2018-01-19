import Checkit from 'checkit';

export const formatTheses = (theses, agreements, persons, roles) => {
    if (!theses || !persons || !agreements)
        return [];

    return theses.map(thesis => formatThesis(thesis, agreements, persons, roles));
};

export const formatThesis = (thesis, agreements, persons, roles) => {
    const thesisAgreement = agreements.find(agreement => agreement.thesisId === thesis.thesisId);
    const author = thesisAgreement ? persons.find(person => person.personId === thesisAgreement.authorId) : {};
    const formattedThesis = Object.assign({}, thesis);

    formattedThesis.programmeId = thesisAgreement.programmeId;

    if (roles) {
        formattedThesis.graders = persons.filter(person =>
            roles.find(role =>
                role.personId === person.personId &&
                role.agreementId === thesisAgreement.agreementId
            )
        );
    }

    if (author) {
        formattedThesis.authorEmail = author.email;
        formattedThesis.authorFirstname = author.firstname;
        formattedThesis.authorLastname = author.lastname;
    } else { // Thesis not linked to person yet, use invite link email
        formattedThesis.authorEmail = thesisAgreement.email;
    }

    return formattedThesis;
};


export const oldGradeFields = [
    { id: 'Approbatur', name: 'Approbatur' },
    { id: 'Lubenter Approbatur', name: 'Lubenter Approbatur' },
    { id: 'Non Sine Laude Approbatur', name: 'Non Sine Laude Approbatur' },
    { id: 'Cum Laude Approbatur', name: 'Cum Laude Approbatur' },
    { id: 'Magna Cum Laude Approbatur', name: 'Magna Cum Laude Approbatur' },
    { id: 'Eximia Cum Laude Approbatur', name: 'Eximia Cum Laude Approbatur' },
    { id: 'Laudatur', name: 'Laudatur' }
];

export const gradeFields = [
    { id: '1', name: '1' },
    { id: '2', name: '2' },
    { id: '3', name: '3' },
    { id: '4', name: '4' },
    { id: '5', name: '5' }
];

export const thesisValidationRules = {
    title: 'required',
    authorEmail: ['required', 'email'],
    urkund: ['required', 'url'],
    grade: 'required',
    programmeId: 'required'
};

export const thesisValidation = new Checkit(thesisValidationRules);

export const emptyThesisData = {
    id: undefined,
    authorFirstname: '',
    authorLastname: '',
    email: '',
    title: '',
    urkund: '',
    grade: '',
    graders: [],
    graderEval: '',
    programmeId: '',
    councilmeetingId: undefined,
    printDone: undefined,
    thesisEmails: {
        graderEvalReminder: undefined,
        printReminder: undefined
    }
};
