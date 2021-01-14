const jwt = require('jsonwebtoken')

// Retourne le contenu du token
exports.tokenView = (token) => {
    if (token) {

            try {
                tokenDecrypt = jwt.verify(token, 'W0TFH87VH8NgAINL-EQrXbaBZ-A0i2lrnENcv6zzqsz70QnJ2vQOfif3RaUp2Py9lBRpVTsmnkGuawKGHJ6dbLSvIqoAJKo2V2X4oACal0')
            } catch {
                throw 'token invalid';
            }
            if (isNaN(tokenDecrypt.userId) && isNaN(tokenDecrypt.role)) throw 'token invalid: not a number'

            return tokenDecrypt
        }
        throw 'error token with post'
}