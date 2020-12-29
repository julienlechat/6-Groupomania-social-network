const multer = require('multer')

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {callback(null, 'images')},
  filename: (req, file, callback) => {
    const nameWithoutExt = file.originalname.split('.')[0] 
    const name = nameWithoutExt.split(' ').join('_')
    const extension = MIME_TYPES[file.mimetype]
    callback(null, name + Math.floor(Math.random() * 999) + '-' + Date.now() + '.' + extension)
  }
})

module.exports = multer({storage: storage}).single('image')