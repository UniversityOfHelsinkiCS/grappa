const personService = require('../services/PersonService');
const roleService = require('../services/RoleService');
const programmeService = require('../services/ProgrammeService');
const notificationService = require('../services/NotificationService');
const emailInviteService = require('../services/EmailInviteService');

export async function addPerson(req, res) {
    const personData = getPersonData(req.body);
    const saveData = removeEmptyKeys(personData);
    try {
        const savedPerson = await personService.savePerson(saveData);
        res.status(200).json(savedPerson).end();
    } catch (error) {
        res.status(500).send(error).end();
    }
}

export async function updatePerson(req, res) {
    const data = req.body;
    const personData = getPersonData(data);
    if (personData.personId) {
        const updateData = removeEmptyKeys(personData);
        await personService.updatePerson(updateData).then((response) => {
            notificationService.createNotification('ROLE_UPDATE_ONE_SUCCESS', req);
            res.status(200).json(`person updated succesfully ${response}`);
        }
        ).catch(err => res.status(500).json(err));
    } else {
        res.status(500).json({ text: 'person does not exist' });
    }
}

function getPersonData(data) {
    return {
        personId: data.personId,
        firstname: data.firstname,
        lastname: data.lastname,
        shibbolethId: data.shibbolethId,
        email: data.email,
        title: data.title,
        isRetired: data.isRetired,
        studentNumber: data.studentNumber,
        address: data.address,
        phone: data.phone,
        major: data.major
    };
}

function removeEmptyKeys(personData) {
    const parsedData = {};
    Object.keys(personData).forEach((key) => {
        if (personData[key] != null) {
            parsedData[key] = personData[key];
        }
    });
    return parsedData;
}

/**
 * Get persons that are of interest to the person doing query
 */
export async function getPersons(req, res) {
    // TODO test & refactor
    const programmeRoles = ['resp_professor', 'print-person', 'manager'];

    try {
        let persons = [];
        let newPersons = [];
        const user = await personService.getLoggedPerson(req);

        if (!user) {
            return userNotFound(res);
        }
        const rolesInProgrammes = await getUsersRoles(user);

        // Add user to person list
        persons.push(user);

        // If user is an admin, get everything
        if (rolesInProgrammes.find(item => item.role.name === 'admin')) {
            return getAllPersons(res);
        }

        rolesInProgrammes.forEach(async (item) => {
            // As resp_prof persons who are writing theses in programme
            if (programmeRoles.includes(item.role.name)) {
                newPersons = await personService.getPersonsWithAgreementInStudyfield(item.programme.programmeId);
                persons = [...new Set([...persons, ...newPersons])];
            }
        });
        // Persons who are supervisors / supervising for new thesis / agreement supervisor list
        const supervisorId = await roleService.getRoleId('supervisor');
        newPersons = await personService.getPersonsWithRole(supervisorId);
        persons = [...new Set([...persons, ...newPersons])];
        // or grading / graders for new thesis / agreement graders list.
        const graderId = await roleService.getRoleId('grader');
        newPersons = await personService.getPersonsWithRole(graderId);
        persons = [...new Set([...persons, ...newPersons])];

        // Persons (students) who are writing theses user has access to as
        // a agreementperson (supervisor, grader etc)
        newPersons = await personService.getPersonsWithAgreementPerson(user.personId);
        persons = [...new Set([...persons, ...newPersons])];

        // Remove duplicates
        const responsePersons = [];
        persons.forEach((person) => {
            if (!responsePersons.find(item => item.personId === person.personId)) {
                responsePersons.push(person);
            }
        });

        // All required persons found, now role objects for front
        const roles = await roleService.getRolesForAllPersons();
        const responseObject = {
            roles,
            persons: responsePersons
        };
        return res.status(200).json(responseObject);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

async function userNotFound(res) {
    if (process.env.NODE_ENV !== 'dev') {
        throw new Error('No user found');
    }
    console.log('It indeed is a developer.');
    const persons = await personService.getAllPersons();
    const roles = await roleService.getRolesForAllPersons();
    const responseObject = {
        roles,
        persons
    };
    return res.status(200).json(responseObject).end();
}

async function getAllPersons(res) {
    const persons = await personService.getAllPersons();
    const roles = await roleService.getRolesForAllPersons();
    const responseObject = {
        roles,
        persons
    };
    return res.status(200).json(responseObject).end();
}

const getUsersRoles = async (user) => {
    const roleToId = await roleService.getRoles();
    const programmeToId = await programmeService.getAllProgrammes();
    const personRoles = await roleService.getPersonRoles(user.personId);
    return personRoles.map(role => ({
        programme: programmeToId.find(programmeIdPair => programmeIdPair.programmeId === role.programmeId),
        role: roleToId.find(roleIdPair => roleIdPair.roleId === role.roleId)
    }))
};

export async function getPersonById(req, res) {
    const person = await personService.getPersonById(req.params.id);
    res.status(200).json(person);
}

export async function invitePerson(req, res) {
    await emailInviteService.createEmailInviteForRole(req.body);
    res.status(200).end();
}
