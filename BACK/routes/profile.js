const express = require('express')
const route = express.Router()
const profileCtrl = require('../controllers/profile')
const imgprofile = require('../middleware/img_profile')

const primary = require('../middleware/primary')

route.get('/:id', primary.tokenExport, profileCtrl.getProfileById)
route.post('/setting', primary.tokenExport, imgprofile, profileCtrl.editProfile)
route.delete('/delete', primary.tokenExport, profileCtrl.deleteProfile)

module.exports = route