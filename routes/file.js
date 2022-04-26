const express = require('express')
const passport = require('passport')
const upload = require('../middleware/upload')
const controller = require('../controllers/file')
const router = express.Router()

router.get('/', passport.authenticate('jwt',{session: false}), controller.getAll)
router.get('/:fileid', passport.authenticate('jwt',{session: false}), controller.getById)
router.delete('/:fileid', passport.authenticate('jwt',{session: false}), controller.remove)
router.post('/', passport.authenticate('jwt',{session: false}), upload.any(), controller.create)
router.get('/get/:fileid', passport.authenticate('jwt',{session: false}), controller.download)
router.post('/share/c/:fileid', passport.authenticate('jwt',{session: false}), controller.createShare)
router.post('/share/add/:sharehash', passport.authenticate('jwt',{session: false}), controller.addAccess)
router.post('/share/rmv/:fileid', passport.authenticate('jwt',{session: false}), controller.removeAccess)
// router.patch('/share/r/:fileid', passport.authenticate('jwt',{session: false}), controller.removeSharedUsers)
// router.patch('/share/:sharehash', passport.authenticate('jwt',{session: false}), controller.addSharedUser)ny kwai;
module.exports= router