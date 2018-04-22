var hostHeader = 'host';
var permanentRedirectStatusCode = 301;
var wwwRegex = /^www\./;

function wwwToNonWwwRedirect(req, res, next) {
    var hostValue = req.get(hostHeader) || req.hostname;
    if (wwwRegex.test(hostValue)) {
        hostValue = hostValue.replace(wwwRegex, '');
        res.redirect(permanentRedirectStatusCode, `${req.protocol}://${hostValue}${req.originalUrl}`);
    } else {
        next();
    }
}

module.exports = wwwToNonWwwRedirect;