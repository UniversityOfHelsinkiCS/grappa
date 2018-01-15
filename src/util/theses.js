export const formatTheses = (theses, agreements, persons) => {
    if (!theses || !persons || !agreements)
        return [];
        
    return theses.map((thesis) => {
        const agreement = agreements.find(agreement => agreement.thesisId === thesis.thesisId);
        const person = agreement ? persons.find(person => person.personId === agreement.authorId) : {};
        const formattedThesis = Object.assign({}, thesis);

        if (person) {
            formattedThesis.email = person.email;
            formattedThesis.authorFirstname = person.firstname;
            formattedThesis.authorLastname = person.lastname;
        } else { // Thesis not linked to person yet, use invite link email
            formattedThesis.email = agreement.email;
        }

        return formattedThesis
    });
};
