const personService = require('../services/PersonService');
const roleService = require('../services/RoleService');
const studyfieldService = require('../services/StudyfieldService');

export async function addPerson(req, res) {
    const personData = getPersonData(req.body);
    const saveData = removeEmptyKeys(personData);
    try {
        let savedPerson = await personService.savePerson(saveData);
        res.status(200).json(savedPerson).end();
    } catch (error) {
        res.status(500).send(error).end();
    }
}

export async function updatePerson(req, res) {
    const data = req.body;
    const personData = getPersonData(data);
    if (personData.personId != null || personData.personId != '') {
        const updateData = removeEmptyKeys(personData);
        let personId = await personService.updatePerson(updateData).then((response) => {
            res.status(200).json("person updated succesfully " + response);
        }
        ).catch(err => {
            res.status(500).json(err);
        });
    }
    else {
        res.status(500).json({ text: "person does not exist" });
    }
}

function getPersonData(data) {
    const personData = {
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
    return personData;
}

function removeEmptyKeys(personData) {
    let parsedData = {};
    Object.keys(personData).map(key => {
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
    //TODO test & refactor
    try {
        let persons = []
        let newPersons = []
        const user = await personService.getLoggedPerson(req);

        if (!user) {
            if (process.env.NODE_ENV !== "dev") {
                throw new Error("No user found");
            }
            console.log("It indeed is a developer.")
            persons = await personService.getAllPersons();
            const roles = await roleService.getRolesForAllPersons()
            const responseObject = {
                roles,
                persons
            }
            res.status(200).json(responseObject).end();
            return;
        }
        const rolesInStudyfields = await getUsersRoles(user);

        //If user is an admin, get everything
        if (rolesInStudyfields.find(item => item.role.name === 'admin')) {
            persons = await personService.getAllPersons();
            const roles = await roleService.getRolesForAllPersons()
            const responseObject = {
                roles,
                persons,
            }
            res.status(200).json(responseObject).end();
            return;
        }

        rolesInStudyfields.forEach(async item => {
            // As resp_prof persons who are writing theses in studyfield
            if (item.role.name === 'resp_professor' || item.role.name === 'print-person' || item.role.name === 'manager') {
                newPersons = await personService.getPersonsWithAgreementInStudyfield(item.studyfield.studyfieldId);
                persons = [...new Set([...persons, ...newPersons])];
            }
        })
        //Persons who are supervisors / supervising for new thesis / agreement supervisor list 
        const supervisorId = await roleService.getRoleId("supervisor")
        newPersons = await personService.getPersonsWithRole(supervisorId);
        persons = [...new Set([...persons, ...newPersons])];
        //or grading / graders for new thesis / agreement graders list.
        const graderId = await roleService.getRoleId("grader")
        newPersons = await personService.getPersonsWithRole(graderId)
        persons = [...new Set([...persons, ...newPersons])];

        //Persons (students) who are writing theses user has access to as 
        //a agreementperson (supervisor, grader etc)
        newPersons = await personService.getPersonsWithAgreementPerson(user.personId)
        persons = [...new Set([...persons, ...newPersons])];

        //All required persons found, now role objects for front
        const roles = await roleService.getRolesForAllPersons()
        const responseObject = {
            roles,
            persons
        }
        res.status(200).json(responseObject);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getUsersRoles = async (user) => {
    const roleToId = await roleService.getRoles();
    const studyfieldToId = await studyfieldService.getAllStudyfields();
    const personRoles = await roleService.getPersonRoles(user.personId);
    return personRoles.map(role => {
        return {
            studyfield: studyfieldToId.find(studyfieldIdPair => studyfieldIdPair.studyfieldId === role.studyfieldId),
            role: roleToId.find(roleIdPair => roleIdPair.roleId === role.roleId)
        }
    })
}

export async function getPersonById(req, res) {
    const person = await personService.getPersonById(req.params.id);
    res.status(200).json(person);
}
