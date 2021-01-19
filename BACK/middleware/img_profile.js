const multer = require('multer')

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {callback(null, 'images/profile')},
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype]
    callback(null, 'profile' + Math.floor(Math.random() * 9999) + '-' + Date.now() + '.' + extension)
  }
})

module.exports = multer({storage: storage}).single('image')