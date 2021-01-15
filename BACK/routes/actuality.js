const express = require('express')
const route = express.Router()
const actuCtrl = require('../controllers/actuality')

const primary = require('../middleware/primary')
const multer = require('../middleware/multer')

route.post('/post', primary.tokenExport, multer, actuCtrl.post)
route.get('/actus', primary.tokenExport, actuCtrl.getActus)
route.post('/like', primary.tokenExport, actuCtrl.likePost)
route.post('/dislike', primary.tokenExport, actuCtrl.dislikePost)
route.post('/addComment', primary.tokenExport, actuCtrl.checkPost, actuCtrl.addComment)
route.delete('/delete/post/:id', primary.tokenExport, actuCtrl.deletePost)
route.delete('/delete/coment/:id', primary.tokenExport, actuCtrl.deleteCom)

module.exports = route