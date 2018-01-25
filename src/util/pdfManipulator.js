const pdftk = require('node-pdftk');

/**
 * Joins the PDF-files into a single file
 * @param {String} pathToFolder - Absolute path to the file.
 * @param {Array<Object>} attachments - Array of files to be joined.
 * @return {Promise<String>} Promise of the absolute path to the created file.
 */
export async function getPdf(pathToFolder, attachment, trim) {
    // Does not support past 26.
    // Bug in node-pdftk or pdftk: trailing and leading spaces are A: ' B ' === 'A B A'
    const pdf = (trim && attachment.label === 'thesisFile') ? 'A1-4' : 'A';

    const input = {
        A: pathToFolder + attachment.filename
    };
    return pdftk.input(input).cat(pdf).output()
}

export async function combinePdf(...buffers) {
    // TODO: Make sure catenation can be done with buffers like this.
    return pdftk.input(buffers).output();
}

/**
 * Creates a cover for the councilmeeting's documents as required by Pirjo.
 *
 * Consists of a list of the thesis processed in the meeting with author's name,
 * instructor's name and thesis' grade.
 * @param {Array<Object>} theses - Array of thesis objects.
 * @param {Object} councilmeeting - Councilmeeting object.
 * @return {Promise<Array>} Array of something??? TODO
 */
export async function generateThesesCover(thesisInformationArray, councilmeeting) {
    const template = './data/coverTemplate.pdf'
    const dateInformation = councilmeeting ?
        createDateString(new Date(councilmeeting.date))
        : ''
    const thesisInformation = createThesisString(thesisInformationArray);
    const formData = {
        dateInformation,
        thesisInformation
    }

    return pdftk
        .input(template)
        .fillForm(formData)
        .flatten()
        .output()
}

function createDateString(date) {
    return `0${(date.getDate()).slice(-2)}/0${(date.getMonth() + 1).slice(-2)}/${date.getFullYear()}`
}

function createThesisString(thesisInfoArray) {
    return thesisInfoArray.map((thesis) => {
        const thesisString = `${thesis.authorLastname}, ${thesis.authorFirstname}: ${thesis.title}\n`
        const graderString =
            `Graders: ${thesis.graders.map(grader => `${grader.firstname} ${grader.lastname}`).join(', ')}\n`;
        const gradeString = `Proposed grade: ${thesis.grade}`;
        return thesisString + graderString + gradeString
    }).join('\n\n')
}

export async function generateReviewPage(reviewInformationArray) {
    const thesisInformation = createReviewString(reviewInformationArray);
    const template = './data/coverTemplate.pdf'
    const formData = {
        thesisInformation
    }
    return pdftk
        .input(template)
        .fillForm(formData)
        .flatten()
        .output();
}

function createReviewString(reviewInfoArray) {
    return reviewInfoArray.map((agreementObject) => {
        const identifyString = `${agreementObject.authorLastname} ${agreementObject.authorFirstname}: ${agreementObject.grade}\n${agreementObject.title}`
        const graderString = agreementObject.graders.map((grader) => {
            return `${grader.lastname} ${grader.firstname}.\nReviewed by ${grader.reviewerName}:\n${grader.statement}`
        }).join('\n\n');
        return `${identifyString}\n\n${graderString}`;
    }).join('\n\n')
}