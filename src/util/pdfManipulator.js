const pdftk = require('node-pdftk');

/**
 * Joins the PDF-files into a single file
 * @param {String} pathToFolder - Absolute path to the file.
 * @param {Array<String>} fileNames - Array of files to be joined.
 * @return {Promise<String>} Promise of the absolute path to the created file.
 */
export async function joinPdfs(pathToFolder, fileNames) {
    //Does not support past 26.
    // Bug in node-pdftk or pdftk: trailing and leading spaces are A: ' B ' = 'A B A'
    const pdfs = fileNames.map((file, index) => String.fromCharCode(65 + index)).join(' ')

    const input = {};
    fileNames.forEach((name, index) => {
        input[String.fromCharCode(65 + index)] = pathToFolder + name;
    })
    
    return pdftk
        .input(input)
        .cat(pdfs)
        .output()
}