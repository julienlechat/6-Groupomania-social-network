const jwt = require('jsonwebtoken')

// RETOURNE l'userId
exports.userId = (token) => {
        if (token) {
            const { userId } = jwt.verify(token, 'W0TFH87VH8NgAINL-EQrXbaBZ-A0i2lrnENcv6zzqsz70QnJ2vQOfif3RaUp2Py9lBRpVTsmnkGuawKGHJ6dbLSvIqoAJKo2V2X4oACal0', 
            (err, decoded) => decoded !== undefined ? decoded : err)
            
            return userId
        }
        throw 'error token with post'
}