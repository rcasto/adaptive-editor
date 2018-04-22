var hostHeader = 'host';
var permanentRedirectStatusCode = 301;
var rootIndexPathRegex = /^\/index\.html$/;

function rootRedirect(req, res, next) {
    var hostValue = req.get(hostHeader) || req.hostname;
    if (rootIndexPathRegex.test(req.path)) {
        let newUrl = req.originalUrl.replace(rootIndexPathRegex, '/');
        res.redirect(permanentRedirectStatusCode, `${req.protocol}://${hostValue}${newUrl}`);
    } else {
        next();
    }
}

module.exports = rootRedirect;