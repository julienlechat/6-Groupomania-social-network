const express = require('express')
const route = express.Router()
const profileCtrl = require('../controllers/profile')

const primary = require('../middleware/primary')

route.get('/:id', primary.tokenExport, profileCtrl.getProfileById)

module.exports = route