const multer = require('multer')
const moment = require('moment')

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'uploads/')
    },
    filename(req, file, cb){
        const date = moment().format('DDMMYYYY-HHmmss_SSS')
        req.file= file
        const filename = `${date}-${file.originalname}`
        req.file.path = `uploads\\${filename}`
            cb(null, filename)
    }
})

//проверка на подходящий форматSLOMANA
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'text/plain') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({storage},fileFilter)