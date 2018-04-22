var xForwardedProtoHeader = 'x-forwarded-proto';
var hostHeader = 'host';
var httpsProtocol = 'https';
var permanentRedirectStatusCode = 301;

function httpsRedirect(req, res, next) {
    var xForwardedProtoHeaderValue = req.get(xForwardedProtoHeader);
    var hostValue = req.get(hostHeader) || req.hostname;
    if (xForwardedProtoHeaderValue && xForwardedProtoHeaderValue !== httpsProtocol) {
        res.redirect(permanentRedirectStatusCode, `${httpsProtocol}://${hostValue}${req.originalUrl}`);
    }
    next();
}

module.exports = httpsRedirect;