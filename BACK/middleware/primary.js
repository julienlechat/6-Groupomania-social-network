const fn = require('./function')

exports.tokenExport = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    var { userId, role } = fn.tokenView(token)

    req.token = {
        userId: userId,
        role: role
    }

    next()
}