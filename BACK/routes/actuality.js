const express = require('express')
const route = express.Router()
const actuCtrl = require('../controllers/actuality')

const multer = require('../middleware/multer')

route.post('/post', multer, actuCtrl.post)
route.get('/actus', actuCtrl.getActus, actuCtrl.getActusLike)
route.post('/like', actuCtrl.likePost)
route.post('/dislike', actuCtrl.dislikePost)

module.exports = route