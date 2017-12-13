export const getEmailTemplate = (type, data) => {

    if (type === 'createAgreement')
        return "You were added as the supervisor to a new thesis agreement for " + data.thesisTitle + " created by " + data.firstname + " " + data.lastname + ".";
    if (type === 'updateAgreement')
        return data.thesisTitle + " thesis agreement has been updated";

    console.error("there is no template with name " + type);
    return false;
}
