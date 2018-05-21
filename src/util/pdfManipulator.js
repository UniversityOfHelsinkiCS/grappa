const fs = require('fs')
const pdftk = require('node-pdftk')
const PDFDocument = require('pdfkit')
const uuidv1 = require('uuid/v1')

/**
 * Joins the PDF-files into a single file
 * @param {String} pathToFolder - Absolute path to the file.
 * @param {Array<Object>} attachments - Array of files to be joined.
 * @return {Promise<String>} Promise of the absolute path to the created file.
 */
export async function getPdf(pathToFolder, attachment, trim) {
    // Does not support past 26.
    // Bug in node-pdftk or pdftk: trailing and leading spaces are A: ' B ' === 'A B A'
    const pdf = (trim && attachment.label === 'thesisFile') ? 'A1-4' : 'A'

    const input = {
        A: pathToFolder + attachment.filename
    }
    return pdftk.input(input).cat(pdf).output()
}

export async function combinePdf(...buffers) {
    // TODO: Make sure catenation can be done with buffers like this.
    return pdftk.input(buffers).output()
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
    const doc = new PDFDocument({ size: 'A4', margin: 50 })

    // We save generated pdf into /tmp with expectation that container is restarted
    // often enough to delete old files.
    const filename = '/tmp/cover-'.concat(uuidv1())
    doc.pipe(fs.createWriteStream(filename))

    const dateInformation = councilmeeting ?
        createDateString(councilmeeting.date)
        : ''
    const thesisnumber = thesisInformationArray.length
    const lastpage = Math.ceil(thesisnumber / 5)

    thesisInformationArray.forEach((thesis, i) => {
        if (i % 5 === 0) {
            const currpage = Math.floor(i / 5) + 1
            doc.fontSize(14).text(`${dateInformation}     (${currpage}/${lastpage})`, 400, 40)
            doc.fontSize(24).text('Pro Gradu -tutkielmat', 100, 100, { indent: -40 })
            doc.moveDown()
            doc.fontSize(18)
        }
        doc.text(`${thesis.authorLastname}, ${thesis.authorFirstname}: ${thesis.title}`, { indent: -40 })
        doc.text(`Graders: ${thesis.graders.map(grader => `${grader.firstname} ${grader.lastname}`).join(', ')}`,
            { indent: -40 })
        doc.text(`Proposed grade: ${thesis.grade}`, { indent: -40 })
        doc.moveDown()
        if (i % 5 === 4) doc.addPage()
    })

    doc.end()

    const input = {
        A: filename
    }
    return pdftk.input(input).output()
}

function createDateString(date) {
    const day = `0${date.getDate()}`.slice(-2)
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
}

export async function generateReviewPage(reviewInformationArray) {
    const thesisInformation = createReviewString(reviewInformationArray)
    const template = './data/coverTemplate.pdf'
    const formData = {
        thesisInformation
    }
    return pdftk
        .input(template)
        .fillForm(formData)
        .flatten()
        .output()
}

function createReviewString(reviewInfoArray) {
    return reviewInfoArray.map((agreementObject) => {
        const identifyString = `${agreementObject.authorLastname} ${agreementObject.authorFirstname}
        : ${agreementObject.grade}\n${agreementObject.title}`
        const graderString = agreementObject.graders
            .map(grader => `${grader.lastname} ${grader.firstname}.\n
            Reviewed by ${grader.reviewerName}:\n${grader.statement}`)
            .join('\n\n')
        return `${identifyString}\n\n${graderString}`
    }).join('\n\n')
}
