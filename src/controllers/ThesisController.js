const thesisService = require('../services/ThesisService');
const attachmentService = require('../services/AttachmentService');

export async function getAllTheses(req, res) {
    const theses = await thesisService.getAllTheses();
    res.status(200).json(theses);
}

export async function getThesisById(req, res) {
    const thesis = await thesisService.getThesisById(req.params.id);
    res.status(200).json(thesis);
}

export async function saveThesis(req, res) {
    const data = req.body;
    try {
        //If it has attachments handle those.
        if (data.attachments) {
            await data.attachments.forEach(async attachment => {
                await attachmentService.saveAttachment(attachment)                
            })
        }
        //DB breaks if we try adding too many fields
        delete data.attachments;        
        //TODO: Find better solution 
        //(Validate all requests before sending to db.)

        const thesis = await thesisService.saveThesis(data);
        res.status(200).json(thesis);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}