const express = require('express')
const bouncer = require('express-bouncer')(30000, 800000, 3) // anti-bruteforce, après 3 erreurs -> attendre entre 30s et 800s
const route = express.Router()
const userCtrl = require('../controllers/users')

const primary = require('../middleware/primary')

route.post('/signup', userCtrl.signup)
route.post('/login', bouncer.block, userCtrl.login)
route.get('/islogged', primary.tokenExport, userCtrl.isLogged)
route.get('/ctrlToken', primary.tokenExport, userCtrl.ctrlToken)

module.exports = route