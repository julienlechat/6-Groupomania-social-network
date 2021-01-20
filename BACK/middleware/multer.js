const multer = require('multer')

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {callback(null, 'images/post')},
  filename: (req, file, callback) => {
    const nameWithoutExt = file.originalname.split('.')[0]
    const extension = MIME_TYPES[file.mimetype]
    callback(null, 'post' + Math.floor(Math.random() * 9999) + '-' + Date.now() + '.' + extension)
  }
})

module.exports = multer({storage: storage}).single('image')