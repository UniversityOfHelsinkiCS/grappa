import Checkit from 'checkit'
import Promise from 'bluebird'

const thesisService = require('../services/ThesisService')
const agreementService = require('../services/AgreementService')
const attachmentService = require('../services/AttachmentService')
const personService = require('../services/PersonService')
const roleService = require('../services/RoleService')
const programmeService = require('../services/ProgrammeService')
const studyfieldService = require('../services/StudyfieldService')
const notificationService = require('../services/NotificationService')
const emailService = require('../services/EmailService')
const emailInviteService = require('../services/EmailInviteService')

const checkit = new Checkit({
    title: 'required',
    urkund: ['required', 'url'],
    grade: 'required'
})

export async function getTheses(req, res) {
    const programmeRoles = ['resp_professor', 'print_person', 'manager']

    const user = await personService.getLoggedPerson(req)
    let theses = []
    let newTheses = []

    const rolesInProgrammes = await roleService.getUsersRoles(user)
    if (rolesInProgrammes.find(item => item.role.name === 'admin')) {
        // As an admin, get all theses
        const allTheses = await thesisService.getAllTheses()
        res.status(200).json(allTheses).end()
        return
    }

    rolesInProgrammes.forEach(async (item) => {
        if (programmeRoles.includes(item.role.name)) {
            // ... As resp_professor, manager or print-person theses in programme
            newTheses = await thesisService.getThesesInProgramme(item.programme.programmeId)
            theses = [...new Set([...theses, ...newTheses])]
        }
    })

    const thesesAsAgreementPerson = await thesisService.getThesesByAgreementPerson(user.personId)
    const thesesAsAuthor = await thesisService.getThesesByPersonId(user.personId)

    theses = [...theses, ...thesesAsAgreementPerson, ...thesesAsAuthor]

    // Remove duplicates
    const response = []
    theses.forEach((thesis) => {
        if (!response.find(item => item.thesisId === thesis.thesisId)) {
            response.push(thesis)
        }
    })

    res.status(200).json(response).end()
}

async function validateThesis(thesis) {
    try {
        checkit.maybe({ authorEmail: ['required', 'email'], studyfieldId: 'required' }, input => !input.thesisId)

        await checkit.run(thesis)
    } catch (error) {
        throw new Error(`Posted thesis data is not valid: ${Object.keys(error.errors)}`)
    }
}

export async function saveThesisForm(req, res) {
    const thesis = JSON.parse(req.body.json)

    await validateThesis(thesis)

    // Order so that agreementId is available to save attachments.
    const agreement = await agreementService.createFakeAgreement()
    const attachments = await attachmentService.saveAttachmentFiles(req.files, agreement.agreementId)
    const { studyfieldId, authorEmail } = thesis
    const { agreementId } = agreement

    agreement.studyfieldId = thesis.studyfieldId

    delete thesis.authorFirstname
    delete thesis.authorLastname
    delete thesis.studyfieldId
    // TODO: Add email to new email send table
    delete thesis.thesisEmails
    delete thesis.authorEmail

    if (thesis.graders) {
        updateGraders(thesis.graders, agreement)
        delete thesis.graders
    }
    const savedThesis = await thesisService.saveThesis(thesis)

    // Agreement was missing the thesisId completing linking.
    agreement.thesisId = savedThesis.thesisId
    const savedAgreement = await agreementService.updateAgreement(agreement)
    const roles = await roleService.getRolesForAllPersons()
    const programme = await programmeService.getStudyfieldsProgramme(studyfieldId)
    await emailService.newThesisAddedNotifyRespProf(programme.programmeId)
    await emailInviteService.createEmailInviteForThesisAuthor(authorEmail, agreementId, programme.programmeId)

    const response = {
        thesis: savedThesis,
        agreement: savedAgreement,
        attachments,
        roles
    }

    notificationService.createNotification('THESIS_SAVE_ONE_SUCCESS', req, agreement.programmeId)
    res.status(200).json(response)
}

export async function updateThesis(req, res) {
    const updatedFields = req.body
    let thesis = await thesisService.getThesisById(updatedFields.thesisId)
    const agreements = await agreementService.getAgreementsByThesisId(thesis.thesisId)

    await checkUserHasRightToModifyThesis(req, agreements)

    Object.keys(thesis).forEach((key) => {
        if (updatedFields[key] !== undefined)
            thesis[key] = updatedFields[key]
    })

    await validateThesis(thesis)

    thesis = await thesisService.updateThesis(thesis)

    // TODO: support multiple agreements on one thesis
    await updateGraders(updatedFields.graders, agreements[0])

    const roles = await roleService.getRolesForAllPersons()
    const responseObject = { thesis, roles }
    res.status(200).json(responseObject).end()
}


const updateGraders = async (graders, agreement) => {
    // To unlink person and
    const agreementPersons = await roleService.getAgreementPersonsByAgreementId(agreement.agreementId)
    await Promise.all(agreementPersons.map(async (agreementPerson) => {
        const personRole = await roleService.getPersonRoleWithId(agreementPerson.personRoleId)
        if (!graders.find(grader => grader === personRole.personId)) {
            await roleService.unlinkAgreementAndPersonRole(agreementPerson.agreementId, agreementPerson.personRoleId)
        }
    }))
    // If grader not in agreementperson, link them.
    await Promise.all(graders.map(async (grader) => {
        const personRole = await roleService.getPersonRole(grader, agreement.studyfieldId, 'grader')
        if (personRole) {
            // If person exists as a grader and not already linked, link them
            if (!agreementPersons.find(agreementPerson => agreementPerson.personRoleId === personRole.personRoleId)) {
                roleService.linkAgreementAndPersonRole(agreement.agreementId, personRole.personRoleId)
            }
        } else {
            // If person has no grader role, make the person a grader and link them.
            const roleId = await roleService.getRoleId('grader')
            const studyfield = await studyfieldService.getStudyfield(agreement.studyfieldId)
            let personWithRole = {
                personId: grader,
                programmeId: studyfield.programmeId,
                roleId
            }
            personWithRole = await roleService.savePersonRole(personWithRole)
            roleService.linkAgreementAndPersonRole(agreement.agreementId, personWithRole.personRoleId)
        }
    }))
}

async function checkUserHasRightToModifyThesis(req, agreements) {
    const user = await personService.getLoggedPerson(req)
    const roles = await roleService.getUsersRoles(user)

    if (isAdmin(roles)) {
        return
    }

    if (await hasStudyfieldRole(roles, agreements)) {
        return
    }

    if (await isAgreementPersonForThesis(user, agreements)) {
        return
    }

    throw new Error('User has no access to edit thesis')
}

function isAdmin(roles) {
    return !!roles.find(item => item.role.name === 'admin')
}

async function hasStudyfieldRole(roles, agreements) {
    const studyfieldRoles = ['manager', 'resp_professor']
    const thesisProgramme = await programmeService.getStudyfieldsProgramme(agreements[0].studyfieldId)
    const studyfieldRole = roles
        .filter(item => item.programme.programmeId === thesisProgramme.programmeId)
        .find(item => studyfieldRoles.includes(item.role.name))

    return !!studyfieldRole
}

async function isAgreementPersonForThesis(user, agreements) {
    const agreementPersons = await Promise.map(
        agreements,
        agreement => roleService.getAgreementPersonsByAgreementId(agreement.agreementId)
    ).reduce((prev, cur) => prev.concat(cur), [])

    return !!agreementPersons.find(person => person.personId === user.personId)
}

export async function markPrinted(req, res) {
    await thesisService.markPrinted(req.body)
    res.status(200).json(req.body)
}
