const pdftk = require('node-pdftk');

/**
 * Joins the PDF-files into a single file
 * @param {String} pathToFolder - Absolute path to the file.
 * @param {Array<Object>} attachments - Array of files to be joined.
 * @return {Promise<String>} Promise of the absolute path to the created file.
 */
export async function joinPdfs(pathToFolder, attachments) {
    //Does not support past 26.
    // Bug in node-pdftk or pdftk: trailing and leading spaces are A: ' B ' === 'A B A'
    const pdfs = attachments.map((attachment, index) => {
        //If there are more than one, we only want first 4 pages of thesisFile
        if (attachments.length > 1 && attachment.label === 'thesisFile') {
            return String.fromCharCode(65 + index) + '1-4'
        } else {
            return String.fromCharCode(65 + index)
        }
    }).join(' ')

    const input = {};
    attachments.forEach((attachment, index) => {
        input[String.fromCharCode(65 + index)] = pathToFolder + attachment.filename;
    })

    return pdftk.input(input).cat(pdfs).output()
}

export async function addCover(contentBuffer, infoObjects, councilmeeting) {
    const content = await contentBuffer;
    const cover = await generateThesesCover(infoObjects, councilmeeting)
    //TODO: Make sure cat can be done with buffers like this.
    return pdftk.input([cover, content]).output();
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
async function generateThesesCover(thesisInformationArray, councilmeeting) {
    const template = './data/coverTemplate.pdf'
    const dateInformation = councilmeeting ?
        createDateString(new Date(councilmeeting.date))
        : ''
    const thesisInformation = createThesisString(thesisInformationArray);
    const formData = {
        dateInformation,
        thesisInformation,
    }

    return pdftk
        .input(template)
        .fillForm(formData)
        .flatten()
        .output()
}

function createDateString(date) {
    const string = ('0' + date.getDate()).slice(-2) + '/'
        + ('0' + (date.getMonth() + 1)).slice(-2) + '/'
        + date.getFullYear();
    return string;
}

function createThesisString(thesisInfoArray) {
    const string = thesisInfoArray.map(thesis => {
        const thesisString = thesis.authorLastname + ', ' + thesis.authorFirstname + ': ' + thesis.title + '\n';
        const graderString = 'Graders: ' +
            thesis.graders.map(grader => {
                return grader.firstname + ' ' + grader.lastname;
            }).join(', ') + '\n';
        const gradeString = 'Proposed grade: ' + thesis.grade;
        return thesisString + graderString + gradeString
    }).join('\n\n')
    return string;
}