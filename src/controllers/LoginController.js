const personService = require('../services/PersonService');
const roleService = require('../services/RoleService');
const studyfieldService = require('../services/StudyfieldService')

//Used with Shibboleth
// export async function login(req, res) {
//     const headers = req.headers;
//     console.log("HEADERS START\n", headers, "\nHEADERS END");
//     let user = undefined;
//     //This will do the magic to log a person in.
//     //Get person with shibbolethid??
//     if (user) {
//         res.status(200).json(user);
//     } else {
//         res.status(500);
//     }
// }

export async function logout(req, res) {
    if (req.session.user_id) {
        delete req.session.user_id;
        delete req.session.shib_session_id;
    }
    if (req.headers['shib_logout_url']){
        res.redirect(req.headers['shib_logout_url']);
    }
}


//Return user
export async function showUser(req, res) {
    if (req.session.user_id) {
        try {
            const persons = await personService.getPersonById(req.session.user_id);
            let user = persons[0]

            const roleToId = await roleService.getRoles();
            const studyfieldToId = await studyfieldService.getAllStudyfields();
            const personRoles = await roleService.getPersonRoles(user.personId);
            const readableRoles = personRoles.map(role => {
                return {
                    studyfield: studyfieldToId.find(studyfieldIdPair => studyfieldIdPair.studyfieldId === role.studyfieldId).name,
                    role: roleToId.find(roleIdPair => roleIdPair.roleId === role.roleId).name
                }
            })
            user.roles = readableRoles;

            res.status(200).json(user);
        } catch (err) {
            res.status(500).end();
        }
    } else {
        res.status(401).end();
    }
}

//Used without shibboleth
export async function fakeLogin(req, res) {
    const shibbolethId = req.params.id;
    console.log("Faking login with " + shibbolethId);
    try {
        const persons = await personService.getPersonByShibbolethId(shibbolethId);
        let user = persons[0]

        req.session.user_id = user.personId;

        const roleToId = await roleService.getRoles();
        const studyfieldToId = await studyfieldService.getAllStudyfields();
        const personRoles = await roleService.getPersonRoles(user.personId);
        const readableRoles = personRoles.map(role => {
            return {
                studyfield: studyfieldToId.find(studyfieldIdPair => studyfieldIdPair.studyfieldId === role.studyfieldId).name,
                role: roleToId.find(roleIdPair => roleIdPair.roleId === role.roleId).name
            }
        })
        user.roles = readableRoles;

        res.status(200).json(user);
    } catch (err) {
        res.status(500).end();
    }
}