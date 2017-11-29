/**
 * Authentication middleware that is called before any requests.
 *
 */
module.exports.authenticate = (req, res, next) => {
    //const userId = req.headers.;
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