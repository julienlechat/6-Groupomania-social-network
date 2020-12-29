const jwt = require('jsonwebtoken')

exports.post = (req, res, next) => {

    //Réception des informations
    const {post} = req.body
    const token = req.headers.authorization.split(' ')[1]

    //Check l'utilisateur et récupére son id
    const check = () => {
        if (token) {
            const { userId } = jwt.verify(token, 'W0TFH87VH8NgAINL-EQrXbaBZ-A0i2lrnENcv6zzqsz70QnJ2vQOfif3RaUp2Py9lBRpVTsmnkGuawKGHJ6dbLSvIqoAJKo2V2X4oACal0')
            return userId
        }
        throw new AuthError()
    }

    if (!post && req.file) {
        console.log("j'ai recu 0 post et 1 image")
    } else if (post && !req.file) {
        console.log("j'ai recu 1 post et 0 image")
    } else {
        console.log("j'ai recu 1 post et 1 image")
    }

    //console.log(req.file.filename)
    res.status(201).json({message: 'ok'})


}