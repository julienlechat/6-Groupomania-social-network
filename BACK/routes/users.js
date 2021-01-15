const express = require('express')
const route = express.Router()
const userCtrl = require('../controllers/users')

const primary = require('../middleware/primary')

route.post('/signup', userCtrl.signup)
route.post('/login', userCtrl.login)
route.post('/islogged', primary.tokenExport, userCtrl.isLogged)

module.exports = route