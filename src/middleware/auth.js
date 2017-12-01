/**
 * Authentication middleware that is called before any requests.
 *
 */
module.exports.authenticate = (req, res, next) => {
    //if dev then
    const shibbolethId = req.headers.shibbolointiid;

    //if actual then
    //const shibbolethId = req.headers.

    if (!shibbolethId) {
        res.sendStatus(403);
    }

    req.headers.grappashibbolethid = shibbolethId
    next();
};