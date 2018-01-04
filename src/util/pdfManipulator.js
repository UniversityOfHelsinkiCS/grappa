const pdftk = require('node-pdftk');

/**
 * Joins the PDF-files into a single file
 * @param {String} pathToFolder - Absolute path to the file.
 * @param {Array<String>} fileNames - Array of files to be joined.
 * @return {Promise<String>} Promise of the absolute path to the created file.
 */
export async function joinPdfs(pathToFolder, fileNames) {
    //Does not support past 26.
    let pdfs = fileNames.reduce((accumulated, current, index) => {
        accumulated += " " + String.fromCharCode(65 + index);
        return accumulated;
    }, "")

    const input = {};
    fileNames.forEach((name, index) => {
        input[String.fromCharCode(65 + index)] = pathToFolder + name;
    })
    return pdftk
        .input(input)
        .cat(pdfs)
        .output()
}