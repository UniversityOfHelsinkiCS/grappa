import logger from '../util/logger'

const attachmentService = require('../services/AttachmentService')
const agreementService = require('../services/AgreementService')
const councilmeetingService = require('../services/CouncilmeetingService')
const notificationService = require('../services/NotificationService')

export async function saveAttachments(req, res) {
    const attachmentObject = await attachmentService.saveAttachments(req, res)
    const { attachments } = attachmentObject
    notificationService.createNotification('ATTACHMENT_SAVE_ONE_SUCCESS', req)
    res.status(200).send(attachments).end()
}

export async function downloadAttachments(req, res) {
    try {
        let cover = false
        let councilmeetingId
        const attachmentIds = req.params.ids.split('&').filter((id) => {
            // Avoid creating other routes
            // TODO: Create other routes
            if (id === 'cover') {
                cover = true
                return false
            }
            if (id.includes('cm')) {
                councilmeetingId = id.replace('cm', '')
                return false
            }
            return true
        })

        const attachments = await attachmentService.getAttachments(attachmentIds)

        // To keep the order that was used to call (eq, 3&1&2)
        const order = {}
        attachmentIds.forEach((a, i) => { order[a] = i })
        attachments.sort((a, b) => order[a.attachmentId] - order[b.attachmentId])

        const agreementIds = attachments.map(attachment => attachment.agreementId)
        const thesisObjects = await getAgreementObjects(agreementIds)

        const promiseList = await Promise.all(attachments.map(async (attachment) => {
            if (attachment.label === 'thesisFile' && attachments.length > 1) {
                return attachmentService.getPdf(attachment, true)
            } else if (attachment.label === 'reviewFile') {
                // After every review pdf, create page with review of the graders.
                const thesisObject = thesisObjects.filter(obj => obj.agreementId === attachment.agreementId)
                const reviewPage = await attachmentService.createReviewPage(thesisObject)
                const attachmentStream = await attachmentService.getPdf(attachment)
                return attachmentService.mergePdfs(attachmentStream, reviewPage)
            }
            return attachmentService.getPdf(attachment)
        }))

        let fileStream = await attachmentService.mergePdfs(...promiseList)
        if (cover) {
            const councilmeeting = councilmeetingId ?
                await councilmeetingService.getCouncilmeeting(councilmeetingId)
                : undefined
            const coverStream = await attachmentService.createCover(thesisObjects, councilmeeting)
            fileStream = await attachmentService.mergePdfs(coverStream, fileStream)
        }

        res.type('pdf')
        res.end(fileStream, 'binary')
    } catch (error) {
        logger.error('Download failed', { error })
        res.status(501).send({ text: 'NOT YET IMPLEMENTED' }).end()
    }
}

async function getAgreementObjects(agreementIds) {
    const agreementObjects = await agreementService.getThesesGradersAuthorsForAgreements(agreementIds)
    /* agreementObjects are form
    'agreement.agreementId'
    'thesis.title',
    'thesis.grade',
    'grader.firstname',
    'grader.lastname',
    'agreementPerson.statement as graderStatement',
    'graderReviewer.firstname as reviewerFirstname',
    'graderReviewer.lastname as reviewerLastname',
    'author.firstname as authorFirstname',
    'author.lastname as authorLastname', */
    return agreementObjects.reduce((acc, cur) => {
        const idx = acc.findIndex(obj => obj.agreementId === cur.agreementId)
        const reviewerName = cur.reviewerFirstname && cur.reviewerLastname ?
            `${cur.reviewerLastname} ${cur.reviewerFirstname}` : 'not yet reviewed'
        const statement = cur.graderStatement ? cur.graderStatement : 'No statement'
        const grader = {
            firstname: cur.firstname,
            lastname: cur.lastname,
            statement,
            reviewerName
        }
        if (idx !== -1) {
            acc[idx].graders.push(grader)
        } else {
            const agreementObj = {
                agreementId: cur.agreementId,
                title: cur.title,
                grade: cur.grade,
                authorFirstname: cur.authorFirstname,
                authorLastname: cur.authorLastname,
                graders: [grader]
            }
            acc.push(agreementObj)
        }
        return acc
    }, [])
}

export async function deleteAttachment(req, res) {
    const attachmentId = req.params.id
    const attachment = await attachmentService.getAttachments([attachmentId])
    const agreement = await agreementService.getAgreementById(attachment[0].agreementId)
    await agreementService.checkUserHasRightToModifyAgreement(req, [agreement])

    const deletedId = await attachmentService.deleteAttachment(attachmentId)
    notificationService.createNotification('ATTACHMENT_DELETE_ONE_SUCCESS', req)

    res.status(200).send(deletedId).end()
}
