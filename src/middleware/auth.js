/**
 * Authentication middleware that is called before any requests.
 *
 */
module.exports.authenticate = (req, res, next) => {
    //const shibbolethId = req.headers.shibbolointiId;
    /*const userId = req.body.userId;
    const data = req.body.data;

    if (!userId) {
        res.sendStatus(403);
    }

    req.body = {
        userId,
        data
    }*/

    next();
};